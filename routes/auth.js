const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    //Generate the ne wPassowrd
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create the User
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //Save user and return
    const user = await newUser.save();
    // Respond with the created user
    res.status(201).json(user);
  } catch (err) {
    // Handle validation errors
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((error) => error.message);
      return res.status(400).json({ error: errors });
    }

    // Handle duplicate key errors (unique constraint violation)
    if (err.code === 11000) {
      return res.status(400).json({ error: "Duplicate key error" });
    }

    // Handle other errors
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//LOGIN

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    // Check the password
    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass) {
      return res
        .status(401)
        .json({ error: "Unauthorized - Incorrect Password" });
    }

    // Successful login
    res.status(200).json({ message: "Login Successful", user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
