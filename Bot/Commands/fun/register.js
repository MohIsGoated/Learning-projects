const { EmbedBuilder, SlashCommandBuilder, resolveColor} = require('discord.js')
const { exists, execute, queryone, queryall, db} = require('../../utils/db')
const config = require('../../config.json')
config.footer = config.footer || 'Made with luv ❤️';
config.footerUrl = config.footerUrl || 'https://cdn.discordapp.com/avatars/1086622488374550649/8901d89d61aad251caf017646932a7d3.webp?size=1024'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Regiser and become a member of the economy!'),
    async execute(interaction) {
        const exist = await exists(db, interaction.user.id)
        if (!exist) {
            await queryone(db, "INSERT INTO users(user_id, balance) VALUES(?, ?)", [interaction.user.id, 3000])
            return await interaction.reply({
                content: `You have successfully registered`,
                flags: 64
            })
        }
        await interaction.reply({
            content: `You are already registered, silly!`,
            flags: 64
    })
    }
}