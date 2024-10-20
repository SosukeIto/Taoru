const { EmbedBuilder } = require('discord.js');
require('dotenv').config();
const { isInteger } = require('../assets/isInteger.js');
const guildIds = process.env.GUILD_IDS.split(',');
const serverRole = process.env.SERVER_ROLES.split(',');

async function serverURL(client, interaction) {
    const args = interaction.options.getString('number')
    const member = await interaction.guild.members.fetch(interaction.user.id);
    if (!args) {
        const embed = new EmbedBuilder()
            .setTitle(`どのサーバーのリンクを取得しますか？\n`)
            .setColor(0x00AE86)
        contents = ""
        for (let i = 0; i < guildIds.length; i++) {
            const role = interaction.guild.roles.cache.get(serverRole[i]);
            const guild = client.guilds.cache.get(guildIds[i]);
            if (role) {
                if (member.roles.cache.has(serverRole[i])) {
                    contents += `\`${i + 1}\` : **${guild.name}**\n`
                } else {
                    contents += `❌ : **${role.name}**: 付与されていません\n`;
                }
            } else {
                contents += `⚠️  Role ID ${serverRole[i]} はこのサーバーには存在しません\n`
            }
        }
        embed.setDescription(`\`/server-url {number}\`\n${contents}`)
        await interaction.reply({ embeds: [embed] })
    } else if (member.roles.cache.has(serverRole[parseInt(args) - 1]) && isInteger(args) && parseInt(args) <= guildIds.length <= parseInt(args)) {
        const number = parseInt(args) - 1
        const guild = client.guilds.cache.get(guildIds[number]);
        const channel = guild.channels.cache
            .filter(ch => ch.isTextBased())
            .first();
        const invite = await channel.createInvite({
            maxAge: 30,
            maxUses: 1,
        });
        await interaction.reply({ content: `**招待リンクを送信しました！**`, ephemeral: false });
        await interaction.user.send({ content: `サーバーへの招待リンクです: ${invite.url}`, ephemeral: true });
    } else {
        await interaction.reply({ content: `⚠**エラー**\nコマンドが正しく動作しませんでした...`, ephemeral: false });
    }
}
module.exports = {
    serverURL: serverURL
}