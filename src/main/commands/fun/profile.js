const { EmbedBuilder, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const client = require('../../shiko-main');
const MS = require('../../schemas/mathscores')
const TS = require('../../schemas/scores')
const ME = EmbedBuilder;

const Canva = require('@napi-rs/canvas');
const path = require('path');

const rp = path.resolve(__dirname, '../../../../files/images/background/anime1.jpg');

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
            .setDescription('Please wait while getting the info of this user')
            .setColor("Random")
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })

        await interaction.reply({ embeds: [embed1] })

        const user = interaction.options.getUser('user')

        switch (typeOption.value) {
            case 'Overall profile':
                if (user) {
                    const usrava = interaction.options.getUser('user');
                    const canvas = Canva.createCanvas(1920, 600);

                    const ctx = canvas.getContext('2d');

                    const bg = await Canva.loadImage(rp);

                    ctx.filter = 'blur(0px)';
                    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
                    ctx.filter = 'none';

                    ctx.strokeRect(0, 0, canvas.width, canvas.height);

                    const avatar = await Canva.loadImage(usrava.displayAvatarURL({ extension: 'jpg' }));


                    const tbBorderSize = 5; 
                    const avatarRadius = 100;
                    const spaceBetweenAvatarAndText = 20; 

                    const profileX = 50 - tbBorderSize;
                    const profileY = 50 - tbBorderSize;
                    const profileWidth = 1820 + 2 * tbBorderSize;
                    const profileHeight = 520 + 2 * tbBorderSize;

                    ctx.globalAlpha = 1 // Adjust transparency level
                    ctx.fillStyle = 'rgba(169, 169, 169, 0.5)';
                    ctx.fillRect(profileX, profileY, profileWidth, profileHeight);

                    ctx.strokeStyle = '#ffffff'; // Border color
                    ctx.lineWidth = tbBorderSize;

                    // Draw the border with larger space
                    ctx.strokeRect(profileX, profileY, profileWidth, profileHeight);

                    // Draw the circular avatar with a border
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(150, 150, avatarRadius + tbBorderSize, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(avatar, 50, 50, 2 * avatarRadius, 2 * avatarRadius);
                    ctx.restore();
                    ctx.font = '30px Arial';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(`${usrava.username}'s Profile`, 290, 150);

                    ctx.globalAlpha = 1.0;


                    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'olok.png' })

                    interaction.editReply({ files: [attachment], embeds: [] })
                    //     if (userProfile) {

                    //         let formattedProfile =
                    //             `**Total Equations :** ${userProfile.totalequations}\n`
                    //             + `**Total Answered :** ${userProfile.totalanswered}\n`

                    //             // for (let i = 1; i <= 10; i++) {
                    //             //     const levelkey = `lvl${i}`
                    //             //     if (userProfile[levelkey] !== undefined) {
                    //             //         formattedProfile += `**Level ${i} answered :** ${userProfile[levelkey]}\n`
                    //             //     } else {
                    //             //         formattedProfile += `**Level ${i} answered :** Not Answered\n`
                    //             //     }
                    //             // }

                    //         let formattedProf = 
                    //             `**Total Questions :** ${userProf.totalquestions}\n`
                    //             + `**Total Answered :** ${userProf.correctAnswers}\n`

                    //         const embed2 = new ME()
                    //             .setTitle(`${user.username}\'s Profile`)
                    //             .addFields(
                    //                 {
                    //                     name : "Math Profile",
                    //                     value : formattedProfile
                    //                 },
                    //                 {
                    //                     name : "Trivia Profile",
                    //                     value : formattedProf
                    //                 }
                    //             )
                    //             .setColor("Random")
                    //             .setTimestamp()
                    //             .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })

                    //         interaction.editReply({ embeds: [embed2] })
                    //     }
                }
                break;
        }




    }

}