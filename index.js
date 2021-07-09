
let stdin = false;
let tabs = false;
let spaces = 2;
let fromFile = true;
let file = null;
let private = false;
let spaceStr = '';

const advance = (obj, level) => {
  const parts = [];

  if(Array.isArray(obj)) {
    const entry = obj[0];
    if(entry) {
      const t = typeof entry;
      switch(t) {
      case 'string':
        return `[]string`;
      case 'number':
        return `[]${Number.isInteger(entry) ? 'int' : 'float32'}`;
      case 'boolean':
        return `[]bool`;
      case 'object': {
        if(entry === null) return `[]interface{}`;
        const subObj = advance(entry, level+1);
        return `[]${subObj}` ;
      }
      }
    }
  } else {
    for(const key of Object.keys(obj)) {
      const val = obj[key];
      const capKey = private ? key :  `${key[0].toUpperCase()}${key.substr(1)}`;
      const type = typeof val;

      switch(type) {
      case 'string':
        parts.push({key, capKey, type: 'string'});
        break;
      case 'number':

        parts.push({type: Number.isInteger(val) ? 'int' : 'float32', key, capKey});
        break;
      case 'boolean':
        parts.push({key, capKey, type: 'bool'});
        break;
      case 'object': {
        if(val === null) {
          parts.push({key, capKey, type: 'interface{}'});
          break;

        }
        const subObj = advance(val, level+1);
        parts.push({key, capKey, type: subObj});
      }
      }

    }
  }


  const spaces = Array(level).fill().map(() => tabs ? '\t' : spaceStr).join('');
  return `struct {
${parts.map(e => `${spaces}${e.capKey} ${e.type} \`json:"${e.key}"\``).join('\n')}
${spaces.substr(2)}}`;
};

process.argv.forEach((param, index) => {
  if(param === "-std" || param === "--stdin") {
    fromFile = false;
    stdin = true;
  }
  if(param === "-t" || param === "--tabs") {
    tabs = true;
  }
  if(param === "-s" || param === "--spaces") {
    spaces = Number.parseInt(process.argv[index+1]);
  }
  if(param === "-p" || param === "--private") {
    private = true;
  }

});

spaceStr = `${Array(spaces).fill().map(e => ' ').join('')}`;

if (stdin) {
  let data = '';
  process.stdin.on('data', buff => data += buff.toString('utf-8'));
  process.stdin.on('end', () => {
    const out = `type Object ${advance( JSON.parse(data), 1)}`;
    console.log(out);

  });

} else {
  const fs = require('fs');
  const content = fs.readFileSync(process.argv[process.argv.length-1], 'utf-8');
  const out = `type Object ${advance(JSON.parse(content), 1)}`;
  console.log(out);

}
