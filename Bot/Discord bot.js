const { Client, Events, GatewayIntentBits, Collection, MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env' });
const { initDb, getaichannels} = require('./utils/db')
const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
]
});
const chalk = require("chalk");
const { ChangeStatus } = require('./utils/ChangeStatus')
const { fixConfig } = require("./utils/fixconfig");
const {getresponse} = require("./utils/getresponse");
const cooldowns = new Map();
client.commands = new Collection();
const folderpath = path.join(__dirname, 'Commands');
const CommandsFolder = fs.readdirSync(folderpath);
const fpath = path.join(__dirname, "/config.json")
let config = JSON.parse(fs.readFileSync(fpath))
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
        await ChangeStatus(client, config.status, config.appearance)
    }
});

let ai_ids

client.on("messageCreate", async (message) => {
    if (ai_ids.includes(message.channel.id)) {
    if (message.member.user.bot) {
        return
    }
        if (message.mentions.has(client.user)) {
            await message.channel.sendTyping();
            const historydata = await message.channel.messages.fetch({
                limit: 25,
                before: message.id
            })
            const historyarray = historydata.map(item => ({
                author: item.author.username,
                content: item.content
            }))

            const history = JSON.stringify(historyarray);
            let reference
            if (message.reference) {
                reference = await message.channel.messages.fetch(message.reference.messageId)
            }
            let response = await getresponse(message.content, history, client.user.username, message.member, reference)
            response.text.replace(/<@[^>]+>/g, 'REDACTED');
            response.text.replace("@everyone", 'REDACTED')
            response.text.replace("@here", 'REDACTED')
            console.log(response.text)
            if (response.text.length > 2000) {
                const filePath = path.join(__dirname, 'message.txt');
                fs.writeFileSync(filePath, response.text, 'utf8');

                await message.reply({
                    files: [filePath]
                })
                fs.unlinkSync(filePath);
            } else {
                await message.reply(response.text)
            }
        }
    }
})

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) {
        return
    }
    if (interaction.customId === "delete") {

    }
    console.log("A button was just clicked!")
})
client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) {
            console.log(chalk.bgRedBright(`No interaction ${interaction.commandName} found`));
            return;
        }
        console.log(interaction.commandName)
        if (interaction.commandName === "setaichannel") {
                const channels = await getaichannels();
                ai_ids = channels.map(item => item.ai_channel_id);
        }
        if (interaction.user.id !== config?.ownerID) {
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
                        flags: MessageFlags.Ephemeral
                    });
                }
            }
            timestamps.set(userId, now + cooldownAmount)
            setTimeout(() => {
                timestamps.delete(userId)
            }, cooldownAmount)
        }
        if (command.ownerOnly && interaction.user.id !== config?.ownerID) {
            return await interaction.reply({
                content: `Only the owner of the bot may use this command!`,
                flags: MessageFlags.Ephemeral
            });
        }
        try {
            await command.execute(interaction);
        } catch (err) {
            console.log(chalk.bgRedBright(err.stack));
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There has been an error while executing your command.',
                    flags: MessageFlags.Ephemeral
                });
            } else {
                await interaction.reply({
                    content: 'There has been an error while executing your command.',
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
});

async function init() {
    const channels = await getaichannels()
    ai_ids = channels.map(item => item.ai_channel_id)
    fixConfig();
    initDb();
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, "/config.json")));
    if (!config.ownerID) {
        console.warn(chalk.bgYellow.black('[WARN] config.ownerID is not defined! Owner-only commands will block all users.'));
    }
    await client.login(process.env.DISCORD_TOKEN)
}
init()
.then(() => {
    console.log("intialized successfully")
}).catch(error => {
    return console.log(chalk.red(`[ERROR] A FATAL ERROR OCCURED, ${error.stack}`))
})