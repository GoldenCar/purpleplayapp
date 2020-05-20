import {
  Platform
} from 'quasar';
import fileManager from '../js/fileManager';

// libraries specific to electron application
if (Platform.is.electron) {
  var electron = require('electron')
  var ipcRenderer = electron.ipcRenderer
  var fs = require('fs')
}

const key = 'DiS9HbhVxXxenq2Qdp9B5fanGPw2QF68';
const keyBuffer = Buffer.from(key);

export default ({
  vueApp,
  router,
  Vue,
  store
}) => {
  Vue.prototype.mutate = (sku, name, cb, encode) => {
    let path = Vue.prototype.getLocalURL(sku, name).signedURL;
    const productStateKey = `${name}.${sku}.mutated`;
    let isMutated = JSON.parse(localStorage.getItem(productStateKey));

    k('mutate called! ', path, encode, isMutated)

    if (encode && isMutated) {
      k('trying to mutate a file that is already mutated! ', path, isMutated)
      cb(true);
      return;
    }

    if (!encode && !isMutated) {
      k('trying to unmutate a file that is already decoded! ', path, isMutated)
      cb(true);
      return;
    }

    if (Platform.is.electron) {
      mutateFileElectron();
    } else if (Platform.is.cordova) {
      mutateFileCordova()
    }

    function mutateFileElectron() {
      // get the file chunk
      const fd = fs.openSync(path.replace('file://', ''), 'rs+');
      const fileChunkBuffer = Buffer.from(key);
      fs.readSync(fd, fileChunkBuffer, 0, key.length, 0);

      for (let i = 1; i < key.length; i++) {
        for (let j = key.length * (i - 1); j < key.length * i; j++) {
          fileChunkBuffer[j] = fileChunkBuffer[j] ^ keyBuffer[j];
        }
      }
      // write mutated string
      fs.writeSync(fd, fileChunkBuffer, 0, key.length, 0);
      fs.closeSync(fd);
      localStorage.setItem(productStateKey, !isMutated);
      cb && cb(true);
    }

    function mutateFileCordova() {
      path = Vue.prototype.getCordovaFileURL(sku, name);

      MutateFile.mutate(path, key, (message) => {
        k("mutate success: ", message)
        localStorage.setItem(productStateKey, !isMutated);
        cb && cb(true)
      }, () => {
        k('MUTATION ERROR!')

        api.sendEvent({
          eventType: 'fileMutationError',
          eventDesc: 'mutation error: ' + key,
          path: path,
        })

        cb && cb(false)
      })
    }
  }
}
