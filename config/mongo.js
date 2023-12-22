const mongoose = require('mongoose');
const shikouri = process.env.shikouri;
const shiko = mongoose;

module.exports = async () => {
    let shikodb;

    shiko.connect(shikouri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
    });
    return shiko;
};
