//Configure local environmental variables
require('dotenv').config()
const axios = require('axios');


async function createClip (channel, postClipToDiscord, interval, dClient, clipChannelId) {
    var delay = false;

    await axios
        .post(`https://api.twitch.tv/helix/clips?broadcaster_id=${channel}`, delay, {
            headers: {
                'Authorization': `Bearer ${process.env.TWITCH_OAUTH_TOKEN}`,
                'Client-Id': process.env.TWITCH_CLIENT_TOKEN
            }
        })
        .then((res) => {
            setTimeout(() => {
                postClipToDiscord(dClient, clipChannelId, `https://clips.twitch.tv/${res.data.data[0].id}`)
            }, 
            interval
        );
            console.log(res.data);
        })
        .catch((err) => {
            console.error(err);
        })
};

module.exports = createClip;