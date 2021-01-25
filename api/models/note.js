const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const account = require("./account");
const noteContent = require("./noteContent");

const noteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, default: "Untitled Note" },
    content: { type: Schema.Types.ObjectId, ref: noteContent },
    created: { type: Date, default: Date.now() },
    owner: { type: Schema.Types.ObjectId, ref: account },
    tags: [String],
    starred: { type: Boolean, default: false },
    edited: Date
});

module.exports = mongoose.model('Note', noteSchema);
