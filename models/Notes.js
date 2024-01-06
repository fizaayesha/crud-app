const mongoose = require("mongoose");

// Define the schema for the Note model
const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // References the User model
    ref: "User", // Refers to the "User" collection in the database
    required: true,
  },
  sharedWith: {
    type: mongoose.Schema.Types.ObjectId, // References the User model
    ref: "User", // Refers to the "User" collection in the database
  },
});

module.exports = mongoose.model("Note", NoteSchema);
