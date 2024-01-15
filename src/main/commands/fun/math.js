const { Client, Message, DiscordAPIError, EmbedBuilder, Embed, SlashCommandBuilder } = require('discord.js');
let cd = new Set()
const client = require('../../shiko-main');
const config = require('../../config/shiko.json');
const ME = EmbedBuilder

//importing databases
const MS = require('../../schemas/mathscores')
const currency = require('../../schemas/usercurrency')

//importing functions
const { generateEquation } = require('../../../cores/games/math/mathsystem')
const { playGame, getBalance } = require('../../../cores/games/currency/currencysystem')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('math')
        .setDescription('Perform a math operation. Usage: `/math <level> <operator_amount>`')
        .addIntegerOption(option => option.setName('level')
            .setDescription('The level of the game **up to 20**')
            .setRequired(true))
        .addIntegerOption(option => option.setName('operator_amount')
            .setDescription('The amount of operators ** up to 10 **')
            .setRequired(true)),
    async execute(interaction, message, args) {


        const err1 = new ME()
            .setTitle('OI')
            .setDescription("❎ **| Hey, you still have an equation to solve! Please solve that one first before creating another equation!**")
            .setColor(config.colors.no)
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })

        if (cd.has(interaction.user.id))
            return interaction.reply({ embeds: [err1] })

        const level = interaction.options.getInteger('level') || 1;


        const err2 = new ME()
            .setTitle('OI')
            .setDescription("❎ **| I'm sorry, that's an invalid level!**")
            .setColor(config.colors.no)
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })

        const err3 = new ME()
            .setTitle("OI")
            .setDescription("❎ **| I'm sorry, level range is from 1-20!**")
            .setColor(config.colors.no)
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })

        if (isNaN(level))
            return interaction.reply({ embeds: [err2] })

        if (level < 0 || level > 20)
            return interaction.reply({ embeds: [err3] })

        const operator_amount = interaction.options.getInteger('operator_amount') || 1;


        const err4 = new ME()
            .setTitle('Aweee~')
            .setDescription("❎ **| I'm sorry, that's an invalid operator amount!**")
            .setColor(config.colors.no)
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

        const err5 = new ME()
            .setTitle('Aweee~')
            .setDescription("❎ **| I'm sorry, operator amount range is from 1-10!**")
            .setColor(config.colors.no)
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

        if (isNaN(operator_amount))
            return interaction.reply({ embeds: [err4] })

        if (operator_amount < 1 || operator_amount > 10)
            return interaction.reply({ embeds: [err5] })

        const val = await generateEquation(level, operator_amount);
        const equation = val[0];

        const err6 = new ME()
            .setTitle('A-')
            .setDescription("❎ **| I'm sorry, the equation generator had problems generating your equation, please try again!**")
            .setColor(config.colors.no)
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

        if (!equation)
            return interaction.reply({ embeds: [err6] })

        const answer = val[1];

        const answerEmbed = new ME()
            .setTitle('Answer The Question')
            .setDescription(`❗**| ${interaction.user}, here is your equation:\n\`Operator count ${operator_amount}, level ${level}\`\n\`\`\`fix\n${equation} = ...\`\`\`You have 60 seconds to solve it.**`)
            .setColor(config.colors.answer)
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

        interaction.reply(
            { embeds: [answerEmbed] }
        ).then(msg => {
            cd.add(interaction.user.id);
            let collector = interaction.channel.createMessageCollector(
                {
                    filter: (m) =>
                        parseInt(m.content) === answer && m.author.id === interaction.user.id,
                    time: 60000,
                    max: 1
                }
            );

            let correct = false;

            collector.on('collect', async () => {
                cd.add(interaction.user.id);
                correct = true;

                const level = interaction.options.getInteger('level')
                const operator_amount = interaction.options.getInteger('operator_amount')
                const userID = interaction.user.id
                const userName1 = interaction.user.username

                const timeDiff = Date.now() - msg.createdTimestamp;
                const ans1 = new ME()
                    .setTitle('Yey you got the answer~')
                    .setDescription(`✅ **| ${interaction.user}, your answer is correct! It took you ${timeDiff / 1000}s!\n\`\`\`fix\n${equation} = ${answer}\`\`\`**`)
                    .setColor(config.colors.correct)
                    .setTimestamp()
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                interaction.editReply({ embeds: [ans1] })

                cd.delete(interaction.user.id);

                try {
                    const userProfile = await MS.findOneAndUpdate(
                        { userID },
                        {
                            $inc: {
                                [`lvl${level}`]: 1,
                                totalanswered: 1,
                                totalequations: 1,
                            },
                        },
                        {
                            new: true,
                            upsert: true
                        }
                    );

                    const currencyEarned = await playGame(userID, 'math', level, operator_amount);

                    const newbal = currencyEarned;

                    const currencyUpRes = await currency.findOneAndUpdate(
                        { userName: userName1 },
                        { $set: { userID: userID }, $inc: { balance: newbal } },
                        { upsert: true, new: true }
                    );
                    console.log(`The username is: ${userName1}`);
                    console.log(`User Profile updated and added a new balance of ${newbal}`);
                    console.log('User profile updated');
                    return currencyUpRes, userProfile;
                } catch (err) {
                    console.log(err);
                }


            })

            collector.once('end', async () => {
                const ans2 = new ME()
                    .setTitle('Aweee Time Out~')
                    .setDescription(`❎ **| ${interaction.user}, timed out. The correct answer is:\n\`\`\`fix\n${equation} = ${answer}\`\`\`**`)
                    .setColor(config.colors.no)
                    .setTimestamp()
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                if (!correct) {
                    interaction.followUp({ embeds: [ans2] })
                    cd.delete(interaction.user.id);

                    const level = interaction.options.getInteger('level');
                    const userID = interaction.user.id;

                    try {
                        const userProfile = await MS.findOneAndUpdate(
                            { userID },
                            {
                                $inc: {
                                    totalequations: 1,
                                },
                            },
                            {
                                upsert: true,
                                new: true,
                            }
                        );

                        console.log('New Profile has been updated');
                        return userProfile;
                    } catch (err) {
                        console.log(err);
                    }
                }

            })
        })
    }
}