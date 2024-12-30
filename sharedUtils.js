//noSpaceCase returns input string with all spaces removed and shifted to lowercase
function noSpaceCase(inp){
  let outp = inp.toLowerCase();
  return outp.replace(/\s+/g, '');
}

//no trigger works with single words, like % command (args) will return (args) trimmed
//it removes spaces from left to right until string starts with trigger, then trims the result and returns it
function noTrigger(inp, t){
  while (!inp.startsWith('%' + t))
    inp = inp.replace(" ", "");

  inp = inp.slice(t.length+1);

  return inp.trim();
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
  if(noSpaceCase(inp).startsWith('%'+cmd))
  return 1;
  return 0;
}

module.exports = {
    noTrigger,
    noSpaceCase,
    getArgument,
    isCommand
}