const express = require("express");

const Note = require("../models/note.js");
const auth = require("../middlewares/auth.js");

const router = new express.Router();

router.post("/notes", auth, async (req, res) => {
  const note = new Note({
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

router.get("/notes/search", auth, async (req, res) => {
  try {
    const search = req.query.search; // Use req.query instead of req.body for GET requests
    const pro_data = await Note.find({
      name: { $regex: ".*" + search + ".*", $options: "i" },
    });
    console.log("es");
    if (pro_data.length > 0) {
      res
        .status(200)
        .send({ success: true, msg: "Searched Items Found", data: pro_data });
      console.error("jkhjj"); // Log the error for debugging
    } else {
      res.status(200).send({ success: true, msg: "Searched Items Not Found!" });
      console.log("fs");
    }
  } catch (e) {
    console.error(e); // Log the error for debugging
    res.status(500).send({ success: false, msg: "Internal Server Error" });
  }
});

module.exports = router;
