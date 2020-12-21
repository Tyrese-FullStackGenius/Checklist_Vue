
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Account = require("../models/account");
const Note = require("../models/note");
const saltRounds = 10;
const jwt = require('jsonwebtoken');

// Create new account
router.post("/", checkUnique, (req, res) => {
    if (!req.uniqueUsername) {
        res.status(200).json({ message: "Username already taken" });
        return;
    }
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            const account = new Account({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                name: req.body.name,
                hashedPassword: hash,
                // more attributes to add later
            });
            account.save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: "Created account",
                        createdAccount: result
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: err });
                });
        });
    });
});

router.post("/login", (req, res) => {
    //const username = req.params.username;
    Account.find({ "username": req.body.username })
        .exec()
        .then(doc => {
            const account = doc[0];
            if (account) {
                console.log("From database", account);

                bcrypt.compare(req.body.password, account.hashedPassword, function (err, result) {
                    if (result) {
                        jwt.sign({ account }, 'tempSecretKey', (err, token) => {
                            res.json({ token });
                        });
                    } else {
                        res.status(200).json({ message: "Wrong password or username" });
                    }
                });
            } else {
                res.status(404).json({ message: "No valid account found for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.post("/checkUniqueUsername", checkUnique, (req, res) => {
    res.status(200).json({ result: req.uniqueUsername });
});

function checkUnique(req, res, next) {
    Account.find({ "username": req.body.username })
        .exec()
        .then(doc => {
            req.uniqueUsername = doc.length == 0;
            next();
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

module.exports = router;
