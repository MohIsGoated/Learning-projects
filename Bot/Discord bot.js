const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env' });
const config = require('./config.json')
const { initDb } = require('./utils/db')
const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
]
});
const chalk = require("chalk");
const { ChangeStatus } = require('./utils/ChangeStatus')
const cooldowns = new Map();
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

client.once(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.tag}`);
    if (config.status) {
        await ChangeStatus(client, config.status)
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) {
            console.log(chalk.bgRedBright(`No interaction ${interaction.commandName} found`));
            return;
        }
        const now = Date.now();
        const userId = interaction.user.id;
        const cooldownAmount = (command.cooldown || 0) * 1000
        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Map());
        }
        const timestamps = cooldowns.get(command.data.name);
        if (timestamps.has(userId)) {
            const expire = timestamps.get(userId);
            const timeleft = expire - now
            if (timeleft > 0) {
                return await interaction.reply({
                    content: `⏳ You're on cooldown, Try again in **${Math.ceil(timeleft / 1000)}s**.`,
                    ephemeral: true
                });
            }
        }
        timestamps.set(userId, now + cooldownAmount)
        setTimeout(() => {timestamps.delete(userId)}, cooldownAmount)
        if (command.ownerOnly && interaction.user.id !== config?.ownerID) {
            return await interaction.reply({
                content: `Only the owner of the bot may use this command!`,
                ephemeral: true
            });
        }
        try {
            await command.execute(interaction);
        } catch (err) {
            console.log(chalk.bgRedBright(err.stack));
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There has been an error while executing your command.',
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: 'There has been an error while executing your command.',
                    ephemeral: true
                });
            }
        }
    }
});
initDb()
if (!config.ownerID) {
    console.warn(chalk.bgYellow.black('[WARN] config.ownerID is not defined! Owner-only commands will block all users.'));
}
client.login(process.env.DISCORD_TOKEN)
