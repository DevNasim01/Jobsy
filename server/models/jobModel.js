const mongoose = require("mongoose");

// Define the job schema
const jobSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  jobRole: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: Number, required: true },
  tags: [String], // Tags can be an array of strings
  companyLogo: { type: String }, // File path for the logo
  formLink: { type: String, required: true },
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt' fields

// Create the Job model
const Job = mongoose.model("Job", jobSchema);

module.exports = Job; // Export the Job model
