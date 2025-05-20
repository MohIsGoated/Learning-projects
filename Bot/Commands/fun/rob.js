const { EmbedBuilder, SlashCommandBuilder, resolveColor, MessageFlags} = require('discord.js')
const { exists, execute, queryone, queryall, db} = require('../../utils/db')
const config = require('../../config.json')
config.footer = config.footer || 'Made with luv ❤️';
config.footerUrl = config.footerUrl || 'https://cdn.discordapp.com/avatars/1086622488374550649/8901d89d61aad251caf017646932a7d3.webp?size=1024'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rob')
        .setDescription(`Take a shot at someone's wealth!`)
        .addUserOption(option => option
            .setName('user')
            .setDescription('Who to steal from?')
            .setRequired(true)
        ),
    cooldown: 10,
    async execute (interaction) {
        const target = interaction.options.getUser('user')
        const targetexists = await exists(db, target.id)
        const userexists = await exists(db, interaction.user.id)
        const brokeMessages = [
            `<@${target.id}> is too broke, you'd owe him money.`,
            `You'd make more robbing your own pockets than <@${target.id}>.`,
            `Robbing <@${target.id}>? Might as well rob a rock.`,
            `You took two looks at <@${target.id}> and realised you'd go into debt robbing him..`
        ]
        const embed = new EmbedBuilder()
            .setFooter({ text: config.footer, iconURL: config.footerUrl })
            .setTimestamp();
        if (!userexists) {
            return interaction.reply({
                embeds: [embed.setColor(resolveColor("Red")).setDescription(`❌ You are not registered. Use **/register** to get started.`)],
                flags: MessageFlags.Ephemeral
            })
        }
        if (interaction.user.id === target.id) {
            return interaction.reply({
                embeds: [embed.setColor(resolveColor("Aqua")).setDescription(`🙂‍↔️ You can't rob yourself, silly!`)],
                flags: MessageFlags.Ephemeral
            })
        }
        if (!targetexists) {
            return interaction.reply({
                embeds: [embed.setColor(resolveColor("Red")).setDescription(`❌ This user doesn't exist, tell them to register using /register!`)],
                flags: MessageFlags.Ephemeral
            })
        }
        const {balance: vbalance} = await queryone(db, "SELECT balance FROM users WHERE user_id=?", [target.id])
        const {balance: rbalance} = await queryone(db, "SELECT balance FROM users WHERE user_id=?", [interaction.user.id])
        if (vbalance < 500 ) {
            return interaction.reply({
                embeds: [embed.setColor(resolveColor("Red")).setDescription(brokeMessages[Math.floor(Math.random() * brokeMessages.length)])],
            })
        }
        if (rbalance < 300) {
            return interaction.reply({
                embeds: [embed.setColor(resolveColor("Red")).setDescription(`You tried to take a taxi to rob <@${target.id}>, but realised you couldn't even afford a taxi...`)]
            })
        }
        if (rbalance < 0.1 * vbalance) {
            return interaction.reply({
                embeds: [embed.setColor(resolveColor("Red")).setDescription(`<@${target.id}>'s security probably costs more than your entire networth.`)]
            })
        }
        const odd = Math.random()
        if (odd > 0.3) {
            const earnings = Math.round((0.1 + Math.random() * 0.2) * vbalance)
            const nvbalance = vbalance - earnings
            const nrbalance = rbalance + earnings
            await execute(db, "UPDATE users SET balance=? WHERE user_id=?", [nvbalance, target.id])
            await execute(db, "UPDATE users SET balance=? WHERE user_id=?", [nrbalance, interaction.user.id])
            await interaction.reply({
                embeds: [embed.setColor(resolveColor("Green")).setDescription(`You stole ${earnings} successfully from <@${target.id}>`)]
            })
        } else {
            if (odd > 0.2) {
                await interaction.reply({
                    embeds: [embed.setColor(resolveColor("Yellow")).setDescription(`You were caught, but you managed to hit the dash and get away uncaught.`)]
                })
            } else {
                const loss = Math.round((0.2 + Math.random() * 0.2) * rbalance)
                const nvbalance = Math.round(vbalance + loss * 0.5)
                const nrbalance = rbalance - loss
                await execute(db, "UPDATE users SET balance=? WHERE user_id=?", [nvbalance, target.id])
                await execute(db, "UPDATE users SET balance=? WHERE user_id=?", [nrbalance, interaction.user.id])
                await interaction.reply({
                    embeds: [embed.setColor(resolveColor("Red")).setDescription(`You were caught red handed, you managed to bribe your way through it with ${loss}, <@${target.id}> was paid ${Math.round(loss * 0.5)} from it`)]
                })
            }
        }
    }
} 