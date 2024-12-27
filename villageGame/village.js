const { notrigger, noSpaceCase } = require('../sharedUtils');
const { villageState } = require('./state');

const handleVillage = async(client, channel, tags, message) => {
    const tReg1 = new RegExp(`^%?\\s*village\\s*`, 'i');
    const tReg2 = new RegExp(`^%?\\s*v\\s*`, 'i');

    const otherString = noSpaceCase(message);

    client.say(channel, otherString);

    let command = message.replace(tReg1, '').trim();
    command = command.replace(tReg2, '').trim();

    if(command == `amnogus`)
        client.say(channel, `amongus response this is the cmomand: `+command);
        

    switch (command) {
        case 'start':
            client.say(channel, '🏚️ The village has started, ')




    }
}

module.exports = { handleVillage };