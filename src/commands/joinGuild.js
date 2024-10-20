const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
async function joinGuild(interaction) {
    await interaction.reply({ content: ``, ephemeral: true });
}

module.exports = {
    joinGuild: joinGuild
}