const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Note = require("../models/note");
const NoteContent = require("../models/noteContent");
const Notes = require("../database/notes");
const Account = require("../models/account");
const note = require("../models/note");

// create note and add it to notebook
router.post("/", async (req, res, next) => {
    try {
        let noteData = req.body;
        noteData.accountId = req.accountId;
        noteData.notebookId = req.notebookId;

        res.status(201).json({
            message: "Note created and added to notebook",
            createdNote
        });
    } catch (err) {
        next(err);
    }
});

router.use("/:noteId", validateNoteId);

// get note by id
router.get("/:id", async (req, res, next) => {
    try {
        let note = await Notes.getById(req.params.id);
        res.status(200).json({ note });
    } catch (err) {
        next(err);
    }
});

// edit note
router.post("/:id", async (req, res, next) => {
    try {
        let newNote = req.body;
        let note = await Notes.updateById(req.params.id, newNote);
        res.status(200).json({ message: "Note updated", note });
    } catch (err) {
        next(err);
    }
});

// delete note
router.delete("/:id", async (req, res, next) => {
    try {
        await Notes.deleteById(req.params.id);
        res.status(200).json({ message: "Note deleted and removed from notebook" });
    } catch (err) {
        next(err);
    }
});

async function validateNoteId(req, res, next) {
    const accountId = req.accountId;
    const noteId = req.params.noteId;
    if (!await Notes.exists(noteId)) return res.sendStatus(404);
    if (accountId != (await Notes.getById(noteId)).owner) return res.sendStatus(403);
    req.noteId = noteId;
    console.log("Validated note id: " + noteId);
    next();
}

module.exports = router;
