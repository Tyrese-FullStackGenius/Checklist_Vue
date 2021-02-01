const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notebookSchema = Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    notes: [{ type: Schema.Types.ObjectId, ref: 'note', default: [] }],
    owner: { type: Schema.Types.ObjectId, ref: 'account' }
});

module.exports = mongoose.model('Notebook', notebookSchema);