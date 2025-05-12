const { EmbedBuilder, SlashCommandBuilder, resolveColor} = require('discord.js')
const { exists, execute, queryone, queryall, db} = require('../../utils/db')
const config = require('../../config.json')
config.footer = config.footer || 'Made with luv ❤️';
config.footerUrl = config.footerUrl || 'https://cdn.discordapp.com/avatars/1086622488374550649/8901d89d61aad251caf017646932a7d3.webp?size=1024'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trade')
        .setDescription('Trade your money with someone!')
        .addUserOption(option => option
            .setName('user')
            .setDescription('Who to trade with')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('amount')
            .setDescription('how much to give')
            .setRequired(true)
        ),
    cooldown: 10,
    async execute (interaction) {
        const target = interaction.options.getUser('user') || interaction.user
        const input = interaction.options.getString('amount')
        if (isNaN(input)) {
            return await interaction.reply({
                content: 'Please enter a valid number.',
                ephemeral: true
            })
        }
        const amount = Math.round(Number(input))
        const userexists = await exists(db, interaction.user.id)
        const targetexists = await exists(db, target.id)
        const {balance: sbalance} = await queryone(db, "SELECT balance FROM users WHERE user_id=?", [interaction.user.id])
        const {balance: rbalance} = await queryone(db, "SELECT balance FROM users WHERE user_id=?", [target.id])
        if (!userexists) {
            return interaction.reply({
                content: `You are not isnt registered, Register using /register`,
                ephemeral:true
            })
        }
        if (interaction.user.id === target.id) {
            return interaction.reply({
                content: `You can't trade your self silly!`,
                ephemeral:true
            })
        }
        if (!targetexists) {
            return interaction.reply({
                content: `This user isnt registered, Tell them to register using /register`,
                ephemeral:true
            })
        }
        if (amount < 0) {
            return interaction.reply({
                content: `Are you trying to steal or something? Denied.`,
                ephemeral:true
            })
        }
        if (sbalance < amount) {
            return interaction.reply({
                content: `You do not have that much to give.`,
                ephemeral:true
            })
        }
        const snbalance = sbalance - amount
        const rnbalance = rbalance + amount
        await execute(db, "UPDATE users SET balance=? WHERE user_id=?", [snbalance, interaction.user.id]) // take money from sender
        await execute(db, "UPDATE users SET balance=? WHERE user_id=?", [rnbalance, target.id]) // give money to receiver
        await interaction.reply({
            content: `Gave ${amount}$ to <@${target.id}>`
        })
    }
}