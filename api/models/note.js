const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    content: String,
    created: { type: Date, default: Date.now() },
    edited: Date
});

module.exports = mongoose.model('Note', noteSchema);
