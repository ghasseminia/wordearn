const express = require("express");
const User = require("../models/user");

const router = express.Router();

// Endpoint to add a new user
router.post("/add-user", async (req, res) => {
  try {
    // Create a new user from the request body
    const newUser = new User(req.body);

    // Save the user to the database
    await newUser.save();

    res.status(201).send("User added successfully!");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Endpoint to get userId by email
// curl "http://localhost:9897/get-userid-by-email?email=user@example.com"
router.get('/get-userid-by-email', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).send('Email is required.');
    }
    
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send('User not found.');
    }
    
    res.status(200).json({ userId: user._id });
  } catch (error) {
    res.status(500).send(`Error retrieving user ID: ${error.message}`);
  }
});

module.exports = router;
