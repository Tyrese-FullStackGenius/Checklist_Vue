const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Note = require("../models/note");

const accountSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    name: String,
    hashedPassword: String,
    notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
    admin: Boolean,
});

module.exports = mongoose.model('Account', accountSchema);
