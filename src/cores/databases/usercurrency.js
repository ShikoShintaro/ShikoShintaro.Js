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
<<<<<<< HEAD
            unique: true,
=======
            default: 0,
>>>>>>> 6637085 (First Major Updates)
        },
    }
);

const currency = mongoose.model('user-currencies', curr);

module.exports = currency;
