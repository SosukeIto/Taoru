const { fetchMail } = require('../assets/fetchMail.js');
async function getMail(interaction) {
    const address = interaction.options.getString('alias')
    await fetchMail(interaction, `${address}@souryo7226.com`)
}
module.exports = {
    getMail: getMail
}