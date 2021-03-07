const {get} = require("snekfetch");

module.exports = {
    name: 'picture',
    description: 'pictures',
    execute(message) {
        try {
            get('https://aws.random.cat/meow').then(response => {
                message.channel.send({files: [{attachment: response.body.file, name: `cat.${response.body.file.split('.')[4]}`}]});
            })
        } catch (e) {
            console.log('error!');
        }
    },
}