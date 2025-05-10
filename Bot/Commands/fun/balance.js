const { EmbedBuilder, SlashCommandBuilder, resolveColor} = require('discord.js')
const { execute, queryone, queryall, db} = require('../../utils/db')
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
        console.log(target.id)
        const userData = await queryone(db, "SELECT balance FROM users WHERE user_id=?", [`${target.id}`])
        if (!userData) {
            return await interaction.reply({
                content: `This user is not registered, You may register using /register`,
                flags: 64
            })
        }
        await interaction.reply(`<@${target.id}>'s balance is ${Number(userData["balance"])}$`)
    }
}