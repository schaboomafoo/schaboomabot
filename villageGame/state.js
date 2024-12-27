const deathState = {
    alive: false,
    hp: 0,
    villagers: [],
    resources: 0,
    runTime: 0
};

const startState = {
    alive: true,
    hp: 1000,
    villagers: [],
    resources: 0,
    runTime: 0
}

let villageState = {
    alive: false,
    hp: 0,
    villagers: [],
    resources: 0,
    runTime: 0
};



function killVillage() {
    Object.assign(villageState, { ...deathState });
}

function startVillage() {
    Object.assign(villageState, { ...startState });
}



module.exports = {
    villageState,
    killVillage,
    startVillage
};