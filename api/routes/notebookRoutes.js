const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Notebook = require("../models/notebook");

// get notebook by id (optional population)
router.get("/:id", getNotebook, async (req, res, next) => {
    try {
        let notebook = req.body.notebook;
        if (req.body.populate) {
            notebook = await notebook.populate("notes").execPopulate();
        }
        res.status(200).send(notebook);
    } catch (err) {
        next(err);
    }
});

// get notebooks by name
// requires indexing

// create notebook
router.post("/", async (req, res, next) => {
    try {
        let notebook = new Notebook({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            notes: [],
            owner: req.authData._id
        });

        const result = await notebook.save();
        res.status(201).json({ message: "Notebook created", notebook: result });
    } catch (err) {
        next(err);
    }
});

// delete notebook by id
router.post("/:id/delete", getNotebook, async (req, res, next) => {
    try {
        Notebook.findByIdAndDelete(req.params.id).then(() => {
            res.status(200).json({ message: "Notebook deleted" });
        });
    } catch (err) {
        next(err);
    }
});

// add note to notebook
router.post("/:id/addNote", getNotebook, async (req, res, next) => {
    try {
        let noteId = req.body.noteId;
        if (!noteId) return res.sendStatus(400);

        let notebook = req.body.notebook;
        notebook.notes.push(noteId);

        notebook.save().then(() => {
            res.status(200).json({ message: "Note added" });
        });
    } catch (err) {
        next(err);
    }
});

// remove note from notebook
router.post("/:id/deleteNote", getNotebook, async (req, res, next) => {
    try {
        let noteId = req.body.noteId;
        if (!noteId) return res.sendStatus(400);

        let notebook = req.body.notebook;
        notebook.notes.remove(noteId);

        notebook.save().then(() => {
            res.status(200).json({ message: "Note deleted" });
        });
    } catch (err) {
        next(err);
    }
});

router.post("/:id/moveNote", getNotebook, async (req, res, next) => {
    try {
        let noteId = req.body.noteId;
        let newNotebookId = req.body.newNotebookId;
        if (!noteId || ! newNotebookId) return res.sendStatus(400);
        
        let oldNotebook = req.body.notebook;
        oldNotebook.notes.remove(noteId);
        await oldNotebook.save();

        req.params.id = newNotebookId();
        await getNotebook(req, res, next);
        let newNotebook = req.body.notebook;
        newNotebook.notes.push(noteId);

        // get note and update notebook property
    } catch (err) { 
        next(err);
    }
});

async function getNotebook(req, res, next) {
    try {
        if (!(await Notebook.exists({ _id: req.params.id }))) return res.sendStatus(404);

        let notebook = await Notebook.findById(req.params.id).exec();
        if (req.authData._id !== notebook.owner) return res.sendStatus(403);
        req.body.notebook = notebook;
    } catch (err) {
        next(err);
    }
}

module.exports = router;