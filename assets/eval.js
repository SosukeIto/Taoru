async function _eval(message) {
    try {
        console.log(message.content)
        const code = message.content.replace("```", "").replace("js", "").replace("```", "").slice(6).trim();
        let evaled = eval(code);
        if (evaled instanceof Promise) {
            evaled = await evaled;
        }
        const result = typeof evaled === 'string' ? evaled : require('util').inspect(evaled);
        message.channel.send(`\`\`\`js\n${result}\n\`\`\``);
    } catch (error) {
        message.channel.send(`\`\`\`js\n${error}\n\`\`\``);
    }
}
module.exports = {
    _eval: _eval
}