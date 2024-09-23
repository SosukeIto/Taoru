const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
async function rank(interaction) {
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
    await interaction.reply({ embeds: [embed], components: [row], ephemeral: false });
}

module.exports = {
    rank: rank
}