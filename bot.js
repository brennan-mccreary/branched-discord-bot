//Configure local environmental variables
require('dotenv').config()

//Import and declare discord.js client
const Discord= require('discord.js');
const client = new Discord.Client();

//Connection confirmation
client.on('ready', () => {
    console.log('Bot online.');
})


//Message listener
client.on('message', (msg) => {
    if(msg.content === 'ping') {
        msg.reply("Pong!");
    }
})

//API Token Pass
client.login(process.env.BOT_TOKEN)