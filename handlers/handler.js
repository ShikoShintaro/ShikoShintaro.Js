const fs = require('fs');
const path = require('path');
const ascii = require('ascii-table');
let table = new ascii('Commands         Events');
table.setHeading('Command', 'Load status', 'Events', 'Load status');

const { readdirSync } = require('fs');

module.exports = client => {
    // Load commands
    const foldersPath = path.join(__dirname, '..', 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);

            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                table.addRow(file, 'Success', '', ''); // Adding a row to the table
            } else {
                table.addRow(file, 'Failed', '', '');
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

    try {
        let eventCount = 0;
        readdirSync('./events')
            .filter((file) => file.endsWith('.js'))
            .forEach((event) => {
                try {
                    const eventPath = path.join(__dirname, '../events', event);
                    const eventModule = require(eventPath);

                    if ('name' in eventModule && 'execute' in eventModule) {
                        if (eventModule.once) {
                            client.once(eventModule.name, (...args) => eventModule.execute(...args, client));
                        } else {
                            client.on(eventModule.name, (...args) => eventModule.execute(...args, client));
                        }

                        eventCount++;
                        table.addRow('', '', eventModule.name, 'Success');
                    } else {
                        table.addRow('', '', event, 'Failed (Missing name or execute)');
                        console.log(`[WARNING] The event at ${eventPath} is missing a required "name" or "execute" property.`);
                    }
                } catch (error) {
                    table.addRow('', '', event, `Failed (${error.message})`);
                    console.log(`[ERROR] Error loading event ${event}: ${error.message}`);
                }
            });

        console.log(`${eventCount} event(s) loaded`);
    } catch (error) {
        console.error('Error loading events:', error);
    }

    console.log(table.toString());
};
