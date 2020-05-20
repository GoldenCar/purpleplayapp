const fs = require('fs');
const path = require('path');
const compile = require('es6-template-strings/compile');
const resolveToString = require('es6-template-strings/resolve-to-string');

const brandDataFile = `../../brands/${process.env.npm_package_env_name}/brandData`;
const brandData = require(brandDataFile);

// replace env in config.xml
var templateData = fs.readFileSync(path.join(__dirname, '../config.tpl.xml'), 'utf8');
var content = resolveToString(compile(templateData), brandData);
fs.writeFileSync(path.join(__dirname, '../config.xml'), content);
