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

                    const user = interaction.options.getUser('user');

                    const canvas = Canva.createCanvas(1920, 600);

                    const ctx = canvas.getContext('2d');

                    const bg = await Canva.loadImage(rp);

                    ctx.filter = 'blur(0px)';
                    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
                    ctx.filter = 'none';

                    ctx.strokeRect(0, 0, canvas.width, canvas.height);

                    const avatar = await Canva.loadImage(user.displayAvatarURL({ extension: 'jpg' }));


                    const tbBorderSize = 5;
                    const avatarRadius = 90;
                    const spaceBetweenAvatarAndText = 20;

                    const profileX = 54;
                    const profileY = 53;
                    const profileWidth = 1820 + 2 * tbBorderSize;
                    const profileHeight = 520 + 2 * tbBorderSize;

                    ctx.globalAlpha = 1 // Adjust transparency level
                    ctx.fillStyle = 'rgba(169, 169, 169, 0.7)'; //RGB COLOR Alpha function
                    ctx.fillRect(profileX, profileY, profileWidth, profileHeight);
                    ctx.strokeStyle = '#ffffff'; // Border color
                    ctx.lineWidth = tbBorderSize;

                    // Draw the border with larger space
                    ctx.strokeRect(profileX, profileY, profileWidth, profileHeight);

                    const avatarX = profileX + tbBorderSize + 10;
                    const avatarY = profileY + tbBorderSize + 10;

                    // Draw the circular avatar with a border
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(avatarX + avatarRadius, avatarY + avatarRadius, avatarRadius + tbBorderSize, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(avatar, avatarX, avatarY, 2 * avatarRadius + 2 * tbBorderSize, 2 * avatarRadius + 2 * tbBorderSize);
                    ctx.restore();


                    //user profile
                    ctx.font = '40px Monsterrat';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(`${user.username}`, 290, 170);


                    //the math
                    ctx.font = '33px Poppins';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(`Math Game`, 320, 225);

                    ctx.font = '30px Poppins';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(`Total Equations :`, 350, 275);

                    ctx.font = '30px Poppins';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(`Total Answered :`, 930, 275);



                    if (user) {
                        const userID = user.id

                        const usr = await MS.findOne({ userID })

                        if (usr) {
                            const totalequationsValue = usr.totalequations
                            const totalquestionValue = usr.totalanswered

                            ctx.font = '27px Poppins';
                            ctx.fillStyle = '#ffffff';
                            ctx.fillText(`${totalequationsValue}`, 620, 275)

                            ctx.font = '27px Poppins';
                            ctx.fillStyle = '#ffffff';
                            ctx.fillText(`${totalquestionValue}`, 1210, 275)

                        } else {

                            ctx.font = '27px Poppins';
                            ctx.fillStyle = '#ffffff';
                            ctx.fillText(`User not played yet`, 620, 275)

                            ctx.font = '27px Poppins';
                            ctx.fillStyle = '#ffffff';
                            ctx.fillText(`User not played yet`, 1210, 275)

                        }
                    } else {
                        console.log('NO user found')
                    }

                    ctx.font = '33px Poppins';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(`Trivia Game`, 320, 330);

                    ctx.font = '30px Poppins';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(`Total Questions :`, 350, 380);

                    ctx.font = '30px Poppins';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(`Total Answered :`, 930, 380);

                    if (user) {
                        const userId = user.id

                        const usr1 = await TS.findOne({ userId })

                        if (usr1) {
                            const totalquesValue = usr1.totalquestions
                            const totalansweredValue = usr1.totalanswered

                            ctx.font = '27px Poppins';
                            ctx.fillStyle = '#ffffff';
                            ctx.fillText(`${totalquesValue}`, 620, 380)

                            ctx.font = '27px Poppins';
                            ctx.fillStyle = '#ffffff';
                            ctx.fillText(`${totalansweredValue}`, 1210, 380)

                        } else {
                            ctx.font = '27px Poppins';
                            ctx.fillStyle = '#ffffff';
                            ctx.fillText(`User not played yet`, 620, 380)

                            ctx.font = '27px Poppins';
                            ctx.fillStyle = '#ffffff';
                            ctx.fillText(`User not played yet`, 1210, 380)
                        }


                    } else {
                        console.log('user not found in the database')
                    }

                    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'olok.png' })

                    interaction.editReply({ files: [attachment], embeds: [] })
                }
                break;
        }




    }

}