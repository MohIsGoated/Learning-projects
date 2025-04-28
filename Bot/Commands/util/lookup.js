const { SlashCommandBuilder, EmbedBuilder, resolveColor, MessageFlags} = require('discord.js');
/* what I learned from this:
most things that I use to get a date, say when a user joined a server and such, are dates by default
and contrary to my beliefs, these dats do not count as strings, and I need to convert them into strings
a solution is to either use .getTime(), or do the simpler thing that I somehow missed
which is using createdTimestamp, JoinedTimestamp and such (also since im using <t:UNIX>
I need to divide by 1000 then math floor it (divide to get seconds, floor to get rid of .001 etc.)
*/
module.exports = {
   data: new SlashCommandBuilder()
       .setName(`lookup`)
       .setDescription(`returns information about the user`)
       .addUserOption(option =>
           option.setName('user')
               .setDescription('pick someone')
               .setRequired(true)
       ),
    async execute(interaction) {
        const imgURL = interaction.user.avatarURL({ extension: 'png', size: 256})
        const user = interaction.options.getMember('user');
        const member = await interaction.guild.members.fetch(interaction.user.id);
        const joinedTimestamp = member.joinedTimestamp
        const discordTimestamp = `<t:${Math.floor(joinedTimestamp / 1000)}:F>`;
        const accountCreated = `<t:${Math.floor(interaction.user.createdTimestamp / 1000)}>`;
        const roles = interaction.member.roles.cache
            .filter(role => role.name !== "@everyone")
            .map(role => role.toString())
            .join(", ") || "No roles found.";
        const sigma = user.user.avatarURL({ extension: 'png', size: 512 })
        console.log(sigma)
        const embed = new EmbedBuilder()
            .setTitle('User Lookup!')
            .addFields([
                { name: `**Username: ${interaction.user.username}**`, value: `>> ID: ${interaction.user.id}`},
                { name: '**Joined At:**', value: discordTimestamp},
                { name: '**Created At:**', value: accountCreated},
                { name: '**Roles:**', value: roles},
                { name: '**test:**', value: 'hi'},
                { name: '**ID:**', value: user.id}
            ])
            .setThumbnail(imgURL)
            .setColor(resolveColor("Blurple"))
       await interaction.reply({embeds: [embed]})
    }
}