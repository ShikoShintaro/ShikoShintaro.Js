const { ActivityType, Routes, REST } = require("discord.js");
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const shiko = require('../config/mongo')

const { Events } = require('discord.js');
const token = process.env.token
const clientId = process.env.guildId

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const guildId = '968375831787364352'; // Replace 'YOUR_GUILD_ID' with your actual guild ID

        const options = [
            {
                type: ActivityType.Watching,
                text: "No one",
                status: "online",
            },
            {
                type: ActivityType.Playing,
                text: "I dunno",
                status: "online",
            },
            {
                type: ActivityType.Listening,
                text: "You",
                status: "online",
            },
            {
                type: ActivityType.Competing,
                text: "on her Heart",
                status: "online",
            },
        ];

        setInterval(() => {
            const option = Math.floor(Math.random() * options.length);
            client.user.setPresence({
                activities: [
                    {
                        name: options[option].text,
                        type: options[option].type,
                    },
                ],
                status: options[option].status,
            });
        }, 10 * 1000);

        const commands = [];
        const commandFolders = fs.readdirSync(path.join(__dirname, '..', 'commands'));

        let loadedcommands = 0;

        for (const folder of commandFolders) {
            const folderPath = path.join(__dirname, '..', 'commands', folder);
            const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const filePath = path.join(folderPath, file);
                const command = require(filePath);

                // Assuming you have a 'data' property in each command file
                if (command.data) {
                    commands.push(command.data.toJSON());
                    loadedcommands++;
                }
            }
        }


        //for global release

        const rest = new REST({ version: '10' }).setToken(token);

        (async () => {
            try {
                console.log(`Started registering ${commands.length} global (/) commands.`);

                // Register the commands globally
                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    { body: commands },
                );

                console.log(`Successfully registered ${commands.length} global (/) commands.`);
            } catch (error) {
                console.error(error);
            }
        })

        //for testing commands

        // try {
        //     console.log(`Started registering ${loadedcommands} application (/) commands.`);
        //     // Register the commands for the specific guild
        //     client.guilds.cache.get(guildId)?.commands.set(commands);
        //     console.log(`Successfully ${commands.length} registered application (/) commands for the guild.`);
        // } catch (error) {
        //     console.error(error);
        // }

        await shiko().then(mongodb => {
            try {
                console.log('Im connected to the database master');
            } catch (err) {
                console.log(err)
            }
        })

        console.log(`"Ready Mastah", Logged in as ${client.user.tag}`);

    }
};