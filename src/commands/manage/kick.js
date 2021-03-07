const discord = require('discord.js')

module.exports = {
    name: 'kick',
    description: 'Pour ejecter qlq',
    execute(message) {
            if(!message.member.hasPermission('KICK_MEMBERS')) return message.reply('Tu n\'a pas la permission pour le faire hihi')
            const member = message.mentions.members.first()
            if (!member) return message.reply('Qui voudrais-tu bannir ?')
            if(!member.bannable) return message.reply('Ce membre ne peut pas être banni')
            member.kick()
            message.channel.send(
                `${
                    member
                } a été kick hihi`,
            )
    },
}