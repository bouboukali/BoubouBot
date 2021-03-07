module.exports = {
    name: 'quoi',
    description: 'Quoi? Feur!',
    execute(message) {
        const delay = Date.now() - message.createdAt
        message.reply(`**Feur ! (Badumm Tssss)**`).then(
            function (message){
                message.react("💇")
            }
        )
    },
}