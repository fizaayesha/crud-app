const express = require("express");

const Note = require("../models/note.js");
const auth = require("../middlewares/auth.js");

const router = new express.Router();

router.post("/notes", auth, async (req, res) => {
  const note = new Note({
    ...req.body,
    owner: req.user._id,
    sharedWith: req.body.sharedWith,
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
    const note = await Note.findById({ _id: req.params.id });
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
    const note = await Note.findOneAndDelete({ _id: req.params.id });

    if (!note) {
      return res.status(404).send();
    }
    res.send({ message: "Note was deleted" });
  } catch (e) {
    res.status(500).send();
  }
});

// Share a note with another user for the authenticated user
router.post("/notes/:id/share", auth, async (req, res) => {
  try {
    const { sharedUserId } = req.body;

    const sharedNote = await Note.findOneAndUpdate(
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

router.get("/notes/search/:key", auth, async (req, res) => {
  console.log(req.params.key);
  try {
    let data = await Note.find({
      $or: [
        {
          title: { $regex: req.params.key },
        },
        {
          content: { $regex: req.params.key },
        },
      ],
    });
    console.log(data);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
