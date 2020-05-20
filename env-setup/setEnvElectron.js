const { removeCordovaPackages, setPackage, setIcon, installPackages } = require('./setup');

let BRAND_NAME = process.argv[2];


async function prepareProject() {
  await removeCordovaPackages();
  await setPackage();
  await setIcon();
  await installPackages();
  console.log(`Finished setting electron enviroment. Selected brand: ${BRAND_NAME}`)
}

prepareProject();
