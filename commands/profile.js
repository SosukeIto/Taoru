const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
async function profile(message){
    message.channel.send("現在のあなたのステータスはこちらです！")
}

module.exports = {
    profile:profile
}