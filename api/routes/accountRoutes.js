const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Account = require("../models/account");
const bcrypt = require('bcrypt');
const saltRounds = 12;
const jwt = require('jsonwebtoken');
const account = require("../models/account");
const jwt_key = process.env.JWT_KEY;

// Create new account
router.post("/createAccount", checkUnique, async (req, res) => {
    if (!req.uniqueUsername) {
        return res.status(200).json({ message: "Username already taken" });
    }

    const hash = await bcrypt.hash(req.body.password, saltRounds);
    const accountObj = new account({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        name: req.body.name,
        hashedPassword: hash
    });

    const result = await accountObj.save();
    console.log(result);
    res.status(201).json({
        message: "Created account",
        createdAccount: result
    });
});

router.post("/login", async (req, res) => {
    const account = await Account.findOne({ "username": req.body.username }).exec();

    if (account) {
        const result = await bcrypt.compare(req.body.password, account.hashedPassword);
        if (result) {
            jwt.sign({ account }, jwt_key, (err, token) => res.json({ token }));
        } else {
            res.status(200).json({ message: "Incorrect password" });
        }
    } else {
        res.status(200).json({ message: "User not found" });
    }
});

router.post("/checkUniqueUsername", checkUnique, (req, res) => {
    res.status(200).json({ result: req.uniqueUsername });
});

router.get("/getNotes", getAccount, (req, res) => {
    res.status(200).json(req.account.notes);
});

router.get("/", getAccount, (req, res) => {
    res.status(200).json(req.account);
});

function checkUnique(req, res, next) {
    Account.find({ "username": req.body.username }).exec()
        .then(doc => {
            req.uniqueUsername = doc.length == 0;
            next();
        });
}

function getAccount(req, res, next) {
    Account.findById(req.authData.account._id).exec()
        .then(account => {
            if (!account) res.status(404).json({ message: "User not found" });
            req.account = account;
            next();
        });
}

module.exports = router;
