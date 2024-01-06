const express = require("express");
const auth = require("../middleware");
const NoteSchema = require("../models/Notes.js");


const router = express.Router();

router.post("/notes", auth, async (req, res) => {
    const note = new NoteSchema({
        ...req.body,
        owner: req.user._id,
    });
    try {
        await note.save();
        res.status(201).send({ note, message: "Note Saved" });
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get("/notes", auth, async (req, res) => {
    try {
        // await req.user.populate("notes");

        // res.status(200).send(req.user.notes);

        await req.user.populate("notes");

        console.log(req.user.notes);

        res.send(req.user.notes);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

router.get("/notes/:id", auth, async (req, res) => {
    try {
        const note = await NoteSchema.findById({ _id: req.params.id });
        if (!note) {
            return res.status(404).send();
        }
        res.send(note);
    } catch (e) {
        res.status(500).send();
    }
});

router.delete("/notes/:id", auth, async (req, res) => {
    try {
        const note = await NoteSchema.findOneAndDelete({ _id: req.params.id });

        if (!note) {
            return res.status(404).send();
        }
        res.send({ message: "Note was deleted" });
    } catch (e) {
        res.status(500).send();
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
