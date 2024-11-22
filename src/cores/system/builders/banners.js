const Canva = require('@napi-rs/canvas');
const path = require('path');
const { AttachmentBuilder } = require('discord.js');

const generateBanner = async (user) => {
    const canvas = Canva.createCanvas(1920, 600);
    const ctx = canvas.getContext('2d');
    
    const rp = path.resolve(__dirname, '../../../../files/images/background/anime1.jpg');
    const bg = await Canva.loadImage(rp);

    ctx.filter = 'blur(5px)';
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';

    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    const attachmentBuffer = await canvas.encode('png');

    function fillText(ctx, text, fontSize, fontFamily, x, y) {
        ctx.font = `${fontSize} ${fontFamily}`
        ctx.fillStyle = '#ffffff'
        ctx.fillText(text, x, y);
    }
    
    fillText(ctx, `${user.username}`, font, style, 290, 170);

    return new AttachmentBuilder(attachmentBuffer, { name: `${user.username}.png` });
};

module.exports = {
    generateBanner,
};
