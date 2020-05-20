import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import routes from './routes'

Vue.use(VueRouter)

const Router = new VueRouter({
  /*
   * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
   *
   * If you decide to go with "history" mode, please also set "build.publicPath"
   * to something other than an empty string.
   * Example: '/' instead of ''
   */

  // Leave as is and change from quasar.conf.js instead!
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
  scrollBehavior: () => ({ y: 0 }),
  routes
})

Router.beforeEach((to, from, next) => {
    k('before route: ', to, from, store.state)
    // k('auth: ', store.state.user.authenticated)
    // k('ult: ', Cookies.get('userLoginToken'))

    store.state.comingFrom = from.path
    store.state.goingTo = to.path

    next()
})


export default Router
