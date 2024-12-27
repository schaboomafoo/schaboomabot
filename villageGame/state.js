const deathState = {
    alive: false,
    villageLevel: 0, //used to calculate enemy damage
    hp: 0,
    villagers: [],
    resources: 0,
    runTime: 0,
    startTime: null,
    currentEnemies: ""
};

const startState = {
    alive: true,
    villageLevel: 1,
    hp: 1000,
    villagers: [],
    resources: 0,
    runTime: 0,
    startTime: null,
    currentEnemies: ""
};

let villageState = {
    alive: false,
    villageLevel: 0,
    hp: 0,
    villagers: [],
    resources: 0,
    runTime: 0,
    startTime: null,
    currentEnemies: ""
};



function killVillage() {
    Object.assign(villageState, { ...deathState });
}

function startVillage(user) {
    Object.assign(villageState, { ...startState });
    villageState.villagers = [user]; //add starting user to village
    villageState.startTime = new Date(); //set start date
}

function spawnEnemy(enemy){
    enemy = 'zombie';
    villageState.currentEnemy = 'zombie';
}

function getTotalAliveTime() {
    if (!villageState.startTime) return 0; // No start time recorded
    const now = new Date(); // Current time
    const timeDifference = now - villageState.startTime; // Difference in milliseconds
    return Math.floor(timeDifference / 1000); // Convert to seconds
}


module.exports = {
    villageState,
    killVillage,
    startVillage,
    spawnEnemy,
    getTotalAliveTime
};