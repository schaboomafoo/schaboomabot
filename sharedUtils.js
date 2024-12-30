//noSpaceCase returns input string with all spaces removed and shifted to lowercase
function noSpaceCase(inp){
  let outp = inp.toLowerCase();
  return outp.replace(/\s+/g, '');
}

//no trigger works with single words, like % command (args) will return (args) trimmed
//it removes spaces from left to right until string starts with trigger, then trims the result and returns it
function noTrigger(inp, t){
  while (!inp.startsWith('%' + t)){
    console.log(`inp: ${inp}\nt: ${t}`);
    inp = inp.replace(" ", "");
    console.log(inp);
  }

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

/*//takes input string, returns 1 if the string contains banned words imported from 'blockedTerms.txt'
//also returns 1 if the string starts with "." or "/" because of the context of usage
function isBannedTerm(inp){
  if(inp.startsWith('.') || inp.startsWith('/'))
    return 1;//"MrDestructoid ❓ ";
  // Mapping of substitutes to original letters
  const substitutes = {
    'a': ['ά', 'α', 'Α', '@', '🅰️', '4'],
    'b': ['🅱️', 'β', 'Β'],
    'c': ['©', '¢', 'ċ', 'ć', 'č'],
    'd': ['ď', 'đ'],
    'e': ['è', 'é', 'ê', 'ë', 'ē', 'ĕ', 'ė', 'ę', 'ě', '€', '℮'],
    'f': ['ƒ'],
    'g': ['ğ', 'ĝ', 'ġ', 'ģ'],
    'h': ['ĥ', 'ħ'],
    'i': ['ì', 'í', 'î', 'ï', 'ī', 'ĭ', 'į', 'ı', 'ℹ️'],
    'j': ['ĵ'],
    'k': ['ķ', 'ĸ'],
    'l': ['ĺ', 'ļ', 'ľ', 'ŀ', 'ł'],
    'm': ['м'],
    'n': ['ñ', 'ń', 'ņ', 'ň', 'ŉ', 'ŋ'],
    'o': ['ò', 'ó', 'ô', 'õ', 'ö', 'ō', 'ŏ', 'ő', 'ø', 'ô', 'º', '°', '🅾️', '⭕'],
    'p': ['ρ', 'ƥ'],
    'q': ['ɋ'],
    'r': ['ŕ', 'ŗ', 'ř'],
    's': ['ś', 'ŝ', 'ş', 'š', '$', '5'],
    't': ['ţ', 'ť', 'ŧ'],
    'u': ['ù', 'ú', 'û', 'ü', 'ū', 'ŭ', 'ů', 'ű', 'ų', 'µ'],
    'v': ['ν'],
    'w': ['ŵ'],
    'x': ['×'],
    'y': ['ý', 'ÿ', 'ŷ'],
    'z': ['ź', 'ż', 'ž', 'ƶ']
  };

  // Create a reverse mapping for substitution
  const reverseMapping = {};
  for (const [char, subs] of Object.entries(substitutes)) {
    subs.forEach(sub => reverseMapping[sub] = char);
  }

  // Create a regex pattern to match any substitute character
  const pattern = new RegExp(Object.keys(reverseMapping).map(ch => ch.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|'), 'g');

  // Replace matches with the original letter
  return text.replace(pattern, match => reverseMapping[match] || match);

  const textWithSubstitutes = "ℓ℮ts gℴ 4wαy!";
  const normalizedText = replaceLetterSubstitutes(textWithSubstitutes);
}

*/

module.exports = {
    noTrigger,
    noSpaceCase,
    getArgument,
    isCommand
}