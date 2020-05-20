#!/bin/sh
echo building...
cd ../..
git checkout dev
git submodule init
git submodule update
cp brands/discoveryekb/index.js src/client/index.js
cp brands/discoveryekb/package.json package.json
npm prune
npm i
cd src-cordova
cordova platform add android
cd ..
quasar build -m cordova -T android
