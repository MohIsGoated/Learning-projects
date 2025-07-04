const { EmbedBuilder, SlashCommandBuilder, resolveColor, MessageFlags} = require('discord.js')
const config = require('../../config.json')
const {getPrice} = require("../../utils/getprice");
const {re} = require("mathjs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('price')
        .setDescription("Get the price of a crypto coin in usd")
        .addStringOption(option => option
            .setName("coin")
            .setDescription("which coin to look up (defaults to ltc if not provided)")
        ),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setFooter({ text: config.footer, iconURL: config.footerUrl})
            .setTimestamp()
        const input = await interaction.options.getString('coin') ?? "litecoin"
        let coin = input
        if (input === "ltc") coin = "litecoin"
        if (input === "eth") coin = "ethereum"
        if (input === "btc") coin = "bitcoin"
        if (input === "usdt") coin = "tether"
        if (input === "usdc") coin = "usd-coin"
    const result = await getPrice(coin)
        if (result.response?.statusText === "Not Found") {
            console.log("Not Found")
        return await interaction.reply({
            embeds: [embed.setColor("Red").setDescription("Invalid coin id, please try inputting the full name of the coin").setTitle("Error")]
        })
        }
        if (result.response?.status === 404) {
            console.log("404")
            return await interaction.reply({
                embeds: [embed.setColor("Red").setDescription("An unhandled error occured, please contact the both author.").setTitle("Error")]
            })
        }
        await interaction.reply({
            embeds: [embed.setColor("Blue").setDescription(result.data.market_data.current_price.usd+"$").setTitle(`The current price of 1 ${coin} is:`)]
        })
    }
}
