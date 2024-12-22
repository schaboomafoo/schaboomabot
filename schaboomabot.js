require('dotenv').config();
const fs = require('fs');
const tmi = require('tmi.js');
const fetch = require('node-fetch'); // Ensure you install this with `npm install node-fetch`
const cooldowns = new Map();

let messages = [];

const colors = [
  `Blue`, `BlueViolet`, `CadetBlue`, `Chocolate`, `Coral`, `DodgerBlue`,
  `Firebrick`, `GoldenRod`, `Green`, `HotPink`, `OrangeRed`, `Red`,
  `SeaGreen`, `SpringGreen`, `YellowGreen`
];

const animations = [
  `anime`, `fors`
];

// Bot configuration from .env
const opts = {
  identity: {
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN
  },
  channels: [process.env.TWITCH_CHANNEL]
};

//loading messages for #gif command
const loadMessages = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        reject('Error reading file:', err);
      } else {
        const lines = data.split('\n').filter(line => line.trim() !== '');
        resolve(lines);
      }
    });
  });
};

// Create a client
const client = new tmi.Client(opts);

// Helper function to change color using Helix API
async function changeColor(color) {
  const url = `https://api.twitch.tv/helix/chat/color?user_id=${process.env.TWITCH_USER_ID}`;
  const options = {
    method: 'PUT',
    headers: {
      'Client-ID': process.env.CLIENT_ID,
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ color })
  };
  
  try {
    const response = await fetch(url, options);
    if (response.status === 204) {
      console.log(`Color successfully changed to: ${color}`);
    } else {
      const error = await response.json();
      console.error('Error changing color:', error);
    }
  } catch (err) {
    console.error('Error with color API request:', err);
  }
}

//Register event handlers
client.on('message', async (channel, tags, message, self) => { // Marked as async
  if (self) return; // Ignore bot's own messages
  
  //basic hi response command
  if (message === 'hi') {
    client.say(channel, `MrDestructoid hi ${tags.username}`);
  }

  //joining raids
  if(tags.username === `deepdankdungeonbot` && message.includes(`A Raid Event at Level`)){
    setTimeout(() => client.say(channel, `+join`), (2+90*Math.random())*1000);
  }

  //sending animation
  if (message.startsWith('#gif ')) {
    const parts = message.split(' ');
    const animationName = parts[1];

    //return if "#gif with unnacceptable animation name following"
    if(!animations.includes(animationName))
      return;

    try {
      messages = await loadMessages(`${animationName}.txt`);
      
      // Send each message with a delay
      let messageIndex = 0;
      
      const sendNextMessage = () => {
        if (messageIndex < messages.length) {
          client.say(channel, messages[messageIndex])
          .then(() => {
            messageIndex++;
            setTimeout(sendNextMessage, 75);
          })
          .catch(console.error);
        } else {
          console.log('All messages sent!');
        }
      };
      
      sendNextMessage();
    } catch (error) {
      console.error('Error:', error);
      client.say(channel, 'An error occurred while sending messages.');
    }
  }
  
  // Color changing codes
  const matchedColor = colors.find(color => new RegExp(`\\b${color.toLowerCase()}\\b`).test(message.toLowerCase()));
  if (matchedColor) {
    // Change the color via Helix API
    await changeColor(matchedColor.toLowerCase()); // Use await here
    client.say(channel, `/me ♪~ ᕕ(ᐛ)ᕗ`);
  }
});

client.on('connected', (addr, port) => {
  console.log(`MrDestructoid Bot connected at ${addr}:${port}`);
});

// Connect the bot
client.connect();