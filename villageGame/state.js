const deathState = {
    alive: false,
    villageLevel: 0,
    hp: 0,
    villagers: [],
    resources: 0,
    runTime: 0,
    startTime: null,
    currentEnemies: []
};

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

const villages = {}; // Stores the village states for each channel

function getVillageState(channel) {
    if (!villages[channel]) {
        villages[channel] = { ...deathState }; // Initialize village state for the channel
    }
    return villages[channel];
}

function killVillage(channel) {
    const village = getVillageState(channel);
    Object.assign(village, { ...deathState });
}

function startVillage(channel, user) {
    const village = getVillageState(channel);
    Object.assign(village, { ...startState });
    village.villagers = [user]; // Add starting user to the village
    village.startTime = new Date(); // Set start date
}

function spawnEnemy(channel, enemy) {
    const village = getVillageState(channel);
    if (village.alive) {
        village.currentEnemies.push(enemy);
    }
}

function killEnemy(channel){
    const village = getVillageState(channel);
    if(killed = village.currentEnemies.pop()){
        return (`${killed} has been killed and is no longer attacking the village`);
    }
    else
        return `🏡 🌤️  nothing is currently attacking the village.`;
}

function updateResources(channel, amount) {
    const village = getVillageState(channel);
    village.resources += amount;
}

function damageVillage(channel, damage) {
    const village = getVillageState(channel);
    village.hp -= damage;
    if (village.hp <= 0) {
        killVillage(channel); // Automatically handle death
    }
}

function addVillager(channel, villager) {
    const village = getVillageState(channel);
    if (!village.villagers.includes(villager)) {
        village.villagers.push(villager);

    }
}

function getTotalAliveTime(channel) {
    const village = getVillageState(channel);
    if (!village.startTime) return 0; // No start time recorded
    const now = new Date(); // Current time
    const timeDifference = now - village.startTime; // Difference in milliseconds
    return Math.floor(timeDifference / 1000); // Convert to seconds
}

module.exports = {
    getVillageState,
    killVillage,
    startVillage,
    spawnEnemy,
    getTotalAliveTime,
    killEnemy,
    updateResources,
    damageVillage,
    addVillager
};