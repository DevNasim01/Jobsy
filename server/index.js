const express = require("express");
const cors = require("cors");
require('dotenv').config();
const mongoose = require("mongoose");
const Job = require("./models/jobModel");
const SupportMessage = require("./models/supportMessageModel")
const compression = require("compression");

const app = express();
const PORT = process.env.PORT || 3000; // Use dynamic port for deployment

app.use(compression());

const corsConfig = {
  origin: [
    "https://jobsy-mauve.vercel.app", // Your frontend domain
    "https://jobsy-azure.vercel.app", // Your backend domain
    "http://localhost:3000", // for local development
    "http://localhost:5173" // Vite default port
  ],
  methods: ["GET", "POST", "OPTIONS"], // Add OPTIONS
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}

app.use(cors(corsConfig));

// Explicitly handle preflight for all routes
app.options('*', cors(corsConfig));
app.use(express.json());
// Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true }));


// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


// Route to handle job submission (NO multer, ONLY JSON)
app.post("/api/submit-job", async (req, res) => {
  try {
    const { 
      companyName, 
      companyLogo,   // already a URL from frontend
      jobRole, 
      jobType, 
      location, 
      salary, 
      tags, 
      formLink 
    } = req.body;

    // Validation
    if (!companyName || !jobRole || !jobType || !location || !salary || !formLink) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const formatData = (str) => str.toLowerCase().replace(/\s+/g, "_");

    const newJob = new Job({
      companyName: formatData(companyName),
      jobRole: formatData(jobRole),
      jobType: formatData(jobType),
      location: formatData(location),
      salary: encodeURIComponent(salary),
      tags: tags ? tags.split(",").map((tag) => formatData(tag)) : [],
      companyLogo, // directly save Cloudinary URL
      formLink: encodeURIComponent(formLink),
    });

    await newJob.save();
    return res.status(200).json({ message: "Job submission successful" });

  } catch (err) {
    console.error("Error submitting job:", err);
    return res.status(500).json({ message: "Server error" });
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

  // Match tags against companyName, jobRole, location, jobType, or tags field
  query["$or"] = [
    { tags: { $in: tagsArray.map((tag) => new RegExp(tag, "i")) } }, // Match against tags
    { companyName: { $in: tagsArray.map((tag) => new RegExp(tag, "i")) } }, // Match against companyName
    { jobRole: { $in: tagsArray.map((tag) => new RegExp(tag, "i")) } }, // Match against jobRole
    { location: { $in: tagsArray.map((tag) => new RegExp(tag, "i")) } }, // Match against location
    { jobType: { $in: tagsArray.map((tag) => new RegExp(tag, "i")) } }, // Match against jobType
  ];
} else {
  // If no tags are provided, match other fields using regex (case-insensitive)
  for (const key in req.query) {
    if (key === "location") {
      const locationsArray = req.query[key].split(",").map((loc) => loc.trim());
      query[key] = { $in: locationsArray.map((loc) => new RegExp(loc, "i")) }; // Match any of the provided locations case-insensitively
    } else if (key === "jobType") {
      query[key] = { $regex: new RegExp(req.query[key], "i") }; // Match jobType if provided
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
        companyLogo: job.companyLogo,
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
