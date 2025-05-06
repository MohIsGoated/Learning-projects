const { EmbedBuilder, SlashCommandBuilder, resolveColor} = require('discord.js')
const { execute, queryone, queryall, db} = require('../../utils/db')
const config = require('../../config.json')
config.footer = config.footer || 'Made with luv ❤️';
config.footerUrl = config.footerUrl || 'https://cdn.discordapp.com/avatars/1086622488374550649/8901d89d61aad251caf017646932a7d3.webp?size=1024'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Get your balance'),
    async execute(interaction) {
        const userData = await queryone(db, "SELECT balance FROM users WHERE user_id=?", [`${interaction.user.id}`])
        if (!userData) {
            return await interaction.reply(`You are not registered, use /register to register`)
        }
        await interaction.reply(`ur balance is ${userData["balance"]}`)
    }
}