const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ME = EmbedBuilder;

const currency = require('../../../cores/databases/usercurrency');
const client = require('../../shiko-main');

const { balembed } = require('../../../cores/system/builders/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
            .setDescription('Getting balance of the user :>')
        .addUserOption(option => option.setName('user')
            .setDescription('Mention a user or you can leave it blank :> ')
            .setRequired(true)),
        
        async execute (interaction) {
            const user = interaction.options.getUser('user');

            balembed(interaction, user);

        }

}