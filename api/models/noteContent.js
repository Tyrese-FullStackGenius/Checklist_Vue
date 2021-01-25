const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const note = require("./note");
const account = require("./account");

const noteContentSchema = Schema({
    _id: Schema.Types.ObjectId,
    content: String,
    note: { type: Schema.Types.ObjectId, ref: note },
    owner: { type: Schema.Types.ObjectId, ref: account}
});

module.exports = mongoose.model('NoteContent', noteContentSchema);