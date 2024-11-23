const usercurrency = require('../../../cores/databases/usercurrency');
const config = require('../../system/config/shiko.json');
const users = {};

//Math Currency System
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


        resolve(
            {
                currencyUpRes,
                formattedCurrency
            }
        )
    })
}
//MATH GAME END

//BlackJack System START
async function deductBet(userID, betAmount) {
    const user = await usercurrency.findOne({ userID });

    if (!user) {
        throw new Error('User not found');
    }

    console.log(`User Balance: ${user.balance}, Bet Amount: ${betAmount}`);

    if (user.balance < betAmount) {
        throw new Error('Insufficient Balance');
    }

    user.balance -= betAmount; // Deduct the bet amount
    await user.save();
    return user.balance;
}

async function awardWinnings(userID, winningAmount) {
    const user = await usercurrency.findOne({ userID });

    if (!user) {
        throw new Error('User not found');
    }

    user.balance += winningAmount; // Award the winnings
    await user.save();
    return user.balance;
}

async function returnBet(userID, betAmount) {
    const user = await usercurrency.findOne({ userID });

    if (!user) {
        throw new Error('User not found');
    }

    user.balance == betAmount; // Return the bet if necessary
    await user.save();
    return user.balance;
}

//BlackJack System END


module.exports = {
    playGame,
    deductBet,
    awardWinnings,
    returnBet,
}