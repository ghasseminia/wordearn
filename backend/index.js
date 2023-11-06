require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const wordRoutes = require("./routes/words");
const userRoutes = require("./routes/users");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Connection URI from MongoDB Atlas (placeholder values)
const uri =
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}` +
  `@${process.env.DB_CLUSTER_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// Connect to MongoDB
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connection established."))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/", wordRoutes);
app.use("/", userRoutes);

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
const PORT = process.env.PORT || 9897;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
