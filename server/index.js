const express = require("express");
const multer = require("multer");
const cors = require("cors");
require('dotenv').config(); // Load environment variables from .env file
const path = require("path");
const mongoose = require("mongoose");
const fs = require('fs');
const Job = require("./models/jobModel");

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
  const { companyName, jobRole, location, salary, tags, formLink } = req.body;
  const companyLogo = req.file;

  // Helper function to process strings
  const processString = (str) =>
    encodeURIComponent(str.trim().toLowerCase().replace(/\s+/g, "_"));

  // Check if the logo is uploaded successfully
  if (companyLogo) {
    console.log("Uploaded company logo:", companyLogo.filename);
  }

  // Basic validation for required fields
  if (!companyName || !jobRole || !location || !salary || !formLink) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    const newJob = new Job({
      companyName: processString(companyName),
      jobRole: processString(jobRole),
      location: processString(location),
      salary: processString(salary),
      tags: tags
        ? tags.split(",").map((tag) => processString(tag)) // Process each tag
        : [],
      companyLogo: companyLogo ? companyLogo.filename : null, // Save the file name of the uploaded logo
      formLink: encodeURIComponent(formLink.trim()), // URL-encode the form link
    });

    // Save the new job to the database
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
    const jobs = await Job.find(req.query); // Fetch all jobs from the database

    // Helper function to format strings
    const formatString = (str) =>
      str
        .replace(/_/g, " ") // Replace underscores with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word

    // Map the jobs to include the full URL for companyLogo and format fields
    const updatedJobs = jobs.map(job => {
      return {
        ...job._doc, // Include all job fields
        companyName: formatString(job.companyName),
        jobRole: formatString(job.jobRole),
        location: formatString(job.location),
        salary: decodeURIComponent(job.salary), // Decode the URL-encoded salary
        tags: job.tags.map((tag) => formatString(tag)), // Format each tag
        companyLogo: job.companyLogo
          ? `${req.protocol}://${req.get('host')}/uploads/${job.companyLogo}`
          : null,
        formLink: decodeURIComponent(job.formLink) // Decode the URL-encoded form link
      };
    });

    res.status(200).json(updatedJobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error" });
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
