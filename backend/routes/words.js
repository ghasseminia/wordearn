
const express = require('express');
const Word = require('../models/word');
const User = require('../models/user');

const router = express.Router();

// Endpoint to add a new word
router.post('/add-word', async (req, res) => {
  try {
    // Extract the user ID from the request body
    const { userId, ...wordData } = req.body;

    // Create a new word with the user ID
    const newWord = new Word({ ...wordData, user: userId });
    
    // Save the word to the database
    await newWord.save();
    
    res.status(201).send('Word added successfully!');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
