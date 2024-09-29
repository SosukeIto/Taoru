const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes } = require('discord.js');
const { button } = require('./interactions/button.js');
const { generateRandomString } = require('./assets/generateRandomString.js');
const { rank } = require('./commands/rank.js')
const { giveRole } = require('./commands/giveRole.js')
const { serverURL } = require('./commands/serverURL.js')
const { getMail } = require('./commands/getMail.js')
const { _eval } = require('./commands/eval.js')
const { profile} = require('./commands/profile.js')

require('dotenv').config();
const prefix = process.env.PREFIX;
const token = process.env.TOKEN;
const adminList = process.env.ADMIN_LIST;
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(`${prefix}rand`)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        message.channel.send(generateRandomString(args[1]))
    }
    if (message.content.startsWith(`${prefix}announce`)) {
        if (!adminList.includes(message.author.id)) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const embed = new EmbedBuilder()
            .setTitle(`${args[1]}`)
            .setDescription(`${args[2]}`)
        message.channel.send({ embeds: [embed], })
    }
    if (message.content.startsWith(`${prefix}say`)) {
        if (!adminList.includes(message.author.id)) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        message.channel.send(args[1])
    }
    if (message.content.startsWith(`${prefix}invite`)) {
        if (!adminList.includes(message.author.id)) return;
        const inviteURL = "https://discord.com/oauth2/authorize?client_id=817952432751509515&permissions=0&integration_type=0&scope=bot"
        const embed = new EmbedBuilder()
            .setDescription(`[Botを招待する](${inviteURL})`)
        message.channel.send({ embeds: [embed], })
    }
    if (message.content.startsWith(`${prefix}eval`)) {
        if (!adminList.includes(message.author.id)) return;
        await _eval(message);
    }
    if(message.content.startsWith(`${prefix}profile`)){
        profile(message);
    }
});
client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) { await button(interaction) }
    if (interaction.isCommand()) {
        if (interaction.commandName === 'give-role') { await giveRole(interaction) }
        if (interaction.commandName === 'server-url') { await serverURL(client, interaction) }
        if (interaction.commandName === 'get-mail') { await getMail(interaction) }
        if (interaction.commandName === 'rank') { await rank(interaction) }
        
    }
});
const commands = [
    new SlashCommandBuilder()
        .setName('give-role')
        .setDescription('認証を行います'),
    new SlashCommandBuilder()
        .setName('server-url')
        .setDescription('高レベルサーバーのURLを表示します')
        .addStringOption(option =>
            option.setName('number')
                .setDescription('※任意入りたいサーバーの番号')
                .setRequired(false)),
    new SlashCommandBuilder()
        .setName('get-mail')
        .setDescription('指定したアドレスのメールを見ることができます')
        .addStringOption(option =>
            option.setName('alias')
                .setDescription('{宛名}@souryo7226.com')
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName('rank')
        .setDescription('TAOのランクを表示')
];
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('スラッシュコマンドを登録中...');
        await rest.put(
            Routes.applicationGuildCommands("817952432751509515", "1286743784712835167"),// clientID, serverID
            { body: commands },
        );
        console.log('スラッシュコマンドが登録されました。');
    } catch (error) { console.error(error); }
})();
client.login(token);
