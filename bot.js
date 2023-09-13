//Configure local environmental variables
require('dotenv').config()
const Discord = require('discord.js');
const axios = require('axios');
const tmi = require('tmi.js');
const clipChannelId = '705103840797655047';
const interval = 60000;
const adMsgInterval = 600000;

//Function Imports
const createClip = require('./Functions/createClip')
const getBroadcasterId = require('./Functions/getBroadcasterId');
const sendTwitchMessage = require('./Functions/sendTwitchMessage');
const postClipToDiscord = require('./Functions/postClipToDiscord');

//Interval Ads
let adRoll;

//Instantiate discord.js client
const discordClient = new Discord.Client();

//Instantiate tmi.js client
const twitchClient = new tmi.Client({
    connection: {
        reconnect: true
    },
    channels: ['snowmonk1337','zeparatist'],
    identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN
    }
});

//Discord Connection confirmation
discordClient.on('ready', () => {
    console.log('Discord connection established...')
});

discordClient.login(process.env.DISCORD_BOT_TOKEN)


//Twitch Connection confirmation
twitchClient.connect().catch((err) => console.error(err));

twitchClient.on('connected', () => {
    console.log('Twitch connection established...')
});



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
            sendTwitchMessage(
                twitchClient, 
                channel, 
                `This is a BGN Partnered Stream! Check us out: https://discord.gg/QUUWPjEZRG`
            );
            break;
        case 'clipit':
            getBroadcasterId(
                channel, 
                process.env.TWITCH_CLIENT_TOKEN, 
                process.env.TWITCH_OAUTH_TOKEN, 
                createClip, 
                interval, 
                discordClient, 
                clipChannelId,
                postClipToDiscord
            );

            sendTwitchMessage(
                twitchClient,
                channel,
                `Got it!\nGreat clip @${userstate.username}, I will upload that to the discord!`
            )
            break;
        case 'connect':
            console.log(`${channel} connection established.`);
            break;
        case 'startad':
            if(userstate.username === 'zeparatist') {
                sendTwitchMessage(twitchClient, channel,'[Ads Enabled...]')
               adRoll = setInterval(() => {sendTwitchMessage(twitchClient, channel,`Use '!clipit' to capture ${channel.charAt(1).toUpperCase()}${channel.slice(2)}'s best moments!`)}, adMsgInterval );
            }
            else {
                sendTwitchMessage(twitchClient, channel,'[Permission denied.]')
            }
            break;
        case 'stopad':
            if(userstate.username === 'zeparatist') {
                clearInterval(adRoll);
                sendTwitchMessage(twitchClient, channel,'[Ads Disabled...]')
            }
            else {
                sendTwitchMessage(twitchClient, channel,'[Permission denied.]')
            }
            break;
        case 'test':
            sendTwitchMessage(twitchClient, channel,'test-message');
            break;
        case 'goodbye':
            sendTwitchMessage(twitchClient, channel,'Logging off, Goodbye!');
            process.exit();
            break;
        default:
            console.log('No command found');
    }
});



//Test Handlers
//Message listener
// discordClient.on('message', (msg) => {
//     if (msg.content === 'ping') {
//         discordClient.channels.cache.get(clipChannelId).send('Ping response')
//     }
// })



//Functions
// const createClip = async (channel) => {
//     var delay = false;

//     await axios
//         .post(`https://api.twitch.tv/helix/clips?broadcaster_id=${channel}`, delay, {
//             headers: {
//                 'Authorization': `Bearer ${process.env.TWITCH_OAUTH_TOKEN}`,
//                 'Client-Id': process.env.TWITCH_CLIENT_TOKEN
//             }
//         })
//         .then((res) => {
//             setTimeout(postClipToDiscord, interval, `https://clips.twitch.tv/${res.data.data[0].id}`);
//             console.log(res.data);
//         })
//         .catch((err) => {
//             console.error(err);
//         })
// };

// const getBroadcasterId = async (name) => {
//     console.log(`Fetching Broadcaster ID for name: ${name}`);

//     await axios
//         .get(`https://api.twitch.tv/helix/users?login=${name.slice(1)}`, {
//             headers: {
//                 'Authorization': `Bearer ${process.env.TWITCH_OAUTH_TOKEN}`,
//                 'Client-Id': process.env.TWITCH_CLIENT_TOKEN
//             }
//         })
//         .then((res) => {
//             console.log(`Resolved - ${name}::${res.data.data[0].id}`);
//             createClip(res.data.data[0].id);
//         })
//         .catch((err) => {
//             console.error(err);
//         })
// };

// const postClipToDiscord = (clipURL) => {
//     discordClient.channels.cache
//         .get(clipChannelId)
//         .send(`Check out this great clip that was created during a stream!
//             \nUse **!clipit** in BGN Partnered Streams to create your own clips
//             \n${clipURL}`)
// };