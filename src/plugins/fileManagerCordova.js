// import something here
import mobileLib from '../js/mobileLib'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
    Vue.prototype.fileManager = mobileLib
}
