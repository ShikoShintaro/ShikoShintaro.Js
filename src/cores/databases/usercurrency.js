const mongoose = require('mongoose');

const curr = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        userID: {
            type: String, 
            required: true,
            unique: true,
        },
        balance: {
            type: Number,
            unique: true,
        },
    }
);

const currency = mongoose.model('user-currencies', curr);

module.exports = currency;
