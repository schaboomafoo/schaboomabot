const { noTrigger, noSpaceCase } = require('../sharedUtils');
const { villageState, killVillage, startVillage, spawnEnemy } = require('./state');

const mobs = [
    'skeleton', 
    'zombie', 
    'bird'   
];

const handleVillage = async(client, channel, tags, message) => {
    let command = noTrigger(message, 'village');
    command = noTrigger(noSpaceCase(command), 'v');
    //client.say(channel, 'no trigger: '+command);

    if(command == `amongus`)
        client.say(channel, `amongus response this is the cmomand: `+command);


    switch (command) {
        case 'start':
            if(!villageState.alive){
                client.say(channel, '🏚️ The village has started, gather resources 🪵 🪨 🐟 or get ready for invasions  ⚔️🧟💀🧙  ')
                startVillage(tags.username);
            }
            else
                client.say(channel, '🏘️ the village has already started');
            break;


        case 'debug':
            client.say(channel, 'alive: '+villageState.alive+' hp: '+villageState.hp+' villagers: '+villageState.villagers+' resources: '+villageState.resources+' runTime: '+villageState.runTime+' current enemy: '+villageState.currentEnemy);
            client.say(channel, `${mobs}`);
            break;


        case 'summon':
            if(!villageState.alive){
                client.say(channel, 'the village isn\'t started');
            }
            else{
                client.say(channel, "summon arg");
                spawnEnemy('zombie');
            }
            
            break;


        case 'meteor':
            if(!villageState.alive){
                client.say(channel, 'the village isn\'t started');
            }
            else if(tags.username == 'schaboi' || tags.username == 'ranbaclownc '){
                client.say(channel, '🏘️☄️ a meteor has crashed into and destroyed the village 😔 better luck next time')
                killVillage();
            }
            else{
                client.say(channel, `you can\'t send meteors ${tags.username} noob ass`);
            }
            break;

    }
}

module.exports = { handleVillage };

//make village instance restricted to channel
//make village state write and read from file
//add ticks of damage to the village

//damage 15 min ticks

//spawns random 1-3 hours
//time elapsed will just be calculated with a starting timestamp
//then every tick someone checks time passed it will just check time since initial passed