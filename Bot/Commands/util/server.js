const { SlashCommandBuilder, AttachmentBuilder, Client, GatewayIntentBits} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName(`server`)
        .setDescription(`view information about this server`),
    async execute(interaction) {
        const guild = interaction.guild;
        const roles = interaction.guild.cache
            .flatMap((guild) => guild.roles.cache)
            .map((role) => role.name);
        const iconURL = guild.iconURL({ extension: 'png', size: 256 });
        const img = new AttachmentBuilder(iconURL);
        console.log(roles)
        await interaction.reply({
            content: `the server id is ${interaction.guildId}, it has ${roles}`,
            files: [img]
        })
    }
}