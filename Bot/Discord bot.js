const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env' });
const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, // 🔥 This is the key one
        GatewayIntentBits.GuildMessages,
]
});
const chalk = require("chalk");

client.commands = new Collection();
const folderpath = path.join(__dirname, 'Commands');
const CommandsFolder = fs.readdirSync(folderpath);

for (const folder of CommandsFolder) {
    const CommandsPath = path.join(folderpath, folder);
    const CommandFiles = fs.readdirSync(CommandsPath).filter(file => file.endsWith(`.js`));
    for (const file of CommandFiles) {
        const FilePath = path.join(CommandsPath, file);
        const command = require(FilePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(chalk.bgRedBright(`The command file at ${FilePath} doesn't have a required 'execute' or 'data' prop.`));
        }
    }
}

client.once(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            console.log(chalk.bgRedBright(`No interaction ${interaction.commandName} found`));
            return;
        }

        try {
            await command.execute(interaction);
        } catch (err) {
            console.log(chalk.bgRedBright(err));
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There has been an error while executing your command.',
                    flags: 64 // Correct flag for ephemeral messages
                });
            } else {
                await interaction.reply({
                    content: 'There has been an error while executing your command.',
                    flags: 64 // Correct flag for ephemeral messages
                });
            }
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
