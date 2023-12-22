const { EmbedBuilder, SlashCommandBuilder, flatten } = require('discord.js');
const client = require('../../shiko-main');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Get your profile')
        .addStringOption(option => option.setName('user')
            .setDescription('The user to get the profile of')
            .setRequired(false)),
        async execute (interaction) {
            const embed = new EmbedBuilder()
                .setTitle("Getting user profile")
                .setDescription(`Please Wait`)
                .setColor("Random")
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

            const user1 = interaction.options.getString('user');
            const user2 = user1 || interaction.user
            
            const avatar = user2.displayAvatarURL({ size: 4096, dynamic: true })

            const embed1 = new EmbedBuilder()
                .setTitle(`${user2.username}\'s Profile`)
                .setImage(avatar)
                .setColor("Random")
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })

            setTimeout(() => {
                interaction.editReply({ embeds: [embed1] });
            }, 5000);
        }
}