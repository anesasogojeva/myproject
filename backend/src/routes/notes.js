const express = require("express");
const router = express.Router();
const { Note } = require("../models/mysql/Note");
const User = require("../models/mysql/User");


// GET notes for a client
router.get("/:clientId", async (req, res) => {
  try {
    const clientId = Number(req.params.clientId);

    const client = await User.findByPk(clientId);
    if (!client) return res.status(404).json({ message: "Client not found" });

    const notes = await Note.findAll({
      where: { clientId },
      include: [
        { model: User, as: "dietitian", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// CREATE note
router.post("/", async (req, res) => {
  try {
    const { clientId, dietitianId, content } = req.body;

    if (!clientId || !dietitianId || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const client = await User.findByPk(clientId);
    const dietitian = await User.findByPk(dietitianId);

    if (!client || client.role.toLowerCase() !== "user") {
      return res.status(400).json({ message: "Invalid client ID" });
    }

    if (!dietitian || dietitian.role.toLowerCase() !== "dietitian") {
      return res.status(400).json({ message: "Invalid dietitian ID" });
    }

    const note = await Note.create({ clientId, dietitianId, content });
    res.status(201).json(note);
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// UPDATE note
router.put("/:id", async (req, res) => {
  try {
    const { content } = req.body;
    const noteId = Number(req.params.id);

    if (!content)
      return res.status(400).json({ message: "Content is required" });

    const note = await Note.findByPk(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    await note.update({ content });
    res.json(note);
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// DELETE note
router.delete("/:id", async (req, res) => {
  try {
    const noteId = Number(req.params.id);

    const note = await Note.findByPk(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    await note.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
