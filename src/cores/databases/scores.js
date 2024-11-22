const mongoose = require('mongoose');

const triviascores = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        correctAnswers: {
            type: Number,
            default: 0,
        },
        totalquestions: {
            type: Number,
            default: 0,
        },
    }
);

const TS = mongoose.model('TriviaScores', triviascores);

module.exports = TS;