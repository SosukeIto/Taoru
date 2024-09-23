const { EmbedBuilder } = require('discord.js');
const { scrapeRanking } = require('../assets/scrapeRanking.js');
async function button(interaction) {
    const role = interaction.customId;
    try {
        const rankings = await scrapeRanking(role);
        let contents = "";
        for (let i = 0; i < rankings.length; i++) {
            contents += `${i + 1}位 \`${rankings[i]['playerName']}\` : **${rankings[i]['score']}**\n`;
        }
        const rankingEmbed = new EmbedBuilder()
            .setTitle(`世界Top100プレイヤー (${role})`)
            .setColor(0x00AE86)
            .setDescription(contents);

        await interaction.update({ embeds: [rankingEmbed], components: [] }); // ボタンは無効にする
    } catch {
        await interaction.update({ content: 'ランキングを取得中にエラーが発生しました。', components: [] });
    }
}
module.exports = {
    button: button
}