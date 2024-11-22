const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const client = require('../../shiko-main');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Fetching")
            .setDescription(`Please Wait`)
            .setColor("Random")
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        const embed1 = new EmbedBuilder()
            .setTitle("Pong~")
            .setDescription(`${client.ws.ping} ms`)
            .setColor("Random")
            .setTimestamp();

        setTimeout(() => {
            interaction.editReply({ embeds: [embed1] });
        }, 5000);
    },
};
