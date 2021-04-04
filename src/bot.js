require('dotenv').config();
const tmi = require('tmi.js');


const opts = {
    identity: {
      username: process.env.BOT_USERNAME,
      password: process.env.OAUTH_TOKEN
    },
    channels: [
        process.env.CHANNEL_NAME
    ]
  };
  


const client = new tmi.client(opts);

client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

client.connect();


function onMessageHandler (target, context, msg, self) {

}

alertChannel = async (channel, message) => {
  client.say(process.env.CHANNEL_NAME, message);
}


  
  // Called every time the bot connects to Twitch chat
  function onConnectedHandler () {
    console.log("twitch bot connected");
  }

  module.exports = {
    alertChannel
  }