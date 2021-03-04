const express = require("express");
const router = express.Router();
const notebookRoutes = require("./notebookRoutes");
const { body, validationResult } = require('express-validator');
const Accounts = require("../database/accounts");
const Notebooks = require("../database/notebooks");
const Validations = require("./validations");
const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_KEY;

// Create new account
router.post("/",
    Validations.username,
    Validations.name,
    Validations.password,
    Validations.isEmpty("hello?"),
    checkValidation,
    async (req, res) => {
        if (!(await Accounts.isUniqueUsername())) {
            return res.status(422).json({ message: "Username already taken" });
        }
        let createdAccount = await Accounts.create(req.body);
        res.status(201).json({
            message: "Account created",
            createdAccount: createdAccount
        });
    }
);

router.post("/login", async (req, res) => {
    if (await Accounts.isUniqueUsername(req.body.username)) {
        console.log("User doesn't exist!");
        return res.sendStatus(404);
    }

    const result = await Accounts.login(req.body.username, req.body.password);
    if (result) {
        const account = await Accounts.getByUsername(req.body.username);
        jwt.sign({ account }, jwt_key, (err, token) => res.json({ token }));
    } else {
        res.sendStatus(403);
    }
});

// validate account id for routes beyond this point
router.use("/:accountId", validateAccountId); 

router.post("/:id/addNotebook", async (req, res) => {
    let accountId = req.authData.account._id;
    let notebookId = req.body.notebookId;

    if (!(await Notebooks.exists(notebookId))) return res.sendStatus(404);
    let notebook = await Notebooks.getById(notebookId);
    if (notebook.owner != accountId) return res.sendStatus(403);
    await Accounts.addNotebook(accountId, notebookId);
    res.status(200).json({ message: "Notebook added" });
});

router.post("/:id/removeNotebook", async (req, res) => {
    let accountId = req.authData.account._id;
    let notebookId = req.body.notebookId;

    if (!(await Notebooks.exists(notebookId))) return res.sendStatus(404);
    let notebook = await Notebooks.getById(notebookId);
    if (notebook.owner != accountId) return res.sendStatus(403);
    await Accounts.removeNotebook(accountId, notebookId);
    res.status(200).json({ message: "Notebook removed" });
});

router.get("/:id/", async (req, res) => {
    res.status(200).json({ account: await Accounts.getById(req.authData.account._id) });
});

// notebook middleware
router.use("/:accountId/notebooks", notebookRoutes);

async function validateAccountId(req, res, next) {
    console.log("Checking account id...");
    const accountId = req.params.accountId;
    if (!(await Accounts.exists(accountId))) return res.sendStatus(404);
    if (accountId != req.authData.account._id) return res.sendStatus(403);
    console.log("Validated account id: " + accountId);
    next();
  }

async function checkValidation(req, res, next) {
    const errorsResult = validationResult(req);
    if (!errorsResult.isEmpty()) {
        let errors = {};
        errors.validationErrors = errorsResult.array({ onlyFirstError: true });
        errors.status = 422;
        return next(errors);
    }
}

module.exports = router;