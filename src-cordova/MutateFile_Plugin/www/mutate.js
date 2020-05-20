var exec = require('cordova/exec');
var platform = require('cordova/platform');
module.exports = {
    mutate: function (fpath, key, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "MutateFile", "mutate", [fpath, key]);
    },
    mutateV2: function (fpath, key, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "MutateFile", "mutateV2", [fpath, key]);
    }
};
