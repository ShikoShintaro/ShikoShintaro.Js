const { Client, Message, DiscordAPIError, EmbedBuilder, Embed, SlashCommandBuilder } = require('discord.js');
let cd = new Set()
const client = require('../../shiko-main');
const config = require('../../../cores/system/config/shiko.json');
const ME = EmbedBuilder

//importing databases
const MS = require('../../../cores/databases/mathscores')

//importing functions
const { generateEquation } = require('../../../cores/games/math/mathsystem')
const { playGame } = require('../../../cores/games/currency/currencysystem')

//importing embeds
const {
    mathCreateEmbed, mathEditEmbed
} = require('../../../cores/system/builders/embed')

//importing ecosystem output
const {
    formattedCurrency
} = require('../../../cores/games/currency/currencysystem')

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

        if (cd.has(interaction.user.id))
            return mathCreateEmbed(
                interaction,
                'OI',
                "❎ **| Hey, you still have an equation to solve! Please solve that one first before creating another equation!**"
            )

        const level = interaction.options.getInteger('level') || 1;

        if (isNaN(level))
            return mathCreateEmbed(
                interaction,
                'OI',
                "❎ **| I'm sorry, that's an invalid level!**",
                config.colors.no
            )

        if (level < 0 || level > 20)
            return mathCreateEmbed(
                interaction,
                "OI",
                "❎ **| I'm sorry, level range is from 1-20!**",
                config.colors.no
            )

        const operator_amount = interaction.options.getInteger('operator_amount') || 1;

        if (isNaN(operator_amount))
            return mathCreateEmbed(
                interaction,
                'Aweee~',
                "❎ **| I'm sorry, that's an invalid operator amount!**",
                config.colors.no
            )

        if (operator_amount < 1 || operator_amount > 10)
            return mathCreateEmbed(
                'Aweee~',
                "❎ **| I'm sorry, operator amount range is from 1-10!**",
                config.colors.no
            )

        const val = await generateEquation(level, operator_amount);
        const equation = val[0];

        if (!equation)
            return mathCreateEmbed(
                interaction,
                'A-',
                "❎ **| I'm sorry, the equation generator had problems generating your equation, please try again!**",
                config.colors.options
            )

        const answer = val[1];

        return mathCreateEmbed(
            interaction,
            'Answer The Question',
            `❗**| ${interaction.user}, here is your equation:\n\`Operator count ${operator_amount}, level ${level}\`\n\`\`\`fix\n${equation} = ...\`\`\`You have 60 seconds to solve it.**`,
            'Random'
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

                const timeDiff = Date.now() - interaction.createdTimestamp;

                const result = await playGame(interaction, userName1, userID, 'math', level, operator_amount);

                await mathEditEmbed(interaction, {
                    title: 'Yey you got the answer~',
                    description: `✅ **| ${interaction.user}, your answer is correct! It took you ${timeDiff / 1000}s!\n\`\`\`fix\n${equation} = ${answer}\`\`\`**`,
                    colors: config.colors.correct,
<<<<<<< HEAD
                    fields: [{ name: '✅ **| And you also earned a balance for : **', value: `**\`\`\`fix\n${result.formattedCurrency}\`\`\`**` }]
=======
                    fields: [
                        { name: `✅ **| And ${interaction.user} also earned a balance for : **`, value: `**\`\`\`fix\n${result.formattedCurrency}\`\`\`**` }
                    ]
>>>>>>> 6637085 (First Major Updates)
                });


                console.log('USER EARNED A MONEY OF :', result.formattedCurrency)

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

                    console.log('User profile updated');
                    return userProfile;
                } catch (err) {
                    console.log(err);
                }


            })

            collector.once('end', async () => {

                if (!correct) {
<<<<<<< HEAD
                    mathEditEmbed(
                        'Aweee Time Out~',
                        `❎ **| ${interaction.user}, timed out. The correct answer is:\n\`\`\`fix\n${equation} = ${answer}\`\`\`**`,
                        config.colors.no
                    )
=======
                    mathEditEmbed(interaction, {
                        title : 'Aweee Time Out~',
                        description : `❎ **| ${interaction.user}, timed out. The correct answer is:\n\`\`\`fix\n${equation} = ${answer}\`\`\`**`,
                        colors : config.colors.no,
                        fields: [{ name: '❎ **| You will not get a reward bec the timer ran out : **', value: `**\`\`\`fix\n0\`\`\`**` }]
                    })
>>>>>>> 6637085 (First Major Updates)
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