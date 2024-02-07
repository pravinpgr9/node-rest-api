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
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const newLinkedpost = new Linkedpost({
      name,
      email,
      desc,
      city,
    });

    const savedLinkedpost = await newLinkedpost.save();
    res.status(201).json(savedLinkedpost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
