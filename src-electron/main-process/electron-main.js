import electron, { app, BrowserWindow, ipcMain, Menu } from 'electron'
const { download } = require('electron-dl')
const fs = require('fs');
const path = require('path')
const {autoUpdater} = require("electron-updater");
const PDFWindow = require('electron-pdf-window')
const jetpack = require('fs-jetpack');

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = require('path').join(__dirname, 'statics').replace(/\\/g, '\\\\')
}

ipcMain.setMaxListeners(0)

let mainWindow
let downloadItem
let currentBrand

// Deep linked url
let deeplinkingUrl

// Define the menu
let template = []
if (process.platform === 'darwin') {
  // OS X
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() { app.exit(); }
      },
    ]
  }, {
    label: "Edit",
    submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]
  })
}


// Force Single Instance Application
const shouldQuit = app.makeSingleInstance((argv, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.

  // Protocol handler for win32
  // argv: An array of the second instance’s (command line / deep linked) arguments
  if (process.platform == 'win32') {
    // Keep only command line / deep linked arguments
    deeplinkingUrl = argv.slice(1)
  }
  if (deeplinkingUrl) {
    redirectToLink(deeplinkingUrl);
  }

  if (mainWindow) {
    // an instance of app already exists
    if (mainWindow.isMinimized()) {
      // restore the window
      mainWindow.restore()
    }
    // focus on window
    mainWindow.focus()
  }
})

if (shouldQuit) {
    app.exit()
}

function createWindow () {
  let screenSize = electron.screen.getPrimaryDisplay().size;
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: Math.min(...[screenSize.width  - 50, 1460]),
    height: Math.min(...[screenSize.height - 50, 1080]) ,
    useContentSize: true,
    webPreferences: {
      // disable web security for development mode to display files
      webSecurity: process.env.PROD
    }
  })

//  mainWindow.webContents.openDevTools();

 mainWindow.loadURL(process.env.APP_URL)

  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.show()
    if (deeplinkingUrl) {
      redirectToLink(deeplinkingUrl)
    }
  });

  mainWindow.webContents.on('new-window', function(event, url) {
    if (url != mainWindow.webContents.getURL()) {
      event.preventDefault()
      electron.shell.openExternal(url)
    }
  });

    // Protocol handler for win32
  if (process.platform == 'win32') {
    // Keep only command line / deep linked arguments
    deeplinkingUrl = process.argv.slice(1)
  }

  mainWindow.on('closed', () => {
      mainWindow = null
  })

  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    downloadItem = item

    item.on('updated', (event, state) => {
      console.log('updated triggerred', item.getState())
      if (state === 'interrupted') {
        // console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          // console.log('Download is paused')
        } else {
          // console.log(`Received bytes: ${item.getReceivedBytes()}`)
          try {
            if (item && webContents && mainWindow) webContents.send('download-progress', { progress: item.getReceivedBytes(), total: item.getTotalBytes() })
          } catch (e) {
            console.log('error caught sending download-progress')
            console.log(e)
          }
        }
      }
    })

    item.once('done', (event, state) => {
      console.log('done triggerred')
      downloadItem = null

      if (state === 'completed') {
        console.log('Download successfully')
        if (webContents && state && mainWindow) webContents.send('download-done', { success: true, state })
      } else {
        console.log(`Download failed: ${state}`)
        if (webContents && state && mainWindow) webContents.send('download-done', { success: false, state })

        let downloadDir = path.parse(item.getSavePath()).dir
        if (downloadDir.includes(currentBrand.appName) && downloadDir.includes('downloads')) {

          // Once inside done event handler the file may still be in use by the OS, so deletion will fail.
          // This loop tries again until it reaches a successful delete.
          let deleted = false

          while (!deleted) {
            try {
              jetpack.remove(downloadDir);
              deleted = true
            } catch(e) {
              console.log('caught delete folder Error')
            }
          }
        }
      }
    })
  })

}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.exit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// Protocol handler for osx
app.on('open-url', function (event, url) {

  event.preventDefault()
  deeplinkingUrl = url
  redirectToLink(url);
  if (mainWindow) {
    // window already exists
    if (mainWindow.isMinimized()) {
      // restore window if minimized
      mainWindow.restore()
    }
    // focus on window
    mainWindow.focus()
  } else {
    if (app.isReady()) {
      // this is an old instance of app
      // create the window
      createWindow();
    }
  }
})


function redirectToLink(deeplinkingUrl) {
  const url = deeplinkingUrl.toString()
  logEverywhere('redirecting to ' + url);
  if (mainWindow) {
    mainWindow.webContents.send('setRoute', url);
  }
}

// Log both at dev console and at running node console instance
function logEverywhere(s) {
  console.log(s)
  if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.executeJavaScript(`console.log("${s}")`)
  }
}

ipcMain.on('set-brand', (e, brand) => {
  currentBrand = brand
  // Define custom protocol handler. Deep linking works on packaged versions of the application!
  app.setAsDefaultProtocolClient(currentBrand.appName)
})

ipcMain.on('download', (e, args) => {
  console.log('ipcmain download event was triggered', args)

  let options = {
    directory: args.uploadDir
  }

  if (args.fileName) {
    options.filename = args.fileName
  }

  download(mainWindow, args.url, options)
    .then(dl => {
      console.log('DOWNLOAD SAVE PATH: ')
      console.log(dl.getSavePath())
    })
    .catch(console.error)
})

ipcMain.on('cancel-download', (event, productSKU) => {
  console.log('cancel-download inside electron-main triggered')
  if (downloadItem) {
    downloadItem.cancel()
  }
})

ipcMain.on('open-pdf', (e, pdfURL) => {
  console.log('pdf url in ipc-main', pdfURL)
  const win = new PDFWindow({
    width: 800,
    height: 600
  })

  win.loadURL(pdfURL)
})

app.on('ready', () => {
  // Create the Menu

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  createWindow();
})

app.on('ready', function()  {
  autoUpdater.checkForUpdatesAndNotify();

});


autoUpdater.on('checking-for-update', () => {
  logEverywhere('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  logEverywhere('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  logEverywhere('Update not available.');
})
autoUpdater.on('error', (err) => {
  logEverywhere('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  logEverywhere(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  logEverywhere('Update downloaded');
});
