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

module.exports = router;
