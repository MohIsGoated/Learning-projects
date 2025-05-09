const { EmbedBuilder, SlashCommandBuilder, resolveColor} = require('discord.js')
const { execute, queryone, queryall, db} = require('../../utils/db')
const config = require('../../config.json')
config.footer = config.footer || 'Made with luv ❤️';
config.footerUrl = config.footerUrl || 'https://cdn.discordapp.com/avatars/1086622488374550649/8901d89d61aad251caf017646932a7d3.webp?size=1024'
module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamble')
        .setDescription('Take a chance with the devil!')
        .addStringOption(option => option
            .setName('amount')
            .setDescription('How much can you afford to loose?')
            .setRequired(true)
        ),
    async execute(interaction) {
        const input = interaction.options.getString('amount')
        if (isNaN(input)) {
            return await interaction.reply({
                content: 'Please enter a valid number.',
                ephemeral: true
            })
        }
        const amount = Number(input)
        if (amount < 0) {
            return await interaction.reply(`The devil doesn't deal with such amounts.. Not in this world at least.`)
        }
        const userData = await queryone(db, "SELECT * FROM users WHERE user_id=?", [`${interaction.user.id}`])
        const balance = Number(userData["balance"])
        console.log(balance)
        console.log()
        if (balance < amount) {
            return await interaction.reply(`You can not offer what you cannot afford.`)
        }
        const LuckyNumber = Math.floor(Math.random() * 3 + 1)
        console.log(LuckyNumber)
        await execute(db, "UPDATE users SET balance=? WHERE user_id=?", [balance-amount, interaction.user.id])
        if (LuckyNumber === 1) {
            const win = Number(amount * 2)
            const Nbalance = Number(balance + win)
            await execute(db, "UPDATE users SET balance=? WHERE user_id=?", [Nbalance, interaction.user.id])
            return await interaction.reply(`You won ${win}$! Your new balance is ${Nbalance}$.`)
        } else {
            const Nbalance = Number(balance - amount)
            await interaction.reply(`You've sadly lost.. Your new balance is ${Nbalance}`)
        }
    }
}