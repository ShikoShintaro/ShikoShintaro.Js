const Canva = require('@napi-rs/canvas');
const path = require('path');
const { AttachmentBuilder } = require('discord.js');

// Loading the main client

const client = require('../../../main/shiko-main')

const generateBanner = async (member) => {

    try {

        const memberName = member.user.displayName;

        const userProfile = member.user.displayAvatarURL({ format: 'jpg' });

        // Create a canvas
        const canvas = Canva.createCanvas(1920, 600);
        const ctx = canvas.getContext('2d');

        //shortcut
        const c = ctx;

        // Load the background image
        const backgroundPath = path.resolve(__dirname, '../../../../files/images/background/welcome.png');
        const backgroundImage = await Canva.loadImage(backgroundPath);

        // Apply blur and draw background
        ctx.filter = 'blur(5px)';
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'none';

        // Draw a border (optional visual enhancement)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        const gradient = c.createLinearGradient(0, 0, canvas.width, 0)
        gradient.addColorStop(0, '#ffffff'); // Deep Pink
        gradient.addColorStop(0.5, '#ffffff'); // Hot Pink
        gradient.addColorStop(1, '#ffffff'); // Deep Pink

        //making the text center
        ctx.textAlign = 'center'

        // Text shadow for glowing effect
        c.shadowColor = '#000000';
        c.shadowBlur = 30;
        c.shadowOffsetX = 2;
        c.shadowOffsetY = 2;

        // Reusable function to draw text
        function drawText(ctx, text, fontSize, fontFamily, x, y) {
            ctx.font = `${fontSize} ${fontFamily}`;
            ctx.fillStyle = gradient;
            ctx.fillText(text, x, y);
        }

        // Loading the avatar context
        const avatar = await Canva.loadImage(userProfile);

        const avatarSize = 240;
        const avatarx = (canvas.width - avatarSize) / 2;
        const avatary = 90;

        c.save();
        c.beginPath();
        c.arc(
            avatarx + avatarSize / 2,
            avatary + avatarSize / 2,
            avatarSize / 2,
            0,
            Math.PI * 2
        );

        c.closePath();
        c.clip();
        c.drawImage(avatar, avatarx, avatary, avatarSize, avatarSize);
        c.restore();        

        const medievalFont = 'Old English Text MT';

        //calculating the center of the usernamex
        const usernamex = canvas.width / 2;
        const usernamey = 550;

        ctx.strokeRect(memberName, usernamex, usernamey);
        ctx.fillText(memberName, usernamex, usernamey);


        // Draw the username on the canvas
        drawText(ctx, `${memberName}`, '70px', medievalFont, usernamex, usernamey);
        drawText(ctx, 'Welcome To The Server!', '50px', medievalFont, usernamex, 450);

        // Encode the canvas into a PNG buffer
        const attachmentBuffer = await canvas.encode('png');

        // Return the banner as an attachment
        return new AttachmentBuilder(attachmentBuffer, { name: `${member.user.username}-welcome.png` });
    } catch (error) {
        console.error('Error generating banner:', error);
        throw new Error('Failed to generate banner.');
    }
};

module.exports = {
    generateBanner,
};
