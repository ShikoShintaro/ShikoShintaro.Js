const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function createBlackjackButtons() {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('hit')
                .setLabel('Hit')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('stand')
                .setLabel('Stand')
                .setStyle(ButtonStyle.Secondary)
        );
    
    return row;
}

module.exports = { 
    createBlackjackButtons 
};