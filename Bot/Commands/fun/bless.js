const { EmbedBuilder, SlashCommandBuilder, resolveColor} = require('discord.js')
const { execute, queryone, queryall, db} = require('../../utils/db')
const config = require('../../config.json')
config.footer = config.footer || 'Made with luv ❤️';
config.footerUrl = config.footerUrl || 'https://cdn.discordapp.com/avatars/1086622488374550649/8901d89d61aad251caf017646932a7d3.webp?size=1024'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bless')
        .setDescription('Bless some people!')
        .addNumberOption(option => option
            .setName('amount')
            .setDescription('How much to bless the user with')
            .setRequired(true)
        )
        .addUserOption(option => option
            .setName('user')
            .setDescription('Who to bless')
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user') ?? interaction.user
        const amount = interaction.options.getNumber('amount')
        if (amount < 0) {
            return await interaction.reply(`You cannot bless people with a negative amount... That's not how it works`)
        }
        const userData = await queryone(db, "SELECT * FROM users WHERE user_id=?", [`${user.id}`])
        if (!userData) {
            return await interaction.reply(`Not registered, use /register to register`)
        }
        await execute(db, "UPDATE users SET balance = balance + ? WHERE user_id= ?", [amount, user.id])
        await interaction.reply(`Gave ${amount} to <@${user.id}>`)
    }
}