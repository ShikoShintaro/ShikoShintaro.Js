const {
    EmbedBuilder, AttachmentBuilder
} = require('discord.js');

const client = require('../../../main/shiko-main');
const config = require('../config/shiko.json')

const MS = require('../../../cores/databases/mathscores');
const TS = require('../../../cores/databases/scores');
const currency = require('../../../cores/databases/usercurrency');

const ME = EmbedBuilder;

async function balembed(interaction, user) {

    const userID = user.id;

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



module.exports = {
    balembed,
    mathCreateEmbed,
    mathEditEmbed
}