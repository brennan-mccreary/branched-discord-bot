async function postClipToDiscord(dClient, clipChannelId, clipURL) {
        dClient.channels.cache
            .get(clipChannelId)
            .send(`Check out this great clip that was created during a stream!
                \nUse **!clipit** in BGN Partnered Streams to create your own clips
                \n${clipURL}`)
    
}