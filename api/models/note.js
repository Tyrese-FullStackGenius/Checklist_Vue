const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String, 
    content: String,
    createdDate: Date,
    editedDate: Date, 
    dueDate: Date,
    done: Boolean,
});

module.exports = mongoose.model('Note', noteSchema);
