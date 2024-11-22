const {
    SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle
} = require('discord.js');

const {
    iniDeck, calculateHandVal
} = require('../../../cores/games/gamble/blackjacksystem');

const {
    deductBet, awardWinnings, returnBet
} = require('../../../cores/games/currency/currencysystem');

const {
    createBlackjackButtons
} = require('../../../cores/system/builders/buttons')

const {
    BJEmbed, hitEmbed, standEmbed, createFinalEmbed
} = require('../../../cores/system/builders/embed');

const {
    determineWinner
} = require('../../../cores/games/utils/functions')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blackjack')
        .setDescription('Play a game of blackjack and multiply your money by 2x!')
        .addIntegerOption(option =>
            option.setName('bet')
                .setDescription('Bet Amount')
                .setRequired(true)
        ),

    async execute(interaction) {

        const betAmount = interaction.options.getInteger('bet');
        const userId = interaction.user.id;
        const userID = interaction.user.id;

        if (betAmount <= 0) {
            return interaction.reply('Please enter a valid bet amount');
        }

        const deck = iniDeck();

        let playerHand = [deck.pop(), deck.pop()];
        let dealerHand = [deck.pop(), deck.pop()];

        let playerValue = calculateHandVal(playerHand);
        let dealerValue = calculateHandVal(dealerHand);

        await BJEmbed(interaction, betAmount, playerHand, dealerHand);

        const row = createBlackjackButtons();

        await interaction.editReply({ components: [row] });

        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector(
            {
                filter, time: 30000
            }
        );

        collector.on('collect', async i => {
            if (i.customId === 'hit') {
                playerHand.push(deck.pop());
                playerValue = calculateHandVal(playerHand);
        
                // Log the bet amount before hitting to confirm it is correct
                console.log(`Bet Amount before hit: ${betAmount}`);
        
                await hitEmbed(playerHand, dealerHand, interaction);
        
                // Determine result after hit and pass the result along with betAmount
                const resultMessage = determineWinner(playerValue, dealerValue);
        
                // Call the final embed, passing the betAmount and userID
                await createFinalEmbed(interaction, playerHand, dealerHand, playerValue, dealerValue, resultMessage, betAmount, userID);
                collector.stop();
        
                // Handle bust situation (if player value exceeds 21)
                if (playerValue > 21) {
                    // Player has busted, no further action
                    return;  // No need to call createFinalEmbed again
                }
            } else if (i.customId === 'stand') {
                while (dealerValue < 17) {
                    dealerHand.push(deck.pop());
                    dealerValue = calculateHandVal(dealerHand);
                }
        
                // Determine final result after standing
                const resultMessage = determineWinner(playerValue, dealerValue);
        
                // Log the bet amount before standing (it should remain the same)
                console.log(`Bet Amount before stand: ${betAmount}`);
        
                // Call the final embed when the game is finished (stand action)
                await createFinalEmbed(interaction, playerHand, dealerHand, playerValue, dealerValue, resultMessage, betAmount, userID);
                collector.stop();
            }
        });
        

    }
}