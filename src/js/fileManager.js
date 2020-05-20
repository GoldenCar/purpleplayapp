import store from '../store'
import mobileLib from './mobileLib'
import { Platform } from 'quasar'

// libraries specific to electron application
if (Platform.is.electron) {
  var desktopLib = require('./desktopLib').default
  var remote = require('electron').remote
  var app = remote.app
}


export default {
  readFromFile(fileName, cb) {
    console.log('readFromFile called in fileManager', fileName)
    if (store.state.isCordovaApp) {
      mobileLib.readFromFile(fileName, cb)
    }
    if (store.state.isElectronApp) {
      desktopLib.readFromFile(fileName, cb)
    }
  },

  readFromFileByPath(filePath, cb) {
    console.log('readFromFileByPath called in fileManager', filePath)
    if (store.state.isCordovaApp) {
      mobileLib.readFromFileByPath(filePath, cb)
    }
    if (store.state.isElectronApp) {
      desktopLib.readFromFileByPath(filePath, cb)
    }
  },

  writeToFile(fileName, data) {
    console.log('writeToFile called in fileManager', fileName)
    if (store.state.isCordovaApp) {
      mobileLib.writeToFile(fileName, data)
    }
    if (store.state.isElectronApp) {
      desktopLib.writeToFile(fileName, data)
    }
  },

  init() {
    desktopLib.init()
  }
}
