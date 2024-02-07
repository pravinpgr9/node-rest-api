const router = require("express").Router();
const Linkedpost = require("../models/Linkedpost");

router.get("/", (req, res) => {
  res.send("Welcome to LinkedPost routes rest API");
});

// CREATE API
router.post("/", async (req, res) => {
  try {
    const { name, email, desc, city } = req.body;

    // Check if all required fields are present
    if (!name || !email || !desc || !city) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    const newLinkedpost = new Linkedpost({
      name,
      email,
      desc,
      city,
    });

    const savedLinkedpost = await newLinkedpost.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Linked post created successfully",
        data: savedLinkedpost,
      });
  } catch (error) {
    // Handle specific error types
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "An unexpected error occurred" });
    }
  }
});

module.exports = router;
