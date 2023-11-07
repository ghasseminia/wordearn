const express = require("express");
const Word = require("../models/word");
const User = require("../models/user");
const mongoose = require("mongoose");

const router = express.Router();

// http://localhost:9897/user-words/654844620a4266d21f5225b0
// Endpoint to get all words for a specific user
router.get("/user-words/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    // Check if the provided userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user ID.");
    }

    // Find all words associated with the user ID
    const words = await Word.find({ user: new mongoose.Types.ObjectId(userId) });
    res.status(200).json(words);
  } catch (error) {
    res.status(500).send(`Error retrieving words: ${error.message}`);
  }
});

// Endpoint to add a new word
router.post("/add-word", async (req, res) => {
  try {
    // Extract the user ID from the request body
    const { userId, ...wordData } = req.body;

    // Create a new word with the user ID
    const newWord = new Word({ ...wordData, user: userId });

    // Save the word to the database
    await newWord.save();

    res.status(201).send("Word added successfully!");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Endpoint to add multiple words and different users for each user
// example: [{"word":"liberté","meaning":"The state of being free","language":"French", "user":"654844620a4266d21f5225b0"}, {"word":"égalité","meaning":"The state of being equal","language":"French", "user":"654844620a4266d21f5225b0"}]
router.post("/add-words-diff-users", async (req, res) => {
  try {
    // Expecting an array of word objects in the request body
    const words = req.body;

    // Validate words is an array
    if (!Array.isArray(words)) {
      return res.status(400).send("Words should be an array.");
    }

    // Use `insertMany` for efficient bulk insertion
    await Word.insertMany(words);
    res.status(201).send("Words added successfully!");
  } catch (error) {
    res.status(500).send(`Error adding words: ${error.message}`);
  }
});

//sample JSON file
//{"userId":"654844620a4266d21f5225b0", "words":[{"word":"liberté","meaning":"The state of being free","language":"French"}, {"word":"égalité","meaning":"The state of being equal","language":"French"}]}
router.post("/add-words", async (req, res) => {
  try {
    const { userId, words } = req.body; // Assume a single userId for all words

    if (!userId) return res.status(400).send("UserId is required.");
    if (!Array.isArray(words))
      return res.status(400).send("Words should be an array.");

    const wordsWithUserId = words.map((word) => ({
      ...word,
      user: new mongoose.Types.ObjectId(userId),
    }));

    await Word.insertMany(wordsWithUserId);
    res.status(201).send("Words added successfully!");
  } catch (error) {
    res.status(500).send(`Error adding words: ${error.message}`);
  }
});

module.exports = router;
