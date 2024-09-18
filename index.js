require('dotenv').config();

const token = process.env.TOKEN;
const prefix = process.env.PREFIX;
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { scrapeRanking } = require('./src/scraping/scrapeRanking.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,] });
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith(`${prefix}rank`)) {
        const embed = new EmbedBuilder()
            .setTitle(`見たい役職番号を押してください`)
            .setColor(0x00AE86)
            .setDescription(`\`1\` : **adventure**\n\`2\` : **warrior**\n\`3\` : **mage**\n\`4\` : **thief**\n`)
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('adventure')
                    .setLabel('Adventure')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('warrior')
                    .setLabel('Warrior')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('mage')
                    .setLabel('Mage')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('thief')
                    .setLabel('Thief')
                    .setStyle(ButtonStyle.Primary),
            );
        message.channel.send({
            embeds: [embed],
            components: [row]
        })
    }
});
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

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
    } catch (error) {
        console.error('エラーが発生しました:', error);
        await interaction.update({ content: 'ランキングを取得中にエラーが発生しました。', components: [] });
    }
});
client.login(token);
