const { EmbedBuilder, SlashCommandBuilder, resolveColor, MessageFlags} = require('discord.js')
const { execute, queryone, queryall, db, exists} = require('../../utils/db')
const config = require('../../config.json')
const { v4: uuidv4 } = require('uuid');

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
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("the channel to send the account embed to")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("note")
            .setDescription("Extra information for the account")
            .setRequired(false)
        ),
    async execute(interaction) {
        let messageId
        const name = interaction.options.getString("name")
        const price = interaction.options.getNumber("price")
        const channel = interaction.options.getChannel("channel")
        const note = interaction.options.getString("note") ?? "N/A"
        const embed = new EmbedBuilder()
            .setTitle(`Account: ${name}`)
            .addFields(
                { name: "BIN price:", value: `${price}$` },
                {name: "Additional info:", value: note}
            )


        try {
            const listid = uuidv4();
            await channel.send({
                embeds: [embed.setColor(resolveColor("Blue")).setFooter({ text: `${config.footer} | ID: ${listid}`, iconURL: config.footerUrl})]
            }).then(message => {
                messageId = message.id
            })
            await execute(db, "INSERT INTO accounts(acc_id, acc_name, acc_details, acc_price, server_id, message_id, channel_id) VALUES(?, ?, ?, ?, ?, ?, ?)", [listid, name, note, price, interaction.guild.id, messageId, channel.id])
            interaction.reply({
                embeds: [new EmbedBuilder().setColor(resolveColor("Green")).setTitle("SUCCESS").setDescription("successfully added your account to the database").setFooter({ text: config.footer, iconURL: config.footerUrl})]
            })
        } catch (e) {
            console.log(e)
        interaction.reply("an unhandled error occured, please report this to the bot author")
        }
    }
}