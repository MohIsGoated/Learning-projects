const { EmbedBuilder, SlashCommandBuilder, resolveColor} = require('discord.js')
const { execute, queryone, queryall, db} = require('../../utils/db')
const config = require('../../config.json')
config.footer = config.footer || 'Made with luv ❤️';
config.footerUrl = config.footerUrl || 'https://cdn.discordapp.com/avatars/1086622488374550649/8901d89d61aad251caf017646932a7d3.webp?size=1024'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamble')
        .setDescription('Take a chance with the devil!')
        .addNumberOption(option => option
            .setName('amount')
            .setDescription('How much can you afford to loose?')
            .setRequired(true)
        ),
    async execute(interaction) {
        const amount = interaction.options.getNumber('amount')
        if (amount < 0) {
            return await interaction.reply(`The devil doesn't deal with such amounts.. Not in this world at least.`)
        }
        const userData = await queryone(db, "SELECT * FROM users WHERE user_id=?", [`${interaction.user.id}`])
        if (userData["balance"] < amount) {
            return await interaction.reply(`Do not offer what you cannot afford.`)
        }
        await interaction.reply(`gamble here!`)
    }
}