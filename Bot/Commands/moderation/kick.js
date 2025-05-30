const { EmbedBuilder, SlashCommandBuilder, resolveColor} = require('discord.js')
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a member from this guild')
        .addUserOption(option => option
            .setName('user')
            .setDescription('User to kick')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason to kick this user')
        ),
    async execute(interaction) {
        const member = interaction.options.getMember('user')
        const reason = interaction.options.getString('reason') ?? 'No reason provided'
        const embed = new EmbedBuilder()
            .setFooter({
                text: config.footer,
                iconURL: config.footerUrl
            })
            .setTimestamp(new Date())
        if (!interaction.member.permissions.has('KickMembers')) {
            embed.setColor(resolveColor('Red'))
                .setTitle('ERROR')
                .setDescription('You do not have permissions to kick members')
            return await interaction.reply({embeds: [embed]})
        }
        if (!interaction.guild.members.me.permissions.has('KickMembers')) {
            embed.setColor(resolveColor('Red'))
                .setTitle('ERROR')
                .setDescription('I do not have permissions to kick members')
            return await interaction.reply({embeds: [embed]})
        }
        if (member) {
            if (interaction.user.id === member.id) {
                embed.setColor(resolveColor('Red'))
                    .setTitle('ERROR')
                    .setDescription('You cannot kick your self, silly!')
                return await interaction.reply({embeds: [embed]})
            }
            if (interaction.guild.members.me.id === member.id) {
                embed.setColor(resolveColor('Red'))
                    .setTitle('ERROR')
                    .setDescription('I refuse to kick my self, Deal with it.')
                return await interaction.reply({embeds: [embed]})
            }
            if (!member.kickable) {
                embed.setColor(resolveColor('Red'))
                    .setTitle('ERROR')
                    .setDescription('I do not have permissions to kick this member (Possibly higher role?)')
                return await interaction.reply({embeds: [embed]})
            } else {
                interaction.guild.members.kick(member.id, `${reason} - By ${interaction.member.id}`)
                embed.setColor(resolveColor('Green'))
                    .setTitle('SUCCESS')
                    .setDescription(`Successfully kicked member <@${member.id}>`)
                return await interaction.reply({embeds: [embed]})
            }
        } else {
            embed.setColor(resolveColor('Red'))
                .setTitle('ERROR')
                .setDescription('This user is not in the guild')
            return await interaction.reply({embeds: [embed]})
        }
    }
}