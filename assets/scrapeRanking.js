const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeRanking(role) {
    try {
        // ページのHTMLを取得
        const { data } = await axios.get(`https://taogames.net/player/ranking/${role}`);

        // cheerioでHTMLを解析
        const $ = cheerio.load(data);

        // ランキングデータを格納する配列
        const rankings = [];

        // テーブルの行をループして情報を取得
        $('table tbody tr').each((index, element) => {
            const playerName = $(element).find('a').text().trim();  // プレイヤー名
            const score = $(element).find('th').last().text().trim();  // スコア

            // オブジェクトにして配列に追加
            rankings.push({
                playerName,
                score,
            });
        });

        // 結果をコンソールに表示
        return rankings
    } catch (error) {
        console.error('エラーが発生しました:', error);
    }
}
module.exports = {
    scrapeRanking: scrapeRanking
}