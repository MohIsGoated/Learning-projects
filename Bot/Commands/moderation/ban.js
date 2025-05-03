const {SlashCommandBuilder, EmbedBuilder, resolveColor} = require('discord.js')
const {IsBanned} = require("../../utils/IsBanned");
const config = require('../../config.json')
config.footer = config.footer || 'Made with luv ❤️';
config.footerUrl = config.footerUrl || 'https://cdn.discordapp.com/avatars/1086622488374550649/8901d89d61aad251caf017646932a7d3.webp?size=1024'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a member from this guild')
        .addUserOption(option => option
                .setName('user')
                .setDescription('User to ban')
                .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason to ban this member')
        )
        .addNumberOption(option => option
            .setName('duration')
            .setDescription('Durating in hours for messages to delete')
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user')
        const member = interaction.options.getMember('user')
        const reason = interaction.options.getString('reason') ?? 'No reason given'
        const duration = interaction.options.getNumber('duration')*60*60 ?? 0
        const banned = await IsBanned(interaction, user.id)
        const embed = new EmbedBuilder()
            .setFooter({
                text: config.footer,
                iconURL: config.footerUrl
            })
            .setTimestamp(new Date())
        if (banned) {
            embed
                .setColor(resolveColor("Red"))
                .setTitle('ERROR')
                .setDescription(`<@${user.id}> is already banned`)
            return interaction.reply({embeds: [embed]})
        }
        if (member) {
            if (!interaction.member.permissions.has("BanMembers")) {
                embed
                    .setColor(resolveColor("Red"))
                    .setTitle('ERROR')
                    .setDescription('You do not have permissions to ban members')
                return interaction.reply({embeds: [embed]})
            }
            if (!interaction.guild.members.me.permissions.has('BanMembers')) {
                embed
                    .setColor(resolveColor("Red"))
                    .setTitle('ERROR')
                    .setDescription('I do not have permission to ban members')
                return interaction.reply({embeds: [embed]})
            }
            if (interaction.member.id === user.id) {
                embed
                    .setColor(resolveColor("Red"))
                    .setTitle('ERROR')
                    .setDescription('You cannot ban your self, silly!')
                return interaction.reply({embeds: [embed]})
            }
            if (!member.bannable) {
                embed
                    .setColor(resolveColor("Red"))
                    .setTitle('ERROR')
                    .setDescription('I do not have permissions to ban this member (possibly higher role?)')
                return interaction.reply({embeds: [embed]})
            }
            embed
                .setColor(resolveColor("Green"))
                .setDescription(`Banned user <@${user.id}> (${user.id})`)
            interaction.guild.members.ban(user.id, {deleteMessageSeconds: duration , reason: `${reason} - by <@${interaction.user.id}>`})
            await interaction.reply({embeds: [embed]})
        } else {
           embed
                .setColor(resolveColor("Green"))
                .setTitle('SUCCESS')
                .setDescription(`Banned user <@${user.id}> (${user.id})`)
            interaction.guild.members.ban(user.id, {deleteMessageSeconds: duration , reason: `${reason} - by <@${interaction.user.id}>`})
            await interaction.reply({embeds: [embed]})
        }
    }
}