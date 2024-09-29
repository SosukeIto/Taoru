const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeRanking(role) {
    try {
        const { data } = await axios.get(`https://taogames.net/player/ranking/${role}`);
        const $ = cheerio.load(data);
        const rankings = [];

        $('a.index-module___VkzFa__card').each((index, element) => {
            // Find the name within the card
            const name = $(element).find('div.index-module___VkzFa__name').text().trim();
            const level = $(element).find('div.index-module___VkzFa__level').text().trim();
            const playerData = {
                name: name,
                level: level
            };
            rankings.push(playerData);
        });

        // Return the results
        console.log(rankings)
        return rankings;
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

module.exports = {
    scrapeRanking: scrapeRanking
};

