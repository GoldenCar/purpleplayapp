import store from '../store'
const { ipcRenderer } = require('electron')
const { app } = require('electron').remote
const path = require('path')
const fs = require('fs');
import Vue from 'vue';


export default {

    readFromFileByPath(filePath, cb) {
        fs.readFile(filePath, 'utf8', (err, output) => {
            if (err) {
                return cb(false)
            }
            if (output) {

                //TODO: may need to support more than just js files
                let fileExtensionREGEX = /(?:\.([^.]+))?$/

                if (fileExtensionREGEX.exec(filePath)[1] === 'js') {
                    return cb(JSON.parse(output))
                } else {
                    return cb(output)
                }
            }

            cb(false)
        })
    },

    readFromFile(fileName, cb) {
        let filePath = path.join(app.getPath('appData'), store.state.currentBrand.appName, fileName)

        this.readFromFileByPath(filePath, cb)
  },

  writeToFile(fileName, data) {
    let filePath = path.join(app.getPath('appData'), store.state.currentBrand.appName, fileName)

    fs.writeFileSync(filePath, JSON.stringify(data));
    console.log(fileName, 'saved')
  },

  init() {
     var filePath = path.join(app.getPath('appData'), store.state.currentBrand.appName)

     //check for main PurplePlayer folder
     fs.readdir(app.getPath('appData'), (err, files) => {
         //and if it doesnt exist
         if (files.indexOf(store.state.currentBrand.appName) === -1) {
             //create it
             fs.mkdir(filePath, () => {
                 this.initDownloads()
             })
         } else {
             this.initDownloads()
         }
     })
   },

   initDownloads() {
     var filePath = path.join(app.getPath('appData'), store.state.currentBrand.appName)

     fs.readdir(filePath, (err, files) => {
         console.log(files);

         if (files.indexOf('downloads') === -1) {
             fs.mkdir(filePath + '/downloads', () => {
                 console.log('downloads dir created')
             })
         } else {
             console.log('downloads dir exists')
         }
       })
     },

    createProductFolder(SKU, cb) {
        k('createProductFolder: ', SKU)

        let filePath = Vue.prototype.getDownloadsPath();

        fs.readdir(filePath, (err, files) => {
            console.log('download dirs: ');
            console.log(files);

            if (files.indexOf(SKU) === -1) {
                fs.mkdir(path.join(filePath, SKU), () => {
                   console.log('SKU dir created')

                   filePath = path.join(filePath, SKU)
                   cb(filePath)
                })
           } else {
                console.log('SKU dir exists')

                filePath = path.join(filePath, SKU)
                cb(filePath)
           }
       })
     }
}
