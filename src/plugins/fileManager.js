// import something here
import fileManager from '../js/fileManager.js'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
    Vue.prototype.fileManager = fileManager
}
