# Cordova Mutate File Plugin

Cordova plugin for ios and android to mutate file with key.

## Using
Clone the plugin

    $ git clone https://github.com/platformpurple/MutateFile_Plugin

Create a new Cordova Project

    $ cordova create hello com.example.helloapp Hello
    
Install the plugin which is required to use this plugin first.

    $ cd hello
    $ cordova plugin add cordova-plugin-file
    $ cordova plugin add cordova-plugin-file-transfer

Install this plugin.

    $ cordova plugin add https://github.com/platformpurple/MutateFile_Plugin
    

Sample code to use this plugin.
Edit `www/index.html`.

```js
        // Wait for device API libraries to load
        //
        document.addEventListener("deviceready", onDeviceReady, false);
            
        // device APIs are available
        //
        function onDeviceReady() {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
        }

        function gotFS(fileSystem) {
            fileSystem.root.getFile("depth of field 2.mp4", null, gotFileEntry, fail);
        }

        function gotFileEntry(fileEntry) {
            var filepath = fileEntry.toURL();
            MutateFile.mutate(filepath,"idbguvmeoc34gjn68dnvid9gun8sn4uf9", success, fail);
            // 4 parameters, 1-filepath, 2-32characters key, success call back, fail call back
        }

        function success(message)  {
            alert(message);
        }
        
        function fail(){
            alert("error");
        }
```

Install iOS or Android platform

    cordova platform add ios
    cordova platform add android
    cordova build ios
    cordova build android

Run the code

    cordova run 

## More Info

contact frankbakker8810@yahoo.com
contact dan@platfomrpurple.com