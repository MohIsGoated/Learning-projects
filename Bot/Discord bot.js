const { Client, Events, GatewayIntentBits, Collection, MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env' });
const chalk = require("chalk");
const { ChangeStatus } = require('./utils/ChangeStatus')
const {init} = require("./utils/initializebot");
const {handleaichat} = require("./utils/handleaichat");
const {loadcommands} = require("./utils/loadcommands");
const {handlecommands} = require("./utils/handlecommands");
const {getAiIds} = require("./utils/setaiids");
const cooldowns = new Map();
const folderpath = path.join(__dirname, 'Commands');
const CommandsFolder = fs.readdirSync(folderpath);
const fpath = path.join(__dirname, "/config.json")
const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});
client.commands = new Collection();
let config = JSON.parse(fs.readFileSync(fpath))

loadcommands(client, CommandsFolder, folderpath)



client.on("messageCreate", async (message) => {
    if (getAiIds().includes(message.channel.id)) {
        await handleaichat(message, client);
    }
})

client.on(Events.InteractionCreate, async interaction => {
    // ignore this, I plan to use it to learn how buttons work at some point
    if (!interaction.isButton()) {
        return
    }
    if (interaction.customId === "delete") {

    }
    console.log("A button was just clicked!")
})

client.once(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.tag}`);
    if (config.status) {
        await ChangeStatus(client, config.status, config.appearance)
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        await handlecommands(client, interaction, config, cooldowns)
    }
});

     init(client, "./config.json")
        .then(() => {
            console.log("intialized successfully")
        }).catch(error => {
        return console.error(chalk.red(`[ERROR] A FATAL ERROR OCCURED, ${error.stack}`))
    })
