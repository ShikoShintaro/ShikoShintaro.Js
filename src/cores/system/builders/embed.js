const {
    EmbedBuilder, AttachmentBuilder
} = require('discord.js');

const client = require('../../../main/shiko-main');
const config = require('../config/shiko.json')

const MS = require('../../../cores/databases/mathscores');
const TS = require('../../../cores/databases/scores');
const currency = require('../../../cores/databases/usercurrency');

<<<<<<< HEAD
const ME = EmbedBuilder;

=======
const {
    deductBet, awardWinnings, returnBet
} = require('../../../cores/games/currency/currencysystem');


const ME = EmbedBuilder;

//inserting the module
const {
    iniDeck, shuffleDeck, calculateHandVal
} = require('../../../cores/games/gamble/blackjacksystem')

>>>>>>> 6637085 (First Major Updates)
async function balembed(interaction, user) {

    const userID = user.id;

<<<<<<< HEAD
    const usr = await currency.findOne({ userID });

    if (usr) {
        const userbal = usr.balance.toLocaleString();

        try {
            const embed = new ME()
                .setTitle('User Balance')
                .setDescription(`**${interaction.user}'s Current Balance : \n\`\`\`fix\n${userbal}\`\`\`**`)
                .setColor('Random')
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

            interaction.reply({ embeds: [embed] })

        } catch (err) {
            console.error(err);
            interaction.reply(`There was an error getting the user's balance`);
        }
    } else {
        console.log('Sorry there was an error');
=======
    try {
        const usr = await currency.findOne({ userID });

        if (usr) {
            const userbal = usr.balance.toLocaleString();

            try {
                const embed = new ME()
                    .setTitle('User Balance')
                    .setDescription(`**${interaction.user}'s Current Balance : \n\`\`\`fix\n${userbal}\`\`\`**`)
                    .setColor('Random')
                    .setTimestamp()
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                interaction.reply({ embeds: [embed] })

            } catch (err) {
                console.error(err);
                interaction.reply(`There was an error getting the user's balance`);
            }
        } else {
            await interaction.reply('user not found in the database');
        }
    } catch (err) {
        console.error(err);
        await interaction.reply(`There was an error retrieving the user's balance.`);
>>>>>>> 6637085 (First Major Updates)
    }
}

async function mathCreateEmbed(interaction, title, description, color) {
    const embed = new ME()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp()
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embed] })

}

async function mathEditEmbed(interaction, { title = '', description = '', colors = '', fields = [] } = {}) {
    const embed = new ME()
        .setTitle(title)
        .setDescription(description)
        .addFields(fields)
        .setColor(colors)
        .setTimestamp()
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

    await interaction.editReply({ embeds: [embed] });
}

<<<<<<< HEAD
=======
//BLACK JACK
async function BJEmbed(interaction, betAmount, playerHand, dealerHand) {
    const embed = new ME()
        .setTitle('Blackjack Game!')
        .setDescription(`You placed a bet of **${betAmount}**.`)
        .addFields(
            {
                name: 'Your Hand',
                value: `\`\`\`fix\n${playerHand.map(card => `${card.value} ${card.suit}`).join(' , ')} ( = ${calculateHandVal(playerHand)})\`\`\``,
                inline: true
            },
            {
                name: "Dealer's Visible Card",
                value: `\`\`\`fix\n${dealerHand[0].value} ${dealerHand[0].suit}\n\`\`\``,
                inline: true
            },
            {
                name: 'Question!',
                value: `\`\`\`fix\nWhat would you like to do?\n\`\`\``,
                inline: false
            }
        )
        .setColor('Random')
        .setTimestamp()
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embed] });
}

