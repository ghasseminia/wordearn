const mongoose = require("mongoose");

// Mongoose user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  // Include other user fields as necessary, such as hashed password, etc.
  created_at: { type: Date, default: Date.now },
});

// Mongoose user model
const User = mongoose.model("User", userSchema);

module.exports = User;
