const { SlashCommandBuilder, EmbedBuilder, resolveColor} = require('discord.js');
const config = require('../../config.json')
config.footer = config.footer || 'Made with luv ❤️';
config.footerUrl = config.footerUrl || 'https://cdn.discordapp.com/avatars/1086622488374550649/8901d89d61aad251caf017646932a7d3.webp?size=1024'

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`ping`)
        .setDescription(`replies with the bot's latency`),
    async execute(interaction) {
        const ping = Date.now() - interaction.createdTimestamp
        const embed = new EmbedBuilder()
            .setColor(resolveColor("Blue"))
            .setTitle('Ping')
            .setDescription(`The bot's latency is ${ping} ms`)
            .setFooter({
                text: config.footer,
                iconURL: config.footerUrl
            })
        await interaction.reply({embeds: [embed]})
    }
};