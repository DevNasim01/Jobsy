const express = require("express");
const multer = require("multer");
const cors = require("cors");
require('dotenv').config(); // Load environment variables from .env file
const path = require("path");
const mongoose = require("mongoose");
const fs = require('fs');
const Job = require("./models/jobModel");
const SupportMessage = require("./models/supportMessageModel")

const app = express();
const PORT = process.env.PORT || 3000; // Use dynamic port for deployment

// Middleware to handle CORS
const allowedOrigins = [
  "http://localhost:5173" // Add localhost for development
];

const corsConfig = {
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true,
}

app.use(express.json());
app.use(cors(corsConfig));
// Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Ensure that the 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Files will be saved in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid duplicate names
  },
});

// File size and type validation
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 2 }, // 2MB size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Incorrect file type. Only JPEG, PNG, and GIF allowed.");
      error.status = 400;
      return cb(error, false);
    }
    cb(null, true);
  },
});

// Route to handle form submission
app.post("/api/submit-job", upload.single("companyLogo"), async (req, res) => {
  const { companyName, jobRole, location, salary, tags, formLink, jobType } = req.body;
  const companyLogo = req.file;

  if (!companyName || !jobRole || !location || !salary || !formLink || !jobType) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    // Function to format form data
    const formatFormData = (data) => {
      return data.toLowerCase().replace(/\s+/g, '_');
    };

    const formattedData = {
      companyName: formatFormData(companyName.trim()),
      jobRole: formatFormData(jobRole.trim()),
      jobType: formatFormData(jobType.trim()),
      location: formatFormData(location.trim()),
      salary: encodeURIComponent(salary.trim()),
      tags: tags ? tags.split(',').map(tag => formatFormData(tag.trim())) : [],
      companyLogo: companyLogo ? companyLogo.filename : null,
      formLink: encodeURIComponent(formLink.trim()),
    };

    const newJob = new Job(formattedData);
    await newJob.save();
    res.status(200).json({ message: "Job submission successful" });
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});



// Error handling middleware (optional for handling file type/size errors)
app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message });
  } else {
    next();
  }
});

// Route to fetch all jobs
app.get("/api/jobs", async (req, res) => {
  try {
    // Prepare a query object
    const query = {};

    // Handle salary range
    if (req.query.salary) {
      const [minSalary, maxSalary] = req.query.salary.split("-").map(Number);
      if (!isNaN(minSalary) && !isNaN(maxSalary)) {
        query.salary = { $gte: minSalary, $lte: maxSalary }; // Filter jobs within the salary range
      }
    }

    // Check if there are any tags in the query
    if (req.query.tags) {
      const tagsArray = req.query.tags.split(",").map((tag) => tag.trim());

      // Match tags against companyName, jobRole, location, or tags field
      query["$or"] = [
        { tags: { $in: tagsArray.map((tag) => new RegExp(tag, "i")) } }, // Match against tags
        { companyName: { $in: tagsArray.map((tag) => new RegExp(tag, "i")) } }, // Match against companyName
        { jobRole: { $in: tagsArray.map((tag) => new RegExp(tag, "i")) } }, // Match against jobRole
        { location: { $in: tagsArray.map((tag) => new RegExp(tag, "i")) } }, // Match against location
      ];
    } else {
      // If no tags are provided, match other fields using regex (case-insensitive)
      for (const key in req.query) {
        if (key === "location") {
          const locationsArray = req.query[key].split(",").map((loc) => loc.trim());
          query[key] = { $in: locationsArray.map((loc) => new RegExp(loc, "i")) }; // Match any of the provided locations case-insensitively
        } else if (key !== "salary") {
          query[key] = { $regex: new RegExp(req.query[key], "i") }; // Case-insensitive regex for other fields
        }
      }
    }

    // Fetch jobs from the database
    const jobs = await Job.find(query);

    // Helper function to format strings
    const formatString = (str) =>
      str
        .replace(/_/g, " ") // Replace underscores with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word

    // Map the jobs to include the full URL for companyLogo and format fields
    const updatedJobs = jobs.map((job) => {
      return {
        ...job._doc, // Include all job fields
        companyName: formatString(job.companyName),
        jobRole: formatString(job.jobRole),
        jobType: formatString(job.jobType),
        location: formatString(job.location),
        salary: decodeURIComponent(job.salary),
        tags: job.tags.map((tag) => formatString(tag)),
        companyLogo: job.companyLogo
          ? `${req.protocol}://${req.get("host")}/uploads/${job.companyLogo}`
          : null,
        formLink: decodeURIComponent(job.formLink),
      };
    });

    res.status(200).json(updatedJobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Route to handle contact form submissions
app.post("/api/contact", async (req, res) => {
  const { email, subject, message, username } = req.body;

  if (!email || !subject || !message || !username) {
    return res.status(400).json({ message: "Required fields are missing." });
  }

  try {
    // Create a new support message entry
    const newMessage = new SupportMessage({
      email,
      subject,
      message,
      username,
    });

    await newMessage.save(); // Save the message to the database
    res.status(200).json({ message: "Message received successfully!" });
  } catch (error) {
    console.error("Error handling contact form submission:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});




// Base route to check the server status
app.get("/", (req, res) => {
  res.send("Welcome to the Job Board API");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
