const mongoose = require("mongoose");
const Note = require("../models/note");
const Notebook = require("../models/notebook");

module.exports = {

    exists: async function (id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return false;
        return await Notebook.exists({ _id: id });
    },

    getById: async function (id) {
        return await Notebook.findById(id);
    },

    addNote: async function (notebookId, noteId) {
        let notebook = await this.getById(notebookId);
        notebook.notes.push(noteId);
        await notebook.save();

        // modify note object as well
    },

    removeNote: async function (notebookId, noteId) {
        let notebook = await this.getById(notebookId);
        notebook.notes.pull(noteId);
        await notebook.save();

        // modify note object as well
        // undefined notebook property?
    },

    moveNote: async function (oldNotebookId, newNotebookId, noteId) {
        
    }
};

