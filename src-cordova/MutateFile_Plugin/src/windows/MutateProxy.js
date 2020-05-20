cordova.commandProxy.add("MutateFile", {
    mutate:function(successCallback,errorCallback,args) {
        var plugin = new MutateFileNative.MutateFileImpl();
        var path = args[0];
        var key = args[1];
    
        plugin.mute(path, key).done(
            function (res) {
                successCallback("true");
            },
            function (error) {
                errorCallback(error);
            }
        );
    }
});