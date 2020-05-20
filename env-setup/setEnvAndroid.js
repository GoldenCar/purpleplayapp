const { removeCordovaPackages, setPackage, setIcon, setSplash, installPackages, setConfig, addPlatform } = require('./setup');

let BRAND_NAME = process.argv[2];

async function prepareProject() {
  await setPackage();
  await setConfig('android');
  await setIcon();
  await setSplash();
  await removeCordovaPackages();
  await installPackages();
  await addPlatform('android');
  console.log(`Finished setting Android enviroment. Selected brand: ${BRAND_NAME}`)
}

prepareProject();
