const mongoose = require("mongoose");
const Note = require("../models/note");
const NoteContent = require("../models/noteContent");
const Notebooks = require("./notebooks");

async function getNoteContentById(id) {
    return await NoteContent.findById(id);
}

module.exports = {
    exists: async (id) => {
        if (!mongoose.Types.ObjectId.isValid(id))
            return false;
        return await Note.exists({ _id: id });
    },

    getById: async (id, populate) => {
        let note = await Note.findById(id);
        if (!populate)
            return note;
        return await note.populate("content").execPopulate();
    },

    updateById: async (id, newNote) => {
        let noteContent = await getNoteContentById(id);
        noteContent.content = newNote.content;
        await noteContent.save();

        let oldNote = await this.getById(id);
        oldNote.title = newNote.title;
        oldNote.tags = newNote.tags;
        oldNote.starred = newNote.starred;
        oldNote.edited = Date.now();

        return await oldNote.save();
    },

    deleteById: async (id) => {
        let deletedNote = await this.getById(id);
        await Notebooks.removeNote(deletedNote.notebook, deletedNote._id);
        await Note.findByIdAndDelete(id);
    },

    setNotebook: async (noteId, notebookId) => {
        let note = await this.getById(noteId);
        note.notebook = notebookId;
        await note.save();
    },

    hasNotebook: async (noteId) => {
        let note = await this.getById(noteId);
        return note.notebook != undefined;
    }
};

