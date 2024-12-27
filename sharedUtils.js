//no trigger works with single words, like % command (args) will return (args) trimmed
function noTrigger(inp, t){const tReg = new RegExp(`^%?\\s*${t}\\s*`, 'i');return inp.replace(tReg, '').trim();}

//noSpaceCase returns input string with all spaces removed and shifted to lowercase
function noSpaceCase(inp){
  let outp = inp.toLowerCase();
  return outp.replace(/\s+/g, '');
}

module.exports = {
    noTrigger,
    noSpaceCase
}