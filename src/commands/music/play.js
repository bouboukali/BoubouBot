const ytdl = require("ytdl-core");
const queue = new Map()

module.exports = {
    name: 'play',
    description: 'Play a song in your channel!',
    async execute(message) {
        const args = message.content.split(" ");

        const serverQueue = queue.get(message.guild.id)

        const voiceChannel = message.member.voice.channel
        if(!voiceChannel) return message.channel.send("You need to be in a voice channel to play music!")

        const permissions = voiceChannel.permissionsFor(message.client.user)
        if(!permissions.has('CONNECT')) return message.channel.send("I need the permissions to connect in your voice channel!")
        if(!permissions.has('SPEAK')) return message.channel.send("I need the permissions to connect in your voice channel!")

        const songInfo = await ytdl.getInfo(args[1])
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url
        }

        if(!serverQueue){
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
            }
            queue.set(message.guild.id, queueConstruct)

            queueConstruct.songs.push(song)
            
            try {
                var connection = await voiceChannel.join()
                queueConstruct.connection = connection
                this.play(message.guild, queueConstruct.songs[0])
            } catch(error) {
                console.log(`There was an error connecting to the voice channel ${error}`)
                queue.delete(message.guild.id)
                return message.channel.send("There was an error connecting to the voice channel")
            }
        } else {
            serverQueue.songs.push(song)
            return message.channel.send(`**${song.title}** a été ajouté à la liste`)
        }

        return undefined

    },

    play(guild,song) {
        console.log("bouuuuh")
        const serverQueue = queue.get(guild.id)

        if(!song){
            serverQueue.voiceChannel.leave()
            queue.delete(guild.id)
            return
        }

        const dispatcher = serverQueue.connection.play(ytdl(song.url))
        .on('finish', () => {
            serverQueue.songs.shift()
            play(guild,serverQueue.songs[0])
        })
        .on('error', error => {
            console.log(error)
        })
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5)
    }
}
