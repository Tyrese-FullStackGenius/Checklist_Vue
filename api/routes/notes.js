const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Note = require("../models/note");
const Account = require("../models/account");
const saltRounds = 10;
const jwt = require('jsonwebtoken');

module.exports = router;
