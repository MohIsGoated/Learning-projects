const { EmbedBuilder, SlashCommandBuilder, resolveColor, MessageFlags} = require('discord.js')
const { execute, queryone, queryall, db, exists} = require('../../utils/db')
const config = require('../../config.json')
config.footer = config.footer || 'Made with luv ❤️';
config.footerUrl = config.footerUrl || 'https://cdn.discordapp.com/avatars/1086622488374550649/8901d89d61aad251caf017646932a7d3.webp?size=1024'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription(`Get your or someone else's balance`)
        .addUserOption(option => option
            .setName('user')
            .setDescription(`Who's balance to check`)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('user') ?? interaction.user
        const exist = await exists(db, target.id)
        if (!exist) {
            return await interaction.reply({
                content: `Not registered, register with /register.`,
                flags: MessageFlags.Ephemeral
            })
        }
        const userData = await queryone(db, "SELECT balance FROM users WHERE user_id=?", [`${target.id}`])
        await interaction.reply(`<@${target.id}>'s balance is ${Number(userData["balance"])}$`)
    }
}