const ytdl = require("ytdl-core");

module.exports = {
    name: 'skip',
    description: 'Skip the song in the queue!',
    execute(message) {
        const voiceChannel = message.member.voice.channel
        const serverQueue = message.client.queue.get(message.guild.id);
        if(!voiceChannel) return message.channel.send("You need to be in a voice channel to play music!");
        if (!serverQueue) return message.channel.send('There is no song that I could skip!');
        serverQueue.connection.dispatcher.end();
        message.channel.send('Music skipped');
    },
};