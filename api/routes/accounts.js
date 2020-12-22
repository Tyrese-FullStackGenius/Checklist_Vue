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
    Account.findOne({ "username": req.body.username })
        .exec()
        .then(account => {
            if (account) {
                bcrypt.compare(req.body.password, account.hashedPassword, function (err, result) {
                    if (result) {
                        jwt.sign({ account }, 'tempSecretKey', (err, token) => { // again, fix token
                            res.json({ token });
                        });
                    } else {
                        res.status(200).json({ message: "Incorrect password" });
                    }
                });
            } else {
                res.status(200).json({ message: "User not found" });
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

router.get("/", verifyToken, (req, res) => {
    Account.find({ "username": req.authData.username })
        .exec()
        .then(doc => {
            console.log("DOC: " + doc);
        });
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

function verifyToken(req, res, next) {
    const bearerHeader = req.headers.authorization; //get auth header value
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1]; // "Bearer [token]"
        jwt.verify(bearerToken, 'tempSecretKey', (err, authData) => { // replace temp key
            if (!err) {
                req.authData = authData;
                console.log(authData);
                next();
            } else {
                console.log("Token unverified");
                res.sendStatus(403);
            }
        });
    } else {
        res.sendStatus(403);
    }
}

module.exports = { router, verifyToken };
