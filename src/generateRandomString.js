function generateRandomString(...args) {
    if (args.length === 0) return "文字列の長さを数字で答えなさい";
    
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    
    for (let i = 0; i < parseInt(args[0], 10); i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    
    return result;
}
module.exports = {
    generateRandomString:generateRandomString
}