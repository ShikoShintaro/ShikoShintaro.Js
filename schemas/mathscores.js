const mongoose = require('mongoose')

const mathscores = new mongoose.Schema(
    {
        userID : {
            type : String,
            required : true,
            unique : true
        },
        totalequations : {
            type : Number,
            unique : true,
        },
        totalanswered : {
            type : Number,
            unique : true
        },
        lvl1 : {
            type : Number,
            unique : true
        },
        lvl2 : {
            type : Number,
            unique : true
        },
        lvl3 : {
            type : Number,
            unique : true,
        },
        lvl4 : {
            type : Number,
            unique : true,
        },
        lvl5 : {
            type : Number,
            unique : true,
        },
        lvl6 : {
            type : Number,
            unique : true,
        },
        lvl7 : {
            type : Number,
            unique : true,
        },
        lvl8 : {
            type : Number,
            unique : true,
        },
        lvl9 : {
            type : Number,
            unique : true,
        },
        lvl10 : {
            type : Number,
            unique : true,
        },
    }
)

const MS = mongoose.model('MathScores', mathscores)

module.exports = MS;