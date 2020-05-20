const fs = require('fs');
const path = require('path');

console.log('called after')

fs.copyFileSync(path.join(__dirname, '../config.xml'), path.join(__dirname, '../config.tpl.xml'));
