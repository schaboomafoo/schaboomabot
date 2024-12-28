const { noTrigger, noSpaceCase } = require('../sharedUtils');
const { getVillageState,killVillage,startVillage,spawnEnemy,getTotalAliveTime,killEnemy,updateResources,damageVillage,addVillager} = require('./state');

/*
const startState = {
    alive: true,
    villageLevel: 1,
    hp: 1000,
    villagers: [],
    resources: 0,
    runTime: 0,
    startTime: null,
    currentEnemies: []
};
*/

const enemies = [
    { type: '💀', dps: 10 },
    { type: '🧟', dps: 12 },
    { type: '🧌', dps: 15 },
    { type: '👻', dps: 20 },
    { type: '👽', dps: 25 },
    { type: '🤖', dps: 30 },
    { type: '👹', dps: 35 }
];


//spawn enemy
function spawnRandomEnemy(client, channel, villageState) {
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];
    villageState.currentEnemies.push(enemy.type);
    console.log(`Spawned enemy ${enemy.type} in channel ${channel}`);
    client.say(channel, `An enemy ${enemy.type} has spawned and is now attacking the village!`);

}

// Calculate and apply damage to the village
function applyDamage(client, channel, villageState) {
    let totalDPS = 0;
    villageState.currentEnemies.forEach(enemyType => {
        const enemy = enemies.find(e => e.type === enemyType);
        if (enemy) totalDPS += enemy.dps;
    });

    villageState.hp -= totalDPS;
    console.log(`Channel ${channel}: ${totalDPS} damage applied. Remaining HP: ${villageState.hp}`);
    client.say(channel, `${villageState.currentEnemies} are attacking the village!`);
    client.say(channel, `${totalDPS} damage applied. Remaining HP: ${villageState.hp}`);

    if (villageState.hp <= 0) {
        killVillage(channel);
        console.log(`Channel ${channel}'s village has been destroyed!`);
        client.say(channel, "🔥🏚️ ☠️ your village has been destroyed entirely, beyond repair");
    }
}

const handleVillage = async(client, channel, tags, message) => {
    let command = noTrigger(message, 'village');
    command = noTrigger(noSpaceCase(command), 'v');
    //client.say(channel, 'no trigger: '+command);

    const villageState = getVillageState(channel);

    if(command == `amongus`)
        client.say(channel, `amongus response this is the cmomand: `+command);


    switch (command) {
        case 'start':
            if(!villageState.alive){
                const message = startVillage(channel, tags.username);
                client.say(channel, "🏚️ The village has started, gather resources 🪵 🪨 🐟 or get ready for invasions  ⚔️🧟💀🧙 ");
            }
            else
                client.say(channel, '🏘️ the village has already started');
            break;

        case 'join':
            if(!villageState.villagers.includes(tags.username)){
                client.say(channel, `🏕️ welcome to the village ${tags.username}`)
                addVillager(channel, tags.username);
            }
            else
                client.say(channel, `you are already in the village ${tags.username}`);
            break;

        case 'debug':
            client.say(channel, 
                `alive: ${villageState.alive} | ` +
                `level: ${villageState.villageLevel} | ` +
                `hp: ${villageState.hp} | ` +
                `villagers: ${villageState.villagers} | ` +
                `resources: ${villageState.resources} | ` +
                `current enemies: ${villageState.currentEnemies}`
            );
            break;


        case 'summon':
            if (!villageState.alive) {
                client.say(channel, "The village isn't started yet.");
            } else {
                spawnEnemy(channel, '🧟');
                client.say(channel, "🧟 A zombie has appeared!");
            }
            break;

        case 'kill': 
        case 'attack':
        case 'defend':
            if(!villageState.villagers.includes(tags.username))
                addVillager(channel, tags.username);
            if(!villageState.alive)
                client.say(channel, 'the village isn\'t started');
            else
                client.say(channel, killEnemy(channel));
            break;


        case 'meteor':
            if(!villageState.alive){
                client.say(channel, 'the village isn\'t started');
            }
            else if(tags.username == 'schaboi' || tags.username == 'ranbaclownc'){
                client.say(channel, '🏘️☄️ a meteor has crashed into and destroyed the village 😔 better luck next time')
                killVillage(channel);
            }
            else{
                client.say(channel, `you can\'t send meteors ${tags.username} noob ass`);
            }
            break;


            default:
                //client.say(channel, "Unknown village command");
                break;
    }
}

module.exports = { handleVillage, spawnRandomEnemy, applyDamage };

//make village instance restricted to channel
//make village state write and read from file
//add ticks of damage to the village

//damage 15 min ticks

//spawns random 1-3 hours
//time elapsed will just be calculated with a starting timestamp
//then every tick someone checks time passed it will just check time since initial passed