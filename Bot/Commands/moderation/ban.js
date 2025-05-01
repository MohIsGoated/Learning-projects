const {SlashCommandBuilder, EmbedBuilder, resolveColor} = require('discord.js')
const {IsBanned} = require("../../utils/IsBanned");

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
        if (banned) {
            const embed = new EmbedBuilder()
                .setColor(resolveColor("Red"))
                .setTitle('ERROR')
                .setDescription(`<@${user.id}> is already banned`)
            return interaction.reply({embeds: [embed]})
        }
        if (member) {
            if (!interaction.member.permissions.has("BanMembers")) {
                const embed = new EmbedBuilder()
                    .setColor(resolveColor("Red"))
                    .setTitle('ERROR')
                    .setDescription('You do not have permissions to ban members')
                return interaction.reply({embeds: [embed]})
            }
            if (!interaction.guild.members.me.permissions.has('BanMembers')) {
                const embed = new EmbedBuilder()
                    .setColor(resolveColor("Red"))
                    .setTitle('ERROR')
                    .setDescription('I do not have permission to ban members')
                return interaction.reply({embeds: [embed]})
            }
            if (interaction.member.id === user.id) {
                const embed = new EmbedBuilder()
                    .setColor(resolveColor("Red"))
                    .setTitle('ERROR')
                    .setDescription('You cannot ban your self, silly!')
                return interaction.reply({embeds: [embed]})
            }
            if (!member.bannable) {
                const embed = new EmbedBuilder()
                    .setColor(resolveColor("Red"))
                    .setTitle('ERROR')
                    .setDescription('I do not have permissions to ban this member (possibly higher role?)')
                return interaction.reply({embeds: [embed]})
            }
            const embed = new EmbedBuilder()
                .setColor(resolveColor("Green"))
                .setDescription(`Banned user <@${user.id}> (${user.id})`)
            interaction.guild.members.ban(user.id, {deleteMessageSeconds: duration , reason: `reason: ${reason}, by <@${interaction.user.id}>`})
            await interaction.reply({embeds: [embed]})
        } else {
            const embed = new EmbedBuilder()
                .setColor(resolveColor("Green"))
                .setTitle('SUCCESS')
                .setDescription(`Banned user <@${user.id}> (${user.id})`)
            interaction.guild.members.ban(user.id, {deleteMessageSeconds: duration , reason: `reason: ${reason}, by <@${interaction.user.id}>`})
            await interaction.reply({embeds: [embed]})
        }
    }
}