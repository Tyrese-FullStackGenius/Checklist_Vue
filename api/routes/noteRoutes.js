const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Note = require("../models/note");
const NoteContent = require("../models/noteContent");
const Account = require("../models/account");

// create note (does not support adding to notebook)
router.post("/", async (req, res, next) => {
    try {
        const accountId = req.authData._id;

        const noteContent = new NoteContent({
            _id: new mongoose.Types.ObjectId(),
            content: req.body.content,
            owner: accountId
        });

        const note = new Note({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            content: noteContent,
            owner: accountId,
            created: Date.now(),
            tags: req.body.tags,
            starred: req.body.starred,
            edited: Date.now()
        });

        noteContent.note = note;

        await noteContent.save();
        const createdNote = await note.save();

        res.status(201).json({
            message: "Note created",
            createdNote
        });
    } catch (err) {
        next(err);
    }
});

// edit note
router.post("/:id/edit", getNote, async (req, res, next) => {
    try {
        let note = req.body.note;

        let noteContent = await NoteContent.findById(note.content).exec();
        noteContent.content = req.body.content;
        await noteContent.save();

        note.title = req.body.title;
        note.tags = req.body.tags;
        note.starred = req.body.starred;
        note.edited = Date.now();

        let savedNote = await note.save();
        res.status(200).json({ savedNote });
    } catch (err) {
        next(err);
    }
});

// delete note
router.post("/:id/delete", getNote, async (req, res, next) => {
    try {
        await NoteContent.findByIdAndDelete(req.body.note.content);
        Note.findByIdAndDelete(req.params.id).then(() => {
            res.status(200).json({ message: "Note deleted" });
        });
    } catch (err) {
        next(err);
    }
});

// get note by id
router.get("/:id", getNote, async (req, res, next) => {
    try {
        let note = req.body.note;
        if (req.body.populate) {
            let populatedNote = await note.populate("content").execPopulate();
            note.content = populatedNote.content.content;
        }
        res.status(200).send(note);
    } catch (err) {
        next(err);
    }
});

async function getNote(req, res, next) {
    try {
        if (!(await Note.exists({ _id: req.params.id }))) return res.sendStatus(404);

        let note = await Note.findById(req.params.id).exec();
        if (req.authData._id !== note.owner) return res.sendStatus(403);
        req.body.note = note;
    } catch (err) {
        next(err);
    }
}

module.exports = router;
