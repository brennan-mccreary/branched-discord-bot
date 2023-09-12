function sendTwitchMessage(tClient, channel, message) {
    tClient.say(channel, message)
}

module.exports = sendTwitchMessage;