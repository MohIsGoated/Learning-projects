const {SlashCommandBuilder, EmbedBuilder, resolveColor} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a member from this guild')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to ban')
                .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user')
        const member = interaction.options.getMember('user')
        if (member) {
            if (!interaction.member.permissions.has("BanMembers")) {
                const embed = new EmbedBuilder()
                    .setColor(resolveColor("Red"))
                    .setTitle('ERROR')
                    .addFields([
                        {name: '', value: `You do not have permissions to ban members`}
                    ])
                return interaction.reply({embeds: [embed]})
            }
            if (!interaction.guild.members.me.permissions.has('BanMembers')) {
                const embed = new EmbedBuilder()
                    .setColor(resolveColor("Red"))
                    .setTitle('ERROR')
                    .addFields([
                        {name: '', value: `I do not have permission to ban members`}
                    ])
                return interaction.reply({embeds: [embed]})
            }
            if (interaction.member.id === user.id) {
                console.log('this should show if user ban him self')
                const embed = new EmbedBuilder()
                    .setColor(resolveColor("Red"))
                    .setTitle('ERROR')
                    .addFields([
                        {name: '', value: `You cannot ban your self, silly!`}
                    ])
                return interaction.reply({embeds: [embed]})
            }
            if (!member.bannable) {
                const embed = new EmbedBuilder()
                    .setColor(resolveColor("Red"))
                    .setTitle('ERROR')
                    .addFields([
                        {name: '', value: `I do not have permissions to ban this member (possibly higher role?)`}
                    ])
                return interaction.reply({embeds: [embed]})
            }
            const embed = new EmbedBuilder()
                .setColor(resolveColor("Green"))
                .addFields([
                    {name: '', value: `Banned user <@${user.id}> (${user.id})`}
                ])
            interaction.guild.members.ban(`${user.id}`)
            await interaction.reply({embeds: [embed]})
        } else {
            const embed = new EmbedBuilder()
                .setColor(resolveColor("Green"))
                .addFields([
                    {name: '', value: `Banned user <@${user.id}> (${user.id})`}
                ])
            interaction.guild.members.ban(`${user.id}`)
            await interaction.reply({embeds: [embed]})
        }
    }
}