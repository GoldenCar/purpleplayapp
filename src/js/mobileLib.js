import store from '../store'

export default {
    errorHandler(fileName, e) {
        var msg = '';

        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'Storage quota exceeded';
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'File not found';
                break;
            case FileError.SECURITY_ERR:
                msg = 'Security error';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'Invalid modification';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'Invalid state';
                 break;
            default:
                msg = 'Unknown error';
                break;
        };

        k('Error (' + fileName + '): ' + msg);
    },

    readFromFileByPath(filePath, cb) {
        window.resolveLocalFileSystemURL(filePath, (fileEntry) => {
            k('fileEntry: ', fileEntry)
            fileEntry.file((file) => {
                k('file: ', file)
                var reader = new FileReader();
                reader.onloadend = function(e) {
                    var result = this.result
                    k('result: ', result)
                    if (cb && result) {
                      try {
                        var retval = JSON.parse(result);
                        cb(retval);
                      } catch (e) {
                        cb(result)
                      }
                    } else if (cb && !result) {
                        cb(false)
                    }
                };

                reader.readAsText(file);
            }, (e) => {
                ke('readFromFile error: ', e)
                if (cb) cb(false);
            });
        }, (e) => {
            ke('readFromFile error: ', e)
            if (cb) cb(false);
        });
    },

    readFromFile(fileName, cb) {
        k('readFromFile: ', fileName)
        if (!store.state.isCordovaApp) {
            k('CANNOT READ FROM FILE: NOT CORDOVA APP.')
            cb(false)
            return false
        }

        var pathToFile = cordova.file.dataDirectory + fileName
        k('pathToFile: ', pathToFile)

        this.readFromFileByPath(pathToFile, cb);
    },

    writeToFile(fileName, data) {
        k('writeToFile: ', fileName, data)
        if (!store.state.isCordovaApp) {
            k('CANNOT WRITE TO FILE: NOT CORDOVA APP.')
            return false;
        }

        data = JSON.stringify(data, null, '\t');
        k('writeToFile stringified data: ', data)

        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, (directoryEntry) => {
            directoryEntry.getFile(fileName, { create: true }, (fileEntry) => {
                fileEntry.createWriter((fileWriter) => {
                    fileWriter.onwriteend = (e) => {
                        // for real-world usage, you might consider passing a success callback
                        k('Write of file "' + fileName + '" completed.');
                    };

                    fileWriter.onerror = (e) => {
                        // you could hook this up with our global error handler, or pass in an error callback
                        k('Write failed: ' + e.toString());
                    };

                    var blob = new Blob([data], { type: 'text/plain' });
                    fileWriter.seek(0);
                    fileWriter.write(blob);
                }, (e) => {
                    ke('writeToFile error: ', e)
                });
            }, (e) => {
                ke('writeToFile error: ', e)
            });
        }, (e) => {
            ke('writeToFile error: ', e)
        });
    },
}
