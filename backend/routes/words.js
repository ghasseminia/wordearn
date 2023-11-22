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
    const words = await Word.find({
      user: new mongoose.Types.ObjectId(userId),
    });
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
    const newWord = new Word({ ...wordData, user: userId, isActive: true });

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

// Endpoint to get the next word for a specific user and increment its 'times_shown'
// example curl http://localhost:9897/next-word/654844620a4266d21f5225b0
router.get("/next-word/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user ID.");
    }

    // Find the word for the user that has been shown the least number of times
    const words = await Word.find({ user: new mongoose.Types.ObjectId(userId) })
      .sort({ times_shown: 1 })
      .limit(1);

    if (words.length === 0) {
      return res.status(404).send("No words found for the user.");
    }

    const nextWord = words[0];

    // Increment the 'times_shown' field for the retrieved word
    nextWord.times_shown += 1;
    await nextWord.save();

    res.status(200).json(nextWord);
  } catch (error) {
    res.status(500).send(`Error retrieving the next word: ${error.message}`);
  }
});

// Endpoint to update the 'times_remembered' for a word
// example
// curl -X POST -H "Content-Type: application/json" -d '{"wordId":"wordObjectId", "remembered":true}' http://localhost:9897/update-recall

router.post("/update-recall", async (req, res) => {
  try {
    const { wordId, remembered } = req.body;

    // Check if the provided wordId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(wordId)) {
      return res.status(400).send("Invalid word ID.");
    }

    // Find the word by ID
    const word = await Word.findById(wordId);
    if (!word) {
      return res.status(404).send("Word not found.");
    }

    // Update 'times_remembered' based on whether the user remembered the word
    if (remembered) {
      word.times_remembered += 1;
      await word.save();
    }

    res.status(200).send("Word recall updated successfully.");
  } catch (error) {
    res.status(500).send(`Error updating word recall: ${error.message}`);
  }
});

// Endpoint to update the 'times_remembered' for a word
// example
// curl -X POST -H "Content-Type: application/json" -d '{"wordId":"wordObjectId", "remembered":true}' http://localhost:9897/update-recall

router.post("/update-active", async (req, res) => {
  try {
    const { wordId, isActive } = req.body;

    // Check if the provided wordId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(wordId)) {
      return res.status(400).send("Invalid word ID.");
    }

    // Find the word by ID
    const word = await Word.findById(wordId);
    if (!word) {
      return res.status(404).send("Word not found.");
    }

    // Update 'times_remembered' based on whether the user remembered the word

    word.isActive = isActive;
    await word.save();

    res.status(200).send("Word recall updated successfully.");
  } catch (error) {
    res.status(500).send(`Error updating word recall: ${error.message}`);
  }
});

module.exports = router;
