const fs = require('fs');
const path = require('path');

fs.copyFileSync(path.join(__dirname, '../config.tpl.xml'), path.join(__dirname, '../config.xml'));
