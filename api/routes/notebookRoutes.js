const express = require("express");
const router = express.Router();
const Notebooks = require("../database/notebooks");
const Notes = require("../database/notes");


router.use("/:id*", authNotebookId);

// get notebook by id (optional population)
router.get("/:id", async (req, res, next) => {
    try {
        let notebook = await Notebooks.getById(req.params.id, req.body.populate);
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
        let notebook = await Notebooks.create(req.body.name, req.authData.account._id);
        res.status(201).json({ message: "Notebook created", notebook });
    } catch (err) {
        next(err);
    }
});

// delete notebook by id
router.post("/:id/delete", async (req, res, next) => {
    try {
        await Notebooks.deleteById(req.params.id);
        res.status(200).json({ message: "Notebook deleted" });
    } catch (err) {
        next(err);
    }
});

// add note to notebook
router.post("/:id/addNote", async (req, res, next) => {
    try {
        let noteId = req.body.noteId;
        if (!await Notes.exists(noteId)) return res.sendStatus(400);

        await Notebooks.addNote(req.params.id, noteId);
        res.status(200).json({ message: "Note added" });
    } catch (err) {
        next(err);
    }
});

// remove note from notebook
router.post("/:id/removeNote", async (req, res, next) => {
    try {
        let noteId = req.body.noteId;
        if (!await Notes.exists(noteId)) return res.sendStatus(400);

        await Notebooks.removeNote(req.params.id, noteId);
        res.status(200).json({ message: "Note deleted" });
    } catch (err) {
        next(err);
    }
});

router.post("/:id/moveNote", async (req, res, next) => {
    try {
        let noteId = req.body.noteId;
        let newNotebookId = req.body.newNotebookId;
        let oldNotebookId = req.params.id;
        if (!(await Notes.exists(noteId)) ||
            !(await Notebooks.exists(newNotebookId)) ||
            !(await Notebooks.exists(oldNotebookId)))
            return res.sendStatus(400);

        await Notebooks.moveNote(oldNotebookId, newNotebookId, noteId);

        res.status(200).json({ message: "Note moved" });
    } catch (err) {
        next(err);
    }
});

async function authNotebookId(req, res, next) {
    try {
        console.log("Testing auth...");
        let id = req.params.id;
        if (!(await Notebooks.exists(id))) return res.sendStatus(404);

        let notebook = await Notebooks.getById(id);
        console.log(notebook);
        console.log(req.authData.account._id);
        console.log(notebook.owner);
        if (req.authData.account._id != notebook.owner) return res.sendStatus(403);
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = router;