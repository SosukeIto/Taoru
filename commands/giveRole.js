async function giveRole(interaction) {
    const member = await interaction.guild.members.fetch(interaction.user.id); // サーバーのメンバー情報を取得
    const roles = member.roles.cache.map(role => role.name);
    if (roles.includes("TAOPlayer")) {
        await interaction.reply({ content: '既にロールはありますよ！', ephemeral: true });
    } else {
        const role = interaction.guild.roles.cache.find(r => r.name === "TAOPlayer");
        await member.roles.add(role);
        await interaction.reply({ content: 'ロールを付与しました！', ephemeral: true });
    }
}
module.exports = {
    giveRole: giveRole
}