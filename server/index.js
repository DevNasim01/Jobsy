const express = require("express");
const multer = require("multer");
const cors = require("cors");
require('dotenv').config(); // Load environment variables from .env file
const path = require("path");
const mongoose = require("mongoose");
const fs = require('fs');
const Job = require("./models/jobModel"); // Assuming you have this model defined in models/jobModel.js

const app = express(); 
const PORT = process.env.PORT || 3000; // Use dynamic port for deployment

// Middleware to handle CORS
const allowedOrigins = [
  "https://jobsy-mauve.vercel.app", // Add your front-end origin for production
  "http://localhost:5173" // Add localhost for development
];
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

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

// Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// POST route to handle job submission
app.post('/api/submit-job', upload.single('companyLogo'), (req, res) => {
  try {
    // Access form fields
    const { companyName, jobRole, location, salary, tags, formLink } = req.body;

    // Access the file (company logo)
    const companyLogo = req.file; // Handled by multer

    if (!companyLogo) {
      return res.status(400).json({ message: 'Company logo is required' });
    }

    // Handle form data and save to DB or do other operations...
    console.log({
      companyName,
      companyLogo: companyLogo.filename, // Save filename or full path to the DB
      jobRole,
      location,
      salary,
      tags,
      formLink,
    });

    // Send success response
    return res.status(200).json({ message: 'Job submitted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
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
    const jobs = await Job.find(); // Fetch all jobs from the database

    // Map the jobs to include the full URL for companyLogo
    const updatedJobs = jobs.map(job => {
      return {
        ...job._doc, // Include all job fields
        companyLogo: job.companyLogo ? `${req.protocol}://${req.get('host')}/uploads/${job.companyLogo}` : null
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
