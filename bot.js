//Configure local environmental variables
require('dotenv').config()
const Discord = require('discord.js');
const axios = require('axios');
const tmi = require('tmi.js');
const clipChannelId = '1079162580075036803';
const interval = 60000;

//Instantiate discord.js client
const discordClient = new Discord.Client();

//Instantiate tmi.js client
const twitchClient = new tmi.Client({
    connection: {
        reconnect: true
    },
    channels: ['branchedgamingnetwork', 'zeparatist'],
    identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN
    }
});

//Discord Connection confirmation
discordClient.on('ready', () => {
    console
        .log('Discord connection established')
    // .catch((err) => console.error(err));
});

discordClient.login(process.env.DISCORD_BOT_TOKEN)


//Twitch Connection confirmation
twitchClient.connect().catch((err) => console.error(err));

twitchClient.on('connected', (address, port) => {
    console.log(address)
    console.log(port)
    console.log('Twitch connection established')
});

twitchClient.on('logon', (channel) => {
    console.log(channel)
})


//Message listener
twitchClient.on('message', (channel, userstate, message, self) => {
    //ignore bot sent messages
    if (userstate.username === process.env.TWITCH_BOT_USERNAME) return;

    //determine if message is a command    
    if (!message.startsWith('!')) return;

    //slice command keyword
    const args = message.slice(1).split(' ');
    const command = args.shift().toLowerCase();

    //cross check command keywords
    switch (command) {
        case 'bgn':
            twitchClient.say(channel, `We are sponsoring this event! \nJoin BGN: https://discord.gg/tT2Vaqaj`);
            break;
        case 'clipit':
            getBroadcasterId(channel);
            twitchClient.say(channel, `Got it!\nGreat clip @${userstate.username}, I will upload that to the discord!`);
            break;
        case 'test':
            console.log('Test command');
            break;
        default:
            console.log('No command found');
    }
});


//Message listener
discordClient.on('message', (msg) => {
    if (msg.content === 'ping') {
        discordClient.channels.cache.get(clipChannelId).send('Clip Test Message')
    }
})



//Functions
const createClip = async (channel) => {
    var delay = false;

    await axios
        .post(`https://api.twitch.tv/helix/clips?broadcaster_id=${channel}`, delay, {
            headers: {
                'Authorization': `Bearer ${process.env.TWITCH_OAUTH_TOKEN}`,
                'Client-Id': process.env.TWITCH_CLIENT_TOKEN
            }
        })
        .then((res) => {
            setTimeout(postClipToDiscord, interval, `https://clips.twitch.tv/${res.data.data[0].id}`);
            console.log(res.data);
        })
        .catch((err) => {
            console.error(err);
        })
};

const getBroadcasterId = async (name) => {
    console.log(`Fetching Broadcaster ID for name: ${name}`);

    await axios
        .get(`https://api.twitch.tv/helix/users?login=${name.slice(1)}`, {
            headers: {
                'Authorization': `Bearer ${process.env.TWITCH_OAUTH_TOKEN}`,
                'Client-Id': process.env.TWITCH_CLIENT_TOKEN
            }
        })
        .then((res) => {
            console.log(`Resolved - ${name}::${res.data.data[0].id}`);
            createClip(res.data.data[0].id);
        })
        .catch((err) => {
            console.error(err);
        })
};

const postClipToDiscord = (clipURL) => {
    discordClient.channels.cache
        .get(clipChannelId)
        .send(`Check out this great clip that was created during a stream!
            \nUse **!clipit** in BGN Partnered Streams to create your own clips
            \n${clipURL}`)
};