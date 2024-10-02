const express = require("express");
const multer = require("multer");
const cors = require("cors");
require('dotenv').config(); // Load environment variables
const path = require("path");
const mongoose = require("mongoose"); // Import mongoose
const Job = require("./models/jobModel"); // Import the Job model

const app = express(); 
const PORT = 3000;

// Middleware to handle CORS (Cross-Origin Resource Sharing)
app.use(cors());
// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up Multer storage configuration to store the uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Files will be saved to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to the file name to avoid duplicates
  },
});

const upload = multer({ storage });

// Parse JSON bodies for POST requests (if needed for other endpoints)
app.use(express.json());

// MongoDB connection using Mongoose
mongoose
  .connect(process.env.MONGODB_URI, { // Use environment variable for MongoDB URI
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Route to handle the form submission
app.post("/api/submit-job", upload.single("companyLogo"), async (req, res) => {
    const { companyName, jobRole, location, salary, tags, formLink } = req.body;
    const companyLogo = req.file;

    // Check if the logo is uploaded successfully
    if (companyLogo) {
      console.log("Uploaded company logo:", companyLogo.filename);
    }

    // Check if required fields are present
    if (!companyName || !jobRole || !location || !salary || !formLink) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    try {
      const newJob = new Job({
        companyName,
        jobRole,
        location,
        salary,
        tags: tags ? tags.split(",") : [],
        companyLogo: companyLogo ? companyLogo.filename : null,
        formLink // Save formLink
      });

      await newJob.save();
      res.status(200).json({ message: "Job submission successful" });
    } catch (error) {
      console.error("Error saving job:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
});

// Route to fetch all jobs

app.get("/", (req, res) => {
  res.send("Welcome to the Job Board API");
});

app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await Job.find(); // Fetch all jobs from the database
      res.status(200).json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Server error" });
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
