const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { readdirSync } = require("fs");
const path = require('path');
const client = require('../../shiko-main');

const mainDir = path.resolve(__dirname, '..'); // Assuming your main file is in src/main
const commandsDir = path.join(mainDir);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help on commands')
        .addStringOption(option => option.setName('command')
            .setDescription('The command to get help on')
            .setRequired(false)),
    async execute(interaction) {
        const commandOption = interaction.options.getString('command');

        if (!commandOption) {
            // Display a list of available commands

            let categories = [];

            readdirSync(commandsDir).forEach((dir) => {
                const commandsDirPath = path.join(commandsDir, dir);

                const commands = readdirSync(commandsDirPath).filter((file) => file.endsWith('.js'));

                let cmds = commands.map((command) => {
                    let commandFile = require(path.join(commandsDirPath, command));

                    if (!commandFile.data) return "*Awww~~ This Command is on Progress.*";

                    let name = commandFile.data.name.replace(".js", " ");
                    let usage = commandFile.data.usage ? `\nUsage: \`${commandFile.data.usage}\`` : "";

                    return `\`${name}\`${usage}`;
                });

                let data = {
                    name: dir.toUpperCase(),
                    value: cmds.length === 0 ? "`In progress`." : cmds.join(" "),
                };

                categories.push(data);
            });

            const embed1 = new EmbedBuilder()
                .setAuthor({ name: "Haro you need help?? These are my commands", iconURL: "https://i.imgur.com/uxcvoiI.gif" })
                .addFields(categories)
                .setDescription(
                    `Use \`/help\` followed by a command name to get more additional information on a command. For example: \`/help ban\`.`
                )
                .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()
                .setColor("Random");

            await interaction.reply({ embeds: [embed1] });

        } else {
            const command = client.commands.get(commandOption.toLowerCase()) ||
                client.commands.find((c) => c.aliases && c.aliases.includes(commandOption.toLowerCase()));

            if (!command) {
                const embed2 = new EmbedBuilder()
                    .setTitle(`Invalid command! Use \`/help\` for all of my commands!`)
                    .setColor("FF0000");
                await interaction.reply({ embeds: [embed2] });
            } else {
                const embed3 = new EmbedBuilder()
                    .setAuthor({ name: "Command Details:", iconURL: "https://i.imgur.com/uxcvoiI.gif" })
                    .addFields({ name: "PREFIX:", value: `\`/\`` })
                    .addFields(
                        {
                            name: "COMMAND",
                            value: command.data.name
                                ? `\`${command.data.name}\``
                                : "No name for this command"
                        }
                    )
                    .addFields(
                        {
                            name: "DESCRIPTION",
                            value: command.data.description
                                ? command.data.description
                                : "No description for this command"
                        }
                    )
                    .setFooter({
                        text: `Requested by ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                    })
                    .setTimestamp()
                    .setColor("Random");

                await interaction.reply({ embeds: [embed3] });
            }
        }
    },
};
