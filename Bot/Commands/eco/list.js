const { EmbedBuilder, SlashCommandBuilder, resolveColor, MessageFlags} = require('discord.js')
const { execute, queryone, queryall, db, exists} = require('../../utils/db')
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("list")
        .setDescription("List an account in the server")
        .addStringOption(option => option
            .setName("name")
            .setDescription("The account name")
            .setRequired(true)
        )
        .addNumberOption(option => option
            .setName("price")
            .setDescription("The price to list the account for")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("note")
            .setDescription("Extra information for the account")
            .setRequired(false)
        ),
    async execute(interaction) {
        const name = interaction.options.getString("name")
        const price = interaction.options.getNumber("price")
        const note = interaction.options.getString("name") ?? "N/A"
        try {
            const result = await queryone(db, "SELECT MAX(acc_id) FROM accounts AS maxid WHERE server_id=?", [interaction.guild.id]) ?? 0
            const currentid = result.maxid
            await execute(db, "INSERT INTO accounts(acc_id, acc_name, acc_details, acc_price, server_id) VALUES(?, ?, ?, ?, ?)", [currentid + 1, name, note, price, interaction.guild.id])
            interaction.reply("added ur acc to the db")
        } catch (e) {
            console.log(e)
        interaction.reply("an unhandled error occured, please report this to the bot author")
        }
    }
}