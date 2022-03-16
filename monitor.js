const fs = require('fs');
const outfile = 'out/index.js'
const content = fs.readFileSync(outfile).toString();
fs.writeFileSync(outfile, `console.log("First Line of File");\n${content}`);
