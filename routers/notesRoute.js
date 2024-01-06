const express = require("express");
const router = new express.Router();
const NoteSchema = require("../models/Notes");

// router.post("/api/notes", async (req, res) => {
//   try {
//     const addingNotes = new NoteSchema(req.body);
//     console.log(req.body);
//     const insertNotes = await addingNotes.save();
//     res.send(insertNotes);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

// Create a new note
router.post("/api/notes", async (req, res) => {
  try {
    console.log("req.user:", req.user);
    const { title, content } = req.body;
    const newNote = new NoteSchema({
      title,
      content,
      owner: req.user.id,
      sharedWith: req.body.sharedWith,
    });
    await newNote.save();
    res.status(201).json({ message: "Note created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message);
  }
});

// Get all notes for the authenticated user
router.get("/api/notes", async (req, res) => {
  try {
    const getNotes = await NoteSchema.find({ owner: req.user.id });
    res.status(201).send(getNotes);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get a specific note by ID
router.get("/api/notes/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const getNote = await NoteSchema.findById({ _id });
    res.status(201).send(getNote);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Update a note by ID
router.put("/api/notes/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const getNote = await NoteSchema.findByIdAndUpdate(_id, req.body);
    res.send(getNote);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Delete a note by ID
router.delete("/api/notes/:id", async (req, res) => {
  try {
    const getNote = await NoteSchema.findByIdAndDelete(req.params.id);
    res.send(getNote);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Share a note with another user for the authenticated user
router.post("/api/notes/:id/share", async (req, res) => {
  try {
    const { sharedUserId } = req.body;

    const sharedNote = await NoteSchema.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { $addToSet: { sharedWith: sharedUserId } },
      { new: true }
    );

    if (!sharedNote) return res.status(404).json({ message: "Note not found" });

    res.json({ message: "Note shared successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search for notes based on keywords for the authenticated user
router.get("/api/search", async (req, res) => {
  try {
    const query = req.query.q;

    const notes = await NoteSchema.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
      $or: [{ owner: req.user.id }, { sharedWith: req.user.id }],
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
