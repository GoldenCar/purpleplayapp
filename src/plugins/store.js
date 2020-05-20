// import something here
import localStorage from 'store'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.localStorage = localStorage
}
