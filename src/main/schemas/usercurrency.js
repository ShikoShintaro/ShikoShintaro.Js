const mongoose = require('mongoose');

const curr = new mongoose.Schema(
    {
        userID : {
            type : String,
            required : true,
            unique : true
        },
        balance : {
            type : Number,
            unique : true
        }
    }
)

const currency = mongoose.model('Currency', curr );

module.exports = currency;