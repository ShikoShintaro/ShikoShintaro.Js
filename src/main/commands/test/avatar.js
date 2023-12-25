const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client = require('../../shiko-main');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Gets usr avatar')
        .addUserOption(option => option.setName('user')
            .setDescription('The user to get the avatar of')
            .setRequired(false)),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Getting user avatar")
            .setDescription(`Please Wait`)
            .setColor("Random")
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        const user = interaction.options.getUser('user')
        const avatar = user.displayAvatarURL({ size: 4096, dynamic: true })

        const embed1 = new EmbedBuilder()
            .setTitle(`${user.username}\'s Avatar`)
            .setImage(avatar)
            .setColor("Random")
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })

        setTimeout(() => {
            interaction.editReply({ embeds: [embed1] });
        }, 5000);
    },
};