async function hitEmbed(playerHand, dealerHand, interaction) {
    const embed = new ME()
        .setTitle('Blackjack Game - Hit')
        .setDescription(`You chose to hit.`)
        .addFields(
            { name: 'Your Hand', value: `${playerHand.map(card => `${card.value}  ${card.suit}`).join(', ')} (Value: ${calculateHandVal(playerHand)})`, inline: true },
            { name: "Dealer's Visible Card", value: `${dealerHand[0].value}  ${dealerHand[0].suit}`, inline: true }
        )
        .setColor('Random')
        .setTimestamp();

    await interaction.editReply({ embeds: [embed], components: [] });
}

async function standEmbed(playerHand, dealerHand, interaction, playerHand, dealerHand) {
    const embed = new ME()
        .setTitle('Blackjack Game - Stand')
        .setDescription(`You chose to stand.`)
        .addFields(
            {
                name: 'Your Hand',
                value: `\`\`\`fix\n${playerHand.map(card => `${card.value} of ${card.suit}`).join('\n')}\n(Value: ${calculateHandVal(playerHand)})\`\`\``,
                inline: true
            },
            {
                name: "Dealer's Visible Card",
                value: `\`\`\`fix\n${dealerHand[0].value} of ${dealerHand[0].suit}\`\`\``,
                inline: true
            }
        )

        .setColor('Random')
        .setTimestamp();

    await interaction.editReply({ embeds: [embed], components: [] })
}


async function createFinalEmbed(interaction, playerHand, dealerHand, playerValue, dealerValue, resultMessage, betAmount, userID) {
    let finalMessage;
    let newBalance;

    // Log the bet amount before any calculations
    console.log(`Bet Amount before game result: ${betAmount}`);

    try {
        // Track if the user has lost, won, or tied
        if (playerValue > 21) {
            // Player lost, deduct the bet
            finalMessage = 'You busted! You lost your bet.';
            newBalance = await deductBet(userID, betAmount);  // Deduct only once here
        } else if (dealerValue > 21 || playerValue > dealerValue) {
            // Player won, award double the bet
            finalMessage = 'You win! You double your bet.';
            newBalance = await awardWinnings(userID, betAmount);  // Award winnings once
        } else if (playerValue === dealerValue) {
            // Tie, return the bet
            finalMessage = 'It\'s a tie! Your bet is returned.';
            newBalance = await returnBet(userID, betAmount);  // Return the bet once
        } else {
            // Player lost, deduct the bet
            finalMessage = 'You lost! Your bet is deducted.';
            newBalance = await deductBet(userID, betAmount);  // Deduct only once here
        }

        // Log the new balance after deduction or winnings
        console.log(`New Balance after result: ${newBalance}`);

        // Create the embed with the game result and user balance
        const embed = new EmbedBuilder()
            .setTitle('Blackjack Game - Final Result')
            .addFields(
                {
                    name: 'Your Hand',
                    value: `\`\`\`fix\n${playerHand.map(card => `${card.value} of ${card.suit}`).join('\n')}\n(Value: ${playerValue})\`\`\``,
                    inline: true
                },
                {
                    name: "Dealer's Hand",
                    value: `\`\`\`fix\n${dealerHand.map(card => `${card.value} of ${card.suit}`).join('\n')}\n(Value: ${dealerValue})\`\`\``,
                    inline: true
                },
                {
                    name: 'Result',
                    value: `\`\`\`fix\n${finalMessage}\nNew Balance: ${newBalance}\`\`\``,
                    inline: false
                }
            )
            .setColor('Random')
            .setTimestamp();

        // Send the final embed with the balance update
        await interaction.editReply({ embeds: [embed], components: [] });
    } catch (error) {
        console.error('Error in createFinalEmbed:', error);
        await interaction.channel.send('There was an error processing your bet outcome.');
    }
}

>>>>>>> 6637085 (First Major Updates)


module.exports = {
    balembed,
    mathCreateEmbed,
<<<<<<< HEAD
    mathEditEmbed
=======
    mathEditEmbed,
    BJEmbed,
    hitEmbed,
    standEmbed,
    createFinalEmbed
>>>>>>> 6637085 (First Major Updates)
}