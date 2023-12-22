const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
let cd = new Set()
const { MongoClient } = require('mongodb');
const client = require('../../shiko-main')
const TS = require('../../schemas/scores')

const ME = EmbedBuilder

let currentQuestion; // Store the current question globally

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('Start a trivia game'),

    async execute(interaction) {
        async function getRandomQuestion() {
            const uri = process.env.shikouri;
            const client1 = new MongoClient(uri);

            try {
                await client1.connect();
                console.log('Connected to the database');

                const database = client1.db('TriviaDB');
                const collection = database.collection('Questions');

                const result = await collection.findOne();

                if (!result || !result.questions || result.questions.length === 0) {
                    throw new Error('Invalid question format in the database.');
                }

                const randomIndex = Math.floor(Math.random() * result.questions.length);
                const randomQuestion = result.questions[randomIndex];

                if (!randomQuestion || !randomQuestion.question || !randomQuestion.answers || randomQuestion.answers.length === 0 || !randomQuestion.correctAnswer) {
                    throw new Error('Invalid question format in the database.');
                }

                const questionObject = {
                    question: randomQuestion.question,
                    answers: randomQuestion.answers,
                    correctAnswer: randomQuestion.correctAnswer,
                };

                console.log('Retrieved question:', questionObject.question);
                console.log('Retrieved answers:', questionObject.answers);

                return questionObject;
            } finally {
                await client1.close();
                console.log('Disconnected from the database');
            }
        }

        const randomQuestion = await getRandomQuestion();
        const shuffledAnswers = randomQuestion.answers.sort(() => Math.random() - 0.5);

        const buttons = shuffledAnswers.map((answer, index) =>
            new ButtonBuilder()
                .setCustomId(`trivia_${index}`)
                .setLabel(String.fromCharCode(65 + index)) // Convert index to ASCII code ('a', 'b', 'c', 'd')
                .setStyle(ButtonStyle.Primary)
        );


        const row = new ActionRowBuilder().addComponents(buttons);

        // Generate the answer options as a string (e.g., "a. answer1\nb. answer2\nc. answer3\nd. answer4")
        const answerOptionsString = shuffledAnswers.map((answer, index) =>
            `${String.fromCharCode(97 + index)}. ${answer}`
        ).join('\n');

        // await interaction.reply({
        //     content: `Here is your question: ${randomQuestion.question}\n${shuffledAnswers.map((answer, index) => `${String.fromCharCode(97 + index)}. ${answer}`).join('\n')}`,
        //     components: [row],
        // });



        const collectorFilter = i => i.user.id === interaction.user.id;

        try {

            const err = new ME()
                .setTitle('OI!!')
                .setDescription(`Hey! there's still a question you need to answer!`)
                .setColor('Random')
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })

            if (cd.has(interaction.user.id)) {
                return interaction.reply(
                    {
                        embeds: [err]
                    }
                )
            }


            const embed1 = new ME()
                .setTitle('Trivia Question!!')
                .setDescription(`❗**| ${interaction.user}, Here is your question: \`\`\`${randomQuestion.question}\n${shuffledAnswers.map((answer, index) => `${String.fromCharCode(97 + index)}. ${answer}`).join('\n')}\`\`\`**`)
                .setColor('Random')
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })

            await interaction.reply(
                {
                    embeds: [embed1],
                    components: [row]
                }
            ).then(msg => {
                cd.add(interaction.user.id);
                const collector = interaction.channel.createMessageComponentCollector(
                    {
                        filter: collectorFilter,
                        time: 30000
                    }
                );


                collector.on('collect', async i => {
                    const selectedAnswerIndex = i.customId.split('_')[1];
                    const selectedAnswer = shuffledAnswers[selectedAnswerIndex];

                    cd.add(interaction.user.id);


                    if (selectedAnswer === randomQuestion.correctAnswer) {
                        const embed2 = new ME()
                            .setTitle('You Got The Correct Answer')
                            .setDescription(`Congratulations! You chose the correct answer: ${selectedAnswer}`)
                            .setColor('Random')
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })



                        // Handle correct answer logic here
                        await interaction.editReply({
                            embeds: [embed2],
                            components: []
                        });

                        cd.delete(interaction.user.id)

                        collector.stop();

                        const userId = interaction.user.id;

                        try {
                            // const database1 = client1.db('Users');
                            // const collection = database1.collection('Profiles');

                            const userProfile = await TS.findOneAndUpdate(
                                { userId },
                                {
                                    $inc: {
                                        totalquestions: 1
                                    },
                                    $set: {
                                        correctAnswers: 1
                                    }
                                },
                                {
                                    upsert: true,
                                    new: true,
                                    maxTimeMS: 20000
                                }
                            );

                            console.log(`User profile updated ${userId}`);

                            return userProfile;
                        } catch (err) {
                            console.log(err)
                        }



                    } else {
                        const embed3 = new ME()
                            .setTitle('You Got The Wrong Answer')
                            .setDescription(`Oops! You chose the incorrect answer. The correct answer is: ${randomQuestion.correctAnswer}`)
                            .setColor('Random')
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })

                        // Handle incorrect answer logic here
                        await interaction.editReply({
                            embeds: [embed3],
                            components: []
                        });

                        cd.delete(interaction.user.id)

                        collector.stop()

                        const userId = interaction.user.id;

                        const existingProfile = await TS.findOne({ userId });

                        if (existingProfile) {

                            const userProfile = await TS.findOneAndUpdate(
                                { userId },
                                { $inc: { totalquestions: 1 } },
                                { new: true, maxTimeMS: 20000 }
                            );

                            console.log(`User profile updated ${userId}`);
                            return userProfile;
                        } else {

                            const userProfile = await TS.create({
                                userId,
                                totalquestions: 1,
                            });

                            console.log(`New user profile created ${userId}`);
                            return userProfile;
                        }

                    }

                    cd.delete(interaction.user.id);
                })

                collector.once('end', async (collected, reason) => {
                    if (reason === 'time' && interaction.replied) {
                        const err1 = new ME()
                            .setTitle('Times Up!!!!')
                            .setDescription('You did not answer in time.')
                            .setColor('Random')
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })

                        interaction.editReply({
                            embeds: [err1],
                            components: []
                        });
                        cd.delete(interaction.user.id);

                        const userId = interaction.user.id;

                        const existingProfile = await TS.findOne({ userId });

                        if (existingProfile) {

                            const userProfile = await TS.findOneAndUpdate(
                                { userId },
                                { $inc: { totalquestions: 1 } },
                                { new: true, maxTimeMS: 20000 }
                            );

                            console.log(`User profile updated ${userId}`);
                            return userProfile;
                        } else {

                            const userProfile = await TS.create({
                                userId,
                                totalquestions: 1,
                            });

                            console.log(`New user profile created ${userId}`);
                            return userProfile;
                        }
                    }
                });

            })

        } catch (error) {
            console.log(error);
            if (interaction.replied) {

                const emerr = new ME()
                    .setTitle('Error')
                    .setDescription('Error in the collector so please be patient the score will not be recorded in this one')
                    .setFooter(
                        {
                            text: client.user.username,
                            iconURL: client.user.displayAvatarURL()
                        }
                    )

                await interaction.followUp(
                    {
                        embeds: [emerr]
                    }
                );
            } else {
                console.log('Interaction already handled or no longer valid.');
            }
        }
    },
};