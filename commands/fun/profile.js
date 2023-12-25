const { EmbedBuilder, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const client = require('../../shiko-main');
const MS = require('../../schemas/mathscores')
const TS = require('../../schemas/scores')
const ME = EmbedBuilder;

const canva = require('canvacord')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Gets the user profile')
        .addUserOption(option => option.setName('user')
            .setDescription('Mention a user or you can leave it blank :> ')
            .setRequired(true))
        .addStringOption(option => option.setName('profile-type')
            .setDescription('What type of profile')
            .setRequired(true)
            .addChoices(
                { name: 'Global', value: 'Overall profile' },
                { name: 'Math', value: 'Math profile only' },
                { name: 'Trivia', value: 'Trivia profile' }
            )),
    async execute(interaction) {
        const typeOption = interaction.options.get('profile-type');

        const embed1 = new ME()
            .setTitle('Getting user profile...')
            .setDescription('Please wait while getting the infr of this user')
            .setColor("Random")
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })

        await interaction.reply({ embeds: [embed1] })

        const user = interaction.options.getUser('user')

        switch (typeOption.value) {
            case 'Overall profile':
                if (user) {
                    const userID = user.id

                    const userProfile = await MS.findOne({ userID })

                    const userProf = await TS.findOne({ userID })

                    if (userProfile) {

                        let formattedProfile =
                            `**Total Equations :** ${userProfile.totalequations}\n`
                            + `**Total Answered :** ${userProfile.totalanswered}\n`

                            // for (let i = 1; i <= 10; i++) {
                            //     const levelkey = `lvl${i}`
                            //     if (userProfile[levelkey] !== undefined) {
                            //         formattedProfile += `**Level ${i} answered :** ${userProfile[levelkey]}\n`
                            //     } else {
                            //         formattedProfile += `**Level ${i} answered :** Not Answered\n`
                            //     }
                            // }

                        let formattedProf = 
                            `**Total Questions :** ${userProf.totalquestions}\n`
                            + `**Total Answered :** ${userProf.correctAnswers}\n`

                        const embed2 = new ME()
                            .setTitle(`${user.username}\'s Profile`)
                            .addFields(
                                {
                                    name : "Math Profile",
                                    value : formattedProfile
                                },
                                {
                                    name : "Trivia Profile",
                                    value : formattedProf
                                }
                            )
                            .setColor("Random")
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })

                        interaction.editReply({ embeds: [embed2] })
                    }
                }
                break;
        }




    }

}