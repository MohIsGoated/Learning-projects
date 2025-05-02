const {SlashCommandBuilder, EmbedBuilder, resolveColor} = require('discord.js')
// note to self: to import functions put them inside {}
const { IsBanned } = require('../../utils/IsBanned.js')
const config = require('../../config.json')
config.footer = config.footer || 'Made with luv ❤️';
config.footerUrl = config.footerUrl || 'https://cdn.discordapp.com/avatars/1086622488374550649/8901d89d61aad251caf017646932a7d3.webp?size=1024'
module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a banned member from the server')
        .addUserOption(option => option
            .setName('user')
            .setDescription('User to unban')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for unban.')
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')
        const banned = await IsBanned(interaction, user.id)
        const embed = new EmbedBuilder()
            .setFooter({
                text: config.footer,
                iconURL: config.footerUrl
            })
            .setTimestamp(new Date())
        if (!banned) {
            embed
                .setTitle('ERROR')
                .setDescription(`<${user.id}> is not banned.`)
                .setColor(resolveColor("Red"))
            return await interaction.reply({embeds: [embed]})
        } else {
            await interaction.guild.members.unban(user.id, { reason: `Reason: ${reason}, by <@${interaction.user.id}>`})
            embed
                .setTitle('SUCCESS')
                .addFields([
                    { name: '', value: `<@${user.id}> successfully unbanned!`}
                ])
                .setColor(resolveColor("Green"))
            await interaction.reply({embeds: [embed]})
        }
    }
}