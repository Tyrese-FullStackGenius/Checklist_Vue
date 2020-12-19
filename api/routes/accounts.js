
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Account = require("../models/account");
const Note = require("../models/note");
const saltRounds = 10;
const jwt = require('jsonwebtoken');

// Create new account
router.post("/", (req, res, next) => { // add check for unique username
    console.log("Creating account");
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            const account = new Account({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                name: req.body.name,
                hashedPassword: hash,
                // more attributes to add later
            });
            account
                .save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: "Created account",
                        createdAccount: result
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        });
    });
});

router.post("/login", (req, res, next) => {
    //const username = req.params.username;
    Account.find({ "username": req.body.username })
        .exec()
        .then(doc => {
            const account = doc[0];
            if (account) {
                console.log("From database", account);

                bcrypt.compare(req.body.password, account.hashedPassword, function (err, result) {
                    if (result) {
                        // res.status(200).json({
                        //     message: "Login Successful"
                        // });

                        jwt.sign({ account }, 'tempSecretKey', (err, token) => {
                            res.json({
                                token
                            });
                        });
                    } else {
                        res.status(200).json({
                            message: "Wrong passowrd or username"
                        });
                    }
                });
            } else {
                res.status(404).json({
                    message: "No valid account found for provided ID"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.post("/checkUniqueUsername", (req, res, next) => {
    Account.find({ "username": req.body.username })
        .exec()
        .then(doc => {
            if (doc.length > 0) {
                res.status(200).json({ result: false });
            } else {
                res.status(200).json({ result: true });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

module.exports = router;
