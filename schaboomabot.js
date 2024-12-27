require('dotenv').config();
const fs = require('fs');
const tmi = require('tmi.js');
const si = require('systeminformation');
const fetch = require('node-fetch'); // Ensure you install this with `npm install node-fetch`
const {exec} = require('child_process');
const os = require('os'); // To detect the operating system

//village consts from elsewhere
const { handleVillage } = require('./villageGame/village');
const { noTrigger, noSpaceCase } = require('./sharedUtils');


const cooldowns = new Map();

let messages = [];

const colors = [
  `Blue`, `Blue_Violet`, `Cadet_Blue`, `Chocolate`, `Coral`, `Dodger_Blue`,
  `Firebrick`, `Golden_Rod`, `Green`, `Hot_Pink`, `Orange_Red`, `Red`,
  `Sea_Green`, `Spring_Green`, `Yellow_Green`
];
const colorAliases = {pink: 'Hot_Pink', dodger: 'Dodger_Blue', fire: 'Firebrick', brick: 'Firebrick', gold: 'Golden_Rod', sea: 'Sea_Green', spring: 'Spring_Green', yellow: 'Yellow_Green'};

const animations = [
  `anime`, `fors`
];

// Bot configuration from .env
const opts = {
  identity: {
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN
  },
  channels: JSON.parse(process.env.TWITCH_CHANNELS)
};


//Create a client
const client = new tmi.Client(opts);





//Helper function to change color using Helix API
async function changeColor(color) {
  const url = `https://api.twitch.tv/helix/chat/color?user_id=${process.env.TWITCH_USER_ID}&color=${color}`;
  const options = {
    method: 'PUT',
    headers: {
      'Client-ID': process.env.CLIENT_ID,
      'Authorization': `Bearer ${process.env.TWITCH_OAUTH_TOKEN.replace('oauth:', '')}`
    }
  };
  
  try {
    const response = await fetch(url, options);
    if (response.ok) {
      console.log(`Color successfully changed to: ${color}`);
    } else {
      const errorDetails = await response.json();
      console.error('Error changing color:', errorDetails);
    }
  } catch (err) {
    console.error('Network error while changing color:', err);
  }
}




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

//entering dungeon (2-3 hours randomly)
function enterDungeon() {
  const EDinterval = (1 + 2.5 * Math.random()) * 3.6e+6; // Random interval: 1-3.5 hours
  console.log(`Next dungeon entry in ${(EDinterval / 3.6e+6).toFixed(2)} hours.`);
  
  setTimeout(() => {
    client.say('schaboi', `+ed`); // Send the "+ed" command
    enterDungeon(); // Re-schedule itself after the interval
  }, EDinterval);
}

//Battery checking function
async function checkBattery() {
  try {
    const battery = await si.battery();
    if (battery.percent <= 15 && !battery.isCharging && battery.hasBattery) {
      console.log('Battery is low:', battery.percent + '%');
      // Send a message to the first channel in the bot's list
      const alertChannel = opts.channels[0];
      client.say(alertChannel, `MrDestructoid IM DYING HELP IM AT ${battery.percent}% 🪫 PUT THE PLUG IN!`);
    }
  } catch (error) {
    console.error('Error fetching battery information:', error);
  }
}
setInterval(checkBattery, 360 * 1000); // Check every hour





