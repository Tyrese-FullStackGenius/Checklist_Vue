const express = require("express");
const router = express.Router();
const noteRoutes = require("./noteRoutes");
const Accounts = require("../database/accounts");
const Notebooks = require("../database/notebooks");
const Notes = require("../database/notes");

// create notebook and add to account
router.post("/", async (req, res, next) => {
    try {
        let notebook = await Notebooks.create(req.body.name, req.accountId);
        await Accounts.addNotebook(req.accountId, notebook._id);
        res.status(201).json({ message: "Notebook created and added to account", notebook });
    } catch (err) {
        next(err);
    }
});

// get all notebooks
router.get("/", async (req, res, next) => {
    try {
        let notebooks = await Accounts.getNotebooks(req.accountId);
        res.status(200).json({ notebooks });
    } catch (err) {
        next(err);
    }
});

// validate notebook ids for routes after
router.use("/:notebookId", validateNotebookId);

// get notebooks by name
// requires indexing

router.get("/:id", async (req, res, next) => {
    try {
        let notebook = await Notebooks.getById(req.params.id, req.body.populate);
        res.status(200).json({ notebook });
    } catch (err) {
        next(err);
    }
});

// delete notebook by id
router.delete("/:id", async (req, res, next) => {
    try {
        await Accounts.removeNotebook(req.accountId, req.params.id);
        await Notebooks.deleteById(req.params.id);
        res.status(200).json({ message: "Notebook deleted and removed from account" });
    } catch (err) {
        next(err);
    }
});

// add note to notebook
router.post("/:id/addNote", async (req, res, next) => { // move to note routes
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
router.post("/:id/removeNote", async (req, res, next) => { // move to note routes
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

// notes middleware
router.use("/:notebookId/notes", noteRoutes);

async function validateNotebookId(req, res, next) {
    console.log("Validating notebook id...");
    const accountId = req.accountId;
    const notebookId = req.params.notebookId;
    if (!(await Notebooks.exists(notebookId))) return res.sendStatus(404);
    if (accountId != (await Notebooks.getById(notebookId)).owner) return res.sendStatus(403);
    req.notebookId = notebookId;
    console.log("Validated notebook id: " + notebookId);
    next();
}

module.exports = router;