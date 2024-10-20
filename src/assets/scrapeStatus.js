const axios = require('axios');
const cheerio = require('cheerio');
const { stat } = require('fs');
async function scrapeStatus(userId) {
    try {
        const { data } = await axios.get(`https://taogames.net/player/status/${userId}`);
        const $ = cheerio.load(data);
        const statusInfo = [];

        $('div.index-module___luzbq__body').each((index, body) => {
            $(body).find('div.index-module___luzbq__statItem').each((index, statItems) => {
                const info = $(statItems).find('p.index-module___luzbq__statValue').text().trim();
                statusInfo.push(info)
            });
        });

        return statusInfo;
    } catch (error) {
        console.error('An error occurred:', error);
    }
}
module.exports = {
    scrapeStatus: scrapeStatus
}