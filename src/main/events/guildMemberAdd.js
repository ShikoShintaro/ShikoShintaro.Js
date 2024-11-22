const { Events } = require('discord.js');
const banners = require('../../cores/system/builders/banners.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const id = '1123944091403689995';
        const welcome = member.guild.channels.cache.get(id);

        if (welcome) {
            welcome.send("Welcome to the server");

            const attachment = await banners.generateBanner(member.users);
            welcome.send({ files: [attachment] });
        }
    }
};
