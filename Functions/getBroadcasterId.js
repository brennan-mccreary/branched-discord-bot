//Configure local environmental variables
require('dotenv').config()
const axios = require('axios');


async function getBroadcasterId (name, twitchClientToken, twitchOauthToken, createClip, interval, dClient, clipChannelId){
    console.log(`Fetching Broadcaster ID for name: ${name}`);

    await axios
        .get(`https://api.twitch.tv/helix/users?login=${name.slice(1)}`, {
            headers: {
                'Authorization': `Bearer ${twitchOauthToken}`,
                'Client-Id': twitchClientToken
            }
        })
        .then((res) => {
            console.log(`Resolved - ${name}::${res.data.data[0].id}`);
            createClip(res.data.data[0].id, postClipToDiscord, interval, dClient, clipChannelId);
        })
        .catch((err) => {
            console.error(err);
        })
};

module.exports = getBroadcasterId;