// import something here
const { ipcRenderer } = require('electron')

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
    Vue.prototype.ipcRenderer = ipcRenderer
}
