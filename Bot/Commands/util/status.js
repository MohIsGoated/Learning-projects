const { ActivityType, EmbedBuilder, SlashCommandBuilder, resolveColor} = require('discord.js')
const { execute, queryone, queryall, db, exists} = require('../../utils/db')
const config = require('../../config.json')
const {ChangeStatus} = require("../../utils/ChangeStatus");
config.footer = config.footer || 'Made with luv ❤️';
config.footerUrl = config.footerUrl || 'https://cdn.discordapp.com/avatars/1086622488374550649/8901d89d61aad251caf017646932a7d3.webp?size=1024'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription(`Set the bot's status`)
        .addStringOption(option => option
            .setName('text')
            .setDescription(`what to set it to`)
            .setMaxLength(128)
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('state')
            .setDescription('The online state of the bot')
            .addChoices(
                {name: 'Online', value: 'online'},
                {name: 'Do Not Disturb', value: 'dnd'},
                {name: 'Idle', value: 'idle'},
                {name: 'Invisible', value: 'invisible'}
            )
        ),
    ownerOnly: true,
    async execute(interaction) {
        const input = interaction.options.getString('text')
        const state = interaction.options.getString('state')
        await ChangeStatus(interaction.client, input, state)
    }
}