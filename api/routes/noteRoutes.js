const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Note = require("../models/note");
const Account = require("../models/account");

router.post("/", (req, res) => {
    const note = new Note({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        content: req.body.content,
        created: Date.now()
    });
    note.save()
        .then(result => {
            console.log(result);
            Account.findOne({ "_id": req.authData.account._id })
                .exec()
                .then(doc => {
                    doc.notes.push(result);
                    doc.save().then(x => {
                        res.status(201).json({
                            message: "Created note",
                            createdNote: result
                        });
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.get("/:id", (req, res) => {
    console.log("ID: " + req.params.id);
    Note.findById(req.params.id).exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: "No valid note found for provided ID"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

module.exports = router;
