const { EmbedBuilder } = require('discord.js');
require('dotenv').config();
const guildIds = process.env.GUILD_IDS.split(',');
async function serverURL(client, interaction) {
    const number = interaction.options.getString('number')
    if (!number) {
        const embed = new EmbedBuilder()
            .setTitle(`どのサーバーのリンクを取得しますか？\n`)
            .setColor(0x00AE86)
        contents = ""
        for (let i = 0; i < guildIds.length; i++) {
            const guild = client.guilds.cache.get(guildIds[i]);
            contents += `\`${i}\` : **${guild.name}**\n`
        }
        embed.setDescription(`\`/server-url {number}\`\n${contents}`)
        await interaction.reply({ embeds: [embed] })
    } else {
        const guild = client.guilds.cache.get(guildIds[parseInt(number)]);
        const channel = guild.channels.cache
            .filter(ch => ch.isTextBased())
            .first();
        const invite = await channel.createInvite({
            maxAge: 30,
            maxUses: 1,
        });
        await interaction.reply({ content: `サーバーへの招待リンクです: ${invite.url}`, ephemeral: true });
    }
}
module.exports = {
    serverURL: serverURL
}