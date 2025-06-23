const { EmbedBuilder, SlashCommandBuilder, resolveColor, MessageFlags} = require('discord.js')
const { execute, queryone, queryall, db, exists} = require('../../utils/db')
const config = require('../../config.json')
const { v4: uuidv4 } = require('uuid');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unlist")
        .setDescription("removes an account from your server and database")
        .addStringOption(option => option
            .setName("id")
            .setDescription("The ID of the account to unlist")
            .setRequired(true)
        ),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setFooter({ text: config.footer, iconURL: config.footerUrl })
        const id = interaction.options.getString("id")
        const account = await queryone(db, "SELECT * FROM accounts WHERE acc_id=?", [id])
        if (account) {
            if (account["server_id"] !== interaction.guild.id) {
                return await interaction.reply({
                    embeds: [embed.setColor(resolveColor("Red")).setTitle("ERROR").setDescription("No account with specified id exists in this server")]
                })
            }
            try {
                const lookup = await queryone(db, "SELECT * FROM accounts WHERE acc_id=?", [id])
                const channelid = lookup["channel_id"]
                const messageid = lookup["message_id"]
                const channel = interaction.client.channels.cache.get(channelid)
                if (!channel) {
                    embed.addFields({name: "Message deleted:", value: "❌ (channel doesn't exist)"})
                } else {
                    if (channel.permissionsFor(interaction.client.user).has('MANAGE_MESSAGES')) {
                        const msgdelete = await channel.messages.fetch(messageid)
                        if (msgdelete) {
                            try {
                                await msgdelete.delete()
                                embed.addFields({name: "Message deleted:", value: "✅"})
                            } catch (e) {
                                embed.addFields({name: "Message deleted:", value: "❌ (contact the bot author)"})
                            }
                        } else {
                            embed.addFields({name: "Message deleted:", value: "❌ (message doesn't exist)"})
                        }
                    } else {
                        embed.addFields({name: "Message deleted:", value: "❌ (Bot does not have permissions)"})
                    }
                }
                await execute(db, "DELETE FROM accounts WHERE acc_id=?", [id])
                return await interaction.reply({
                    embeds: [embed.setColor(resolveColor("Green")).setTitle("SUCCESS").setDescription(`Successfully deleted account with id \`\`\`${id}\`\`\``)]
                })
            } catch (e) {
                console.log(e)
                return await interaction.reply({
                    embeds: [embed.setColor(resolveColor("Red")).setTitle("ERROR").setDescription(`an error occured, please contact the bot author`)]
                })
            }
        } else {
            return await interaction.reply({
                embeds: [embed.setColor(resolveColor("Red")).setTitle("ERROR").setDescription(`No account with specified id exists in this server`)]
            })
        }
    }
}