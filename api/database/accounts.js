const mongoose = require("mongoose");
const Account = require("../models/account");
const bcrypt = require('bcrypt');
const saltRounds = 12;

module.exports = {
    createAccount: async (accountData) => {
        let hash = await bcrypt.hash(req.body.password, saltRounds);
        let account = new Account({
            _id: new mongoose.Types.ObjectId(),
            username: accountData.username,
            name: accountData.name,
            hashedPassword: hash
        });

        return await account.save();
    },

    login: async (username, password) => {
        let account = await Account.findOne({ "username": username });
        return await bcrypt.compare(password, account.hashedPassword);
    },

    getById: async (id) => await Account.findById(id),

    getNotebooks: async (id) => {
        let account = await Account.findById(id);
        let populated = await account.populate("notebooks").execPopulate();
        return populated.notebooks;
    },

    isUniqueUsername: async (username) => (await Account.countDocuments({ "username": username })) == 0
};