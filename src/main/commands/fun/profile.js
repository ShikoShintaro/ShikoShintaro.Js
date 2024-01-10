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

        const canvas = Canva.createCanvas(1920, 600);

        const ctx = canvas.getContext('2d');

        const bg = await Canva.loadImage(rp);

        ctx.filter = 'blur(5px)';
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
        ctx.fillStyle = 'rgba(169, 169, 169, 0.8)'; //RGB COLOR Alpha function
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

        const style = 'DejaVu Sans Mono'; //global adjustment

        switch (typeOption.value) {


            case 'Overall profile':
                if (user) {

                    const user = interaction.options.getUser('user');


                    function fillText1(ctx, text, fontSize, fontFamily, x, y) {
                        ctx.font = `${fontSize} ${fontFamily}`
                        ctx.fillStyle = '#ffffff'
                        ctx.fillText(text, x, y);
                    }

                    //user profile
                    const font = '40px'; //username font size

                    //for the categories 
                    const font1 = '33px';
                    const font2 = '30px';

                    //for the sub categories;
                    const font3 = '25px'

                    fillText1(ctx, `${user.username}`, font, style, 290, 170);

                    //the math
                    fillText1(ctx, 'Math Game', font1, style, 320, 225);

                    fillText1(ctx, `Total Equations :`, font2, style, 350, 275);

                    fillText1(ctx, `Total Answered :`, font2, style, 990, 275);



                    if (user) {
                        const userID = user.id

                        const usr = await MS.findOne({ userID })

                        if (usr) {
                            const totalequationsValue = usr.totalequations
                            const totalquestionValue = usr.totalanswered

                            fillText1(ctx, `${totalequationsValue}`, font3, style, 680, 275)

                            fillText1(ctx, `${totalquestionValue}`, font3, style, 1300, 275)

                        } else {

                            fillText1(ctx, `User not played yet`, font3, style, 680, 275)

                            fillText1(ctx, `User not played yet`, font3, style, 1300, 275)

                        }
                    } else {
                        console.log('NO user found')
                    }

                    fillText1(ctx, `Trivia Game`, font1, style, 320, 330);

                    fillText1(ctx, `Total Questions :`, font2, style, 350, 380);

                    fillText1(ctx, `Total Answered :`, font2, style, 990, 380);

                    if (user) {
                        const userId = user.id

                        const usr1 = await TS.findOne({ userId })

                        if (usr1) {
                            const totalquesValue = usr1.totalquestions
                            const totalansweredValue = usr1.correctAnswers

                            fillText1(ctx, `${totalquesValue}`, font3, style, 680, 380)

                            fillText1(ctx, `${totalansweredValue}`, font3, style, 1300, 380)

                        } else {
                            fillText1(ctx, `User not played yet`, font3, style, 680, 380)

                            fillText1(ctx, `User not played yet`, font3, style, 1300, 380)
                        }


                    } else {
                        console.log('user not found in the database')
                    }



                    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: `${user.username}.png` })

                    interaction.editReply({ files: [attachment], embeds: [] })
                }
                break;


            case "Math profile only":

                if (user) {
                    const user = interaction.options.getUser('user');

                    async function mathText(ctx, text, fontSize, fontFamily, x, y) {
                        ctx.font = `${fontSize} ${fontFamily}`;
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(text, x, y);
                    }

                    async function mathLevelText(ctx, level, fontSize, fontFamily, x, y, usr) {
                        ctx.font = `${fontSize} ${fontFamily}`;
                        ctx.fillStyle = '#ffffff'; // Default color

                        const levelKey = `lvl${level}`;
                        const levelValue = usr && usr[levelKey] !== undefined ? usr[levelKey] : 'Not answered';

                        // Customize styling for levels that haven't been answered
                        if (levelValue === 'Not answered') {
                            ctx.fillStyle = '#999999'; // Gray color for unanswered levels
                        }

                        // Draw the level information
                        ctx.fillText(`Level ${level} : ${levelValue}`, x, y);

                        // Reset fill style to default after drawing each level
                        ctx.fillStyle = '#ffffff';
                    }

                    // Math size profile
                    const fontSize = '40px';

                    // For categories
                    const font1 = '33px';
                    const font2 = '30px';
                    const font3 = '25px';

                    await mathText(ctx, `${user?.username}`, fontSize, style, 290, 170);

                    await mathText(ctx, 'Math Game Profile', font1, style, 320, 225);

                    await mathText(ctx, `Total Equations :`, font2, style, 350, 275);

                    await mathText(ctx, `Total Answered :`, font2, style, 990, 275);

                    if (user) {
                        const userID = user.id;
                        const usr = await MS.findOne({ userID });

                        if (usr) {
                            const totalanswered = usr.totalanswered
                            const totalequations = usr.totalequations

                            await mathText(ctx, `${totalequations}`, font2, style, 670, 275)
                            await mathText(ctx, `${totalanswered}`, font2, style, 1290, 275)

                        }

                        // Check if usr is defined before using it
                        if (usr) {
                            await mathLevelText(ctx, '1', '20px', 'Arial', 350, 325, usr);
                            await mathLevelText(ctx, '2', '20px', 'Arial', 350, 375, usr);
                            await mathLevelText(ctx, '3', '20px', 'Arial', 350, 425, usr);
                            await mathLevelText(ctx, '4', '20px', 'Arail', 350, 475, usr);
                            await mathLevelText(ctx, '5', '20px', 'Arail', 350, 525, usr);
                            await mathLevelText(ctx, '6', '20px', 'Arail', 990, 325, usr);
                            await mathLevelText(ctx, '7', '20px', 'Arail', 990, 375, usr);
                            await mathLevelText(ctx, '8', '20px', 'Arail', 990, 425, usr);
                            await mathLevelText(ctx, '9', '20px', 'Arail', 990, 475, usr);
                            await mathLevelText(ctx, '10', '20px', 'Arail', 990, 525, usr);
                            // Add more level mentions as needed
                        }
                    }
                }



                const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: `${user.username}.png` })

                interaction.editReply({ files: [attachment], embeds: [] })

                break;

            case "Trivia Profile" :

                //coming soon!

                break;
        }

    }


}

