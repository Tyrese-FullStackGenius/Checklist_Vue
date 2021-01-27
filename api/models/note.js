const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, default: "Untitled Note" },
    content: { type: Schema.Types.ObjectId, ref: 'noteContent' },
    owner: { type: Schema.Types.ObjectId, ref: 'account' },
    notebook: { type: Schema.Types.ObjectId, ref: 'notebook' },
    created: { type: Date, default: Date.now() },
    tags: [String],
    starred: { type: Boolean, default: false },
    edited: Date
});

module.exports = mongoose.model('Note', noteSchema);
