const usercurrency = require('../../../cores/databases/usercurrency');
const { mathEditEmbed } = require('../../system/builders/embed');
const config = require('../../system/config/shiko.json');

const users = {};

async function playGame(interaction, userName1, userID, gameType, level, operator_amount) {
    return new Promise(async (resolve, reject) => {
        if (!users[userID]) users[userID] = { currency: 0 };

        let baseEarned = 0;

        switch (gameType.toLowerCase()) {
            case 'math':
                if (level >= 1 && level <= 5) {
                    baseEarned = level * 2 * operator_amount
                } else if (level >= 6 && level <= 10) {
                    baseEarned = level * 3 * operator_amount
                } else if (level >= 11 && level <= 19) {
                    baseEarned = level * 5 * operator_amount
                } else if (level >= 20) {
                    baseEarned = level * 10 * operator_amount
                }
                break;

            default:
                baseEarned = Math.floor(Math.random() * 20) + 1;
        }

        let earnedCurrency = Math.floor(Math.random() * 21) + baseEarned;

        users[userID].currency += earnedCurrency;

        const formattedCurrency = users[userID].currency.toLocaleString();

        const currencyUpRes = await usercurrency.findOneAndUpdate(
            { userName: userName1 },
            { $set: { userID: userID }, $inc: { balance: earnedCurrency } },
            { upsert: true, new: true }
        );

        console.log(`The username is: ${userName1}`);
        console.log(`User Profile updated and added a new balance of ${formattedCurrency}`);
        

        resolve (
            {
                currencyUpRes,
                formattedCurrency
            }
        )
    })
}

module.exports = {
    playGame,
}