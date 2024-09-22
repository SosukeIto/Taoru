require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, REST, Routes } = require('discord.js');
const { scrapeRanking } = require('./src/scraping/scrapeRanking.js');

const token = process.env.TOKEN;
const prefix = process.env.PREFIX;
const guildIds = [
    "707819253629452370",
    "754292647467810846",
    "684256856599953450",
    "1129277717599223859",
    "706878162923028552",
    "684051781675646986",
    "807389744425074728",
    "1219756229531013220",
]
const taoPlayerRoleId = "1286757664272945162"
const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers] 
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith(`${prefix}announce`)) {
        const embed = new EmbedBuilder()
            .setTitle("**このサーバーについて**")
            .setDescription(`このサーバーは、OhanaClubのギルドサーバーです。主にメンバー同士が交流するために作られました。\n具体的なルールは特に定めていませんが、マナーを守っていただければ幸いです。`)
        message.channel.send({ embeds: [embed], })
    }
    if (message.content.startsWith(`${prefix}say`)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        message.channel.send(args[1])
    }
    if (message.content.startsWith(`${prefix}invite`)) {
        const inviteURL = "https://discord.com/oauth2/authorize?client_id=817952432751509515&permissions=0&integration_type=0&scope=bot"
        const embed = new EmbedBuilder()
            .setDescription(`[Botを招待する](${inviteURL})`)
        message.channel.send({ embeds: [embed], })
    }
    if (message.content.startsWith(`${prefix}slink`)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        if (!args[1]) {
            const embed = new EmbedBuilder()
                .setTitle(`どのサーバーのリンクを取得しますか？\n`)
                .setColor(0x00AE86)
            contents = ""
            for (let i = 0; i < guildIds.length; i++) {
                const guild = client.guilds.cache.get(guildIds[i]);
                contents += `\`${i}\` : **${guild.name}**\n`
            }
            embed.setDescription(`\`wwslink {serverName}\`\n${contents}`)
            message.channel.send({ embeds: [embed], })
            return
        } try {
            const guild = client.guilds.cache.get(guildIds[parseInt(args[1])]);
            const channel = guild.channels.cache
                .filter(ch => ch.isTextBased())
                .first();
            const invite = await channel.createInvite({
                maxAge: 30,
                maxUses: 1,
            });
            message.channel.send(`サーバーへの招待リンクです: ${invite.url}`);
        } catch {
            message.channel.send("数字で指定してください！")
        }

    }
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
    if (interaction.isButton()) {
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
    }else if(interaction.isCommand()){
        if (interaction.commandName === 'give-role') {
            const member = await interaction.guild.members.fetch(interaction.user.id); // サーバーのメンバー情報を取得
            const roles = member.roles.cache.map(role => role.name);
            if (roles.includes("TAOPlayer")){
                await interaction.reply({ content: '既にロールはありますよ！', ephemeral: true });
            }else{
                const role = interaction.guild.roles.cache.find(r => r.name === "TAOPlayer");
                await member.roles.add(role);
                await interaction.reply({ content: 'ロールを付与しました！', ephemeral: true });
            }
        }
    }
});
const commands = [
    new SlashCommandBuilder()
        .setName('give-role')
        .setDescription('認証を行います'),
];
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('スラッシュコマンドを登録中...');
        await rest.put(
            Routes.applicationGuildCommands("817952432751509515", "1286743784712835167"),
            { body: commands },
        );
        console.log('スラッシュコマンドが登録されました。');
    } catch (error) {
        console.error(error);
    }
})();
client.login(token);
