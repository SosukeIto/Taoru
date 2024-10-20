const { scrapeStatus } = require('../assets/scrapeStatus.js')
async function status(args, message) {
    columns = ["ログイン日数", "モンスターポイント", "敵討伐数", "総合戦闘力", "レベル", "経験値", "攻撃確率", "特殊能力"]
    statusInfo = await scrapeStatus(!args[1] ? message.author.id : args[1])
    let content = ""
    for (let i = 0; i < statusInfo.length; i++) {
        content += `${columns[i]}:${statusInfo[i]}\n`
    }
    message.channel.send(content)
}

module.exports = {
    status: status
}