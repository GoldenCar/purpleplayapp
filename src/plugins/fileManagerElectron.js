// import something here
import desktopLib from '../js/desktopLib'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
    Vue.prototype.fileManager = desktopLib
}
