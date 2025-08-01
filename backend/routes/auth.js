const express = require("express");
const user = require("../models/user");
const router = express.Router();

// Get all users route
router.get("/users", async (req, res) => {
  try {
    const users = await user.find({}).select("-__v").sort({ _id: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Register route
router.post("/register", async (req, res) => {
  const { name, phone, pincode } = req.body;
  try {
    // Check if user already exists
    const existingUser = await user.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Create new user
    const newUser = new user({ name, phone, pincode });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
