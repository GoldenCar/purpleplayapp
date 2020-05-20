const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const availableBrands = fs.readdirSync(path.join(__dirname, '../brands')).filter(source => fs.lstatSync(path.join(__dirname, '../brands', source)).isDirectory());

let BRAND_NAME = process.argv[2];

if (!BRAND_NAME) {
  console.log('No brand selected.');
  console.log('You can choose a brand by running node setEnv.js [BRAND_NAME]')
  console.log(`List of brands: ${availableBrands.join(', ')}`)
  process.exit();
}

if (!availableBrands.includes(BRAND_NAME)) {
  console.log('Invalid brand name selected')
  console.log(`List of brands: ${availableBrands.join(', ')}`)
  process.exit();
}

const brandFolder = path.join(__dirname, '../brands', BRAND_NAME)
const cordovaFolder = path.join(__dirname, '../src-cordova')
const electronFolder = path.join(__dirname, '../src-electron')


function deleteFolderRecursive(location) {
  if (location === '/' || !location) {
    return;
  }
  if (fs.existsSync(location)) {
    fs.readdirSync(location).forEach(function(file){
      var curPath = path.join(location, file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(location);
  }
}

exports.setPackage = async function () {
  try {
    brandPackage = fs.readFileSync(path.join(brandFolder, 'package.json'), 'utf-8')

    brandPackageJson = JSON.parse(brandPackage);
    brandPackageJson.currentBrand = BRAND_NAME;

    fs.writeFileSync(path.join(__dirname, '../package.json'), JSON.stringify(brandPackageJson, null, 2));
    console.log(`Copied package.json for ${BRAND_NAME} brand`)

  } catch (err) {
    console.log(err.message)
    console.log(`Could not load package.json for the ${BRAND_NAME} brand`);
    console.log('Loading selected brand with previous configuration');
    brandPackage = fs.readFileSync('./package.json');
    brandPackage.currentBrand = BRAND_NAME;
    fs.writeFileSync('./package.json', brandPackage);
  }
}

exports.setIcon = async function() {
  try {
    const icon = fs.readFileSync(path.join(brandFolder, 'icon.png'));
    fs.writeFileSync(path.join(electronFolder, 'icons/linux-512x512.png'), icon)
    fs.writeFileSync(path.join(cordovaFolder, 'icon.png'), icon)
    console.log(`Copied icon.png for ${BRAND_NAME} brand`)
  } catch (err) {
    console.log(err.message);
    console.log(`Could not load the icon for ${BRAND_NAME} brand`);
  }
}

exports.setSplash = async function() {
  try {
    const splash = fs.readFileSync(path.join(brandFolder, 'splash.png'));
    fs.writeFileSync(path.join(cordovaFolder, 'splash.png'), splash)
    fs.writeFileSync(path.join(cordovaFolder, 'res/screen/ios/Default@2x~universal~anyany.png'), splash)
    console.log(`Copied splash.png for ${BRAND_NAME} brand`)
  } catch (err) {
    console.log(err.message);
    console.log(`Could not load spash screen for ${BRAND_NAME} brand`);
  }
}

exports.installPackages = async function() {
  console.log('Installing packages...')
  const {
    stdout,
    stderr
  } = await exec('yarn')
  if (stderr) {
    console.log(stderr)
  }
}

exports.removeCordovaPackages = async function() {
  const cordovaPackagePath = path.join(cordovaFolder, 'package.json');
  const cordovaPackageLockPath = path.join(cordovaFolder, 'package-lock.json');
  if (fs.existsSync(cordovaPackagePath)) {
    fs.unlinkSync(cordovaPackagePath)
    console.log(`Removed cordova package file`)
  }

  if (fs.existsSync(cordovaPackageLockPath)) {
    fs.unlinkSync(cordovaPackageLockPath)
  }

  deleteFolderRecursive(path.join(cordovaFolder, 'node_modules'));
  deleteFolderRecursive(path.join(cordovaFolder, 'platforms'));
  deleteFolderRecursive(path.join(cordovaFolder, 'plugins'));
}

exports.addPlatform = async function(platformName) {
  console.log(`Adding cordova ${platformName} platform...`)
  const {
    stdout,
    stderr
} = await exec(`cd ${cordovaFolder} && cordova platform add ${platformName}`);
  if (stderr) {
    console.log(`Error ${platformName} android platform`)
    console.log(stderr)
  }
}

exports.setConfig = async function(platformName) {
  try {
    cordovaConfigFile = fs.readFileSync(path.join(brandFolder, `${platformName}-config.xml`))
    fs.writeFileSync(path.join(cordovaFolder, 'config.xml'), cordovaConfigFile)
    console.log(`Copied cordova.xml for ${BRAND_NAME} brand`)
  } catch (err) {
    console.log(err.message);
    console.log(`Could not load config.xml for the ${BRAND_NAME} brand`);
  }
}