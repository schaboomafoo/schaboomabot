const deathState = {
    alive: false,
    hp: 0,
    villagers: [],
    resources: 0,
    runTime: 0,
    currentEnemy: ""
};

const startState = {
    alive: true,
    hp: 1000,
    villagers: [],
    resources: 0,
    runTime: 0,
    currentEnemy: ""
}

let villageState = {
    alive: false,
    hp: 0,
    villagers: [],
    resources: 0,
    runTime: 0,
    currentEnemy: ""
};



function killVillage() {
    Object.assign(villageState, { ...deathState });
}

function startVillage(user) {
    Object.assign(villageState, { ...startState });
    villageState.villagers = [user]; //add starting user to village
}

function spawnEnemy(enemy){
    enemy = 'zombie';
    villageState.currentEnemy = 'zombie';
}


module.exports = {
    villageState,
    killVillage,
    startVillage,
    spawnEnemy
};