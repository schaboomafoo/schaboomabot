//no trigger works with single words, like % command (args) will return (args) trimmed
function noTrigger(inp, t){const tReg = new RegExp(`^%?\\s*${t}\\s*`, 'i');return inp.replace(tReg, '').trim();}

//noSpaceCase returns input string with all spaces removed and shifted to lowercase
function noSpaceCase(inp){
  let outp = inp.toLowerCase();
  return outp.replace(/\s+/g, '');
}

//takes input of message, returns argument following given command
//if command isn't present, return 0
function getArgument(msg, command){ 
  if(!noSpaceCase(msg).startsWith('%'+command))
    return 0;
  return noTrigger(msg, command).split(' ')[0];
}

//returns 1 if message strikes given command, 0 otherwise
//input cmd must be lowercase command with no '%'
function isCommand(inp, cmd){
  if(inp.toLowerCase().replace(/\s+/g, '').startsWith('%'+cmd))
  return 1;
  return 0;
}

module.exports = {
    noTrigger,
    noSpaceCase,
    getArgument,
    isCommand
}