const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { MongoClient } = require('mongodb');

let currentQuestion; // Store the current question globally

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('Start a trivia game'),

    async execute(interaction) {
        async function getRandomQuestion() {
            const uri = process.env.shikouri;
            const client = new MongoClient(uri);

            try {
                await client.connect();
                console.log('Connected to the database');

                const database = client.db('TriviaDB');
                const collection = database.collection('trivias');

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
                await client.close();
                console.log('Disconnected from the database');
            }
        }

        const randomQuestion = await getRandomQuestion();
        const shuffledAnswers = randomQuestion.answers.sort(() => Math.random() - 0.5);

        const buttons = shuffledAnswers.map((answer, index) =>
            new ButtonBuilder()
                .setCustomId(`trivia_${index}`)
                .setLabel(String.fromCharCode(97 + index)) // Convert index to ASCII code ('a', 'b', 'c', 'd')
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

        try {
            const response = await interaction.reply({
                content: `Here is your question: ${randomQuestion.question}\n${shuffledAnswers.map((answer, index) => `${String.fromCharCode(97 + index)}. ${answer}`).join('\n')}`,
                components: [row],
            });

            const collectorFilter = i => i.user.id === interaction.user.id;
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

            const selectedAnswerIndex = confirmation.customId.split('_')[1];
            const selectedAnswer = shuffledAnswers[selectedAnswerIndex];

            if (selectedAnswer === randomQuestion.correctAnswer) {
                // Handle correct answer logic here
                await interaction.followUp(`Congratulations! You chose the correct answer: ${selectedAnswer}`);
            } else {
                // Handle incorrect answer logic here
                await interaction.followUp(`Oops! You chose the incorrect answer. The correct answer is: ${randomQuestion.correctAnswer}`);
            }

            // After handling the answer, remove the components
            await interaction.editReply({ components: [] });

        } catch (error) {
            console.log(error);
            await interaction.followUp('You did not answer in time.');
        }


    },
};
