// import something here
const brand = require(process.env.BRAND_INDEX_FILE).brand

// leave the export, even if you don't use it
export default ({ app, router, Vue, store }) => {
    Vue.prototype.brand = brand
}