//Register event handlers
client.on('message', async (channel, tags, message, self) => { // Marked as async
  if (self) return; // Ignore bot's own messages
  
  //%help (lists commands)
  
  
  //basic hi response command
  if (message === 'hi') {client.say(channel, `MrDestructoid hi ${tags.username}`);}
  
  //checking battery
  if (noSpaceCase(message.toLowerCase()).startsWith('%battery')) { //very bad
    const battery = await si.battery();
    
    if(!battery.hasBattery) {
      client.say(channel, "MrDestructoid I have no battery");
      return;
    }
    
    let result = '';
    if(battery.isCharging)
      result += `I\'m charging `;
    else 
    result += `I\'m not charging `;
    if(battery.percent > 60)
      result += `🔋 But I'm at a cool ${battery.percent}% FeelsOkayMan`;
    else if(battery.percent < 25){
      if(!battery.isCharging)
        result = `I\'m not charging 🪫 and I\'m at ${battery.percent}% monkaGIGA it's over`;
      else  
      result += `🪫 and I\'m at ${battery.percent}%`;
    }
    else
    result += `and I'm at ${battery.percent}%`;
    client.say(channel, result);
  }
  
  //donating supibot cookies
  if(noSpaceCase(message).startsWith('%cookie')){
    if (noTrigger(message, 'cookie') === '') {
      client.say(channel, `$cookie gift ${tags.username}`);
    } 
    else {
      const args = noTrigger(message, 'cookie').split(' ');
      client.say(channel, `$cookie gift ${args[0]}`);
    }
  }
  
  //joining raids
  if(tags.username === `deepdankdungeonbot` && (message.includes(`A Raid Event at Level`) || message.includes(`The raid will begin in 90`))){setTimeout(() => client.say(channel, `+join`), (2+60*Math.random())*1000);}
  
  //sending diamonds
  if (noSpaceCase(message).startsWith('%diamond') || noSpaceCase(message).startsWith('Diamond')) {
    message = message.replace(/\u{e0000}/u, ''); //does this do anything? remove ivisible characters, pseudo science
    const args = message.split(' ');
    const order = args[1] || 4; // Default order 4 if not specified
    
    // Compile and execute the C code
    const pathExe = os.platform() == 'win32' ? 'genDia.exe' : './genDia';
    exec(`gcc -o genDia generateDiamond.c && ${pathExe} ${order}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing C code: ${stderr}`);
        client.say(channel, `Something went wrong with the diamond generator . ${stderr}:: gcc -o genDia generateDiamond.c && ${pathExe} ${order}`);
        return;
      }
      
      // Send the output to the Twitch chat
      const output = stdout.trim();
      client.say(channel, output.length > 500 ? output.substring(0, 500) + '...' : output);
    });
  }
  
  //sending animations
  if (noSpaceCase(message).startsWith('%gif')) {
    //parse gaming parse code
    if (noTrigger(message, 'gif') === '') {
      client.say(channel, `FeelsDankMan whaht gif? fors or anime?`);
      return;
    } 
    const animationName = noTrigger(message, 'gif');
    
    //return if "#gif with unnacceptable animation name following"
    if(!animations.includes(animationName)){
      client.say(channel, `[`+animations+`] are the gifs`);
      return;
    }
    
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

  //%village and %v related commands
  if(noSpaceCase(message).startsWith('%village') || noSpaceCase(message).startsWith('%v')){
    await handleVillage(client, channel, tags, message);
  }
  
  // Color changing codes
  const matchedColor = colors.find(color => 
    new RegExp(`\\b${color.toLowerCase()}\\b`).test(message.toLowerCase())
  ) || Object.keys(colorAliases).find(alias => 
    new RegExp(`\\b${alias}\\b`).test(message.toLowerCase())
  );
  if (matchedColor) {
    // Change the color via Helix API
    const colorToChange = colorAliases[matchedColor] || matchedColor;
    await changeColor(colorToChange.toLowerCase());
    await new Promise(resolve => setTimeout(resolve, 1000)); //let it cook
    client.say(channel, `/me ♪~ ᕕ(ᐛ)ᕗ`);
  }
  
  //just fake function to show available colors /██
  if (noSpaceCase(message).toLowerCase().startsWith('%color')){
    if(noTrigger(message, 'color') == '' || !matchedColor)
      client.say(channel, '🖍️ available colors are ['+colors+']');
  }
});





client.on('connected', (addr, port) => {
  console.log(`MrDestructoid Bot connected at ${addr}:${port}`);
});



enterDungeon();

// Connect the bot
client.connect();