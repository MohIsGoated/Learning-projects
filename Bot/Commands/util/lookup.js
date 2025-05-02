const { SlashCommandBuilder, EmbedBuilder, resolveColor, MessageFlags} = require('discord.js');
const config = require('../../config.json')
/*
what I learned from this:
most things that I use to get a date, say when a user joined a server and such, are dates by default
and contrary to my beliefs, these dats do not count as strings, and I need to convert them into strings
a solution is to either use .getTime(), or do the simpler thing that I somehow missed
which is using createdTimestamp, JoinedTimestamp and such (also since im using <t:UNIX>
I need to divide by 1000 then math floor it (divide to get seconds, floor to get rid of .001 etc.)
*/
/*
I also learned how to use ?, ??, and ||, it also taught me how to watch out for specific cases
in this case, when the looked up is a bot, only adding things when the user is in the server
*/
config.footer = config.footer || 'Made with luv ❤️';
config.footerUrl = config.footerUrl || 'https://cdn.discordapp.com/avatars/1086622488374550649/8901d89d61aad251caf017646932a7d3.webp?size=1024'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lookup')
        .setDescription('Get info about a user ')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('user to lookup')
        ),
    async execute(interaction){
        const user = interaction.options.getUser('user')  ?? interaction.user
        const member = interaction.options.getMember('user') ?? interaction.member
        const UserAvatar = user.avatarURL({ size: 128 }) ?? user.defaultAvatarURL
        const embed = new EmbedBuilder()
            .setColor(resolveColor("Blue"))
            .setFooter({
                text: config.footer,
                iconURL: config.footerUrl
            })
            .setTimestamp(new Date())
            .setThumbnail(UserAvatar)
            .setTitle(user.username)
            .addFields([
                { name: 'Global Nickname', value: user.globalName || `${user.username}#${user.discriminator}`},
                { name: 'ID', value: user.id},
                { name: 'Created At', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:f>`},
                { name: 'Is Human?', value: user.bot ? "❌" : "✅"}
            ])
 if (member) {
     const roles = member.roles.cache
         .filter((roles) => roles.id !== member.guild.id)
     .map((role) => role.toString())
         .join(', ')
         .replace(/,/g, '')
     const JoinTime =`<t:${Math.floor(member.joinedTimestamp / 1000)}>`
    embed.addFields([
        { name: 'Joined At', value: JoinTime},
        { name: 'Roles', value: roles}
    ])
 }
        await interaction.reply({ embeds: [embed] })
    }
}