const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Mongoose word schema
const wordSchema = new Schema({
  word: String,
  meaning: String,
  times_shown: { type: Number, default: 0 },
  times_remembered: { type: Number, default: 0 },
  language: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  time_added: { type: Date, default: Date.now },
  time_last_shown: Date,
});

// Mongoose word model
const Word = mongoose.model("Word", wordSchema);

module.exports = Word;
