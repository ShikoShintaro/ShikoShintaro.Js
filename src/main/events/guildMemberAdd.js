const { Events } = require('discord.js');
const banners = require('../../cores/system/builders/banners.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {

        // const userID = member.user.id;

        // try {
        //     // Fetch the user/member based on guildID and userID
        //     const fetchedMember = await fetchUser(member.client, userID);

        //     // Now you can use fetchedMember for your banner logic
        //     console.log(fetchedMember.user.tag);
        //     // More code to handle the banner generation...
        // } catch (error) {
        //     console.error("Error handling new member:", error);
        // }

        // Channel ID where the welcome message will be sent
        const channelId = '1123944091403689995';
        const welcomeChannel = member.guild.channels.cache.get(channelId);

        if (!welcomeChannel) {
            console.error(`Channel with ID ${channelId} not found.`);
            return;
        }


        try {
            // Send a welcome message
            await welcomeChannel.send(`Welcome to the server, ${member.user.username}! 🎉`);

            // Generate and send the banner
            const bannerAttachment = await banners.generateBanner(member);
            await welcomeChannel.send({ files: [bannerAttachment] });
        } catch (error) {
            console.error('Error handling new member:', error);
        }
    },
};
