const {SlashCommandBuilder, EmbedBuilder, resolveColor} = require('discord.js')
const { IsBanned } = require('../../utils/IsBanned.js')
const config = require('../../config.json')

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