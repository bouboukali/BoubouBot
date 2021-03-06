require('dotenv').config()
const discord = require('discord.js')
const config = require('../config.json')
const botCommands = require('./commands')

const { TOKEN } = process.env
const { prefix, name } = config

// Config
const configSchema = {
    name,
    defaultColors: {
        success: '#41b95f',
        neutral: '#287db4',
        warning: '#ff7100',
        error: '#c63737',
    },
}

// Define the bot
const bot = {
    client: new discord.Client(),
    log: console.log, // eslint-disable-line no-console
    commands: new discord.Collection(),
    config: configSchema,
}

/*
 * Define all the core functions for the bot lifecycle
 */

// Load the bot
bot.load = function load() {
    this.log('Loading commands...')
    Object.keys(botCommands).forEach(key => {
        this.commands.set(botCommands[key].name, botCommands[key])
    })
    this.log('Connecting...')
    this.client.login(TOKEN)
}

// Fired on successful login
bot.onConnect = async function onConnect() {
    this.log(`Logged in as: ${this.client.user.tag} (id: ${this.client.user.id})`)
}

// Check and react to messages
bot.onMessage = async function onMessage(message) {
    let blacklisted = ['bouh', 'chien', 'dog', 'pup','puppy','bitch','doggy','hound','mongrel','mutt','pooch','stray','tyke', 'pug']

    let foundInText = false;
    for(var i in blacklisted){
        if(message.content.toLowerCase().includes(blacklisted[i].toLowerCase())) foundInText = true;
    }

    if(foundInText){
        message.delete();
        message.channel.send("Ce mot est interdit")
    }
    // ignore all other messages without our prefix
    if (!message.content.startsWith(prefix)) return


    const args = message.content.split(/ +/)
    // get the first word (lowercase) and remove the prefix
    const command = args.shift().toLowerCase().slice(prefix.length)

    if (!this.commands.has(command)) return

    try {
        this.commands.get(command).execute(message, args, bot)
    } catch (error) {
        this.log(error)
        message.reply('there was an error trying to execute that command!')
    }
    
}

/*
 * Register event listeners
 */

bot.client.on('ready', bot.onConnect.bind(bot))
bot.client.on('error', err => {
    bot.log(`Client error: ${err.message}`)
})
bot.client.on('reconnecting', () => {
    bot.log('Reconnecting...')
})
bot.client.on('disconnect', evt => {
    bot.log(`Disconnected: ${evt.reason} (${evt.code})`)
})
bot.client.on('message', bot.onMessage.bind(bot))

// start the bot
bot.load()
