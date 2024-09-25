async function eval(code) {
    try {
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
    eval: eval
}