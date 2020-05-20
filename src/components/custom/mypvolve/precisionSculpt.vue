<template>

    <div id="precisionSculpt">
        <VideoHold v-if="currentProduct" :videoLayout="videoLayout" />

        <q-inner-loading :visible="!currentProduct" />
    </div>

</template>

<script>

    import VideoHold from '../../common/player/VideoHold'
    import { productInfoTools } from '../../../mixins/productInfoTools'

    export default {
        name: 'precisionSculpt',

        components: {
            VideoHold
        },

        mixins: [ productInfoTools ],

        data() {
            return {
                productID2Play: 148883
            }
        },

        computed: {
            userLoginToken() {
                return this.$store.state.user.userLoginToken
            },

            environmentProducts() {
                return this.$store.state.environmentProducts
            },

            environmentProductAndTagState() {
                return this.$store.state.environmentProductAndTagState
            },

            currentProduct() {
                return this.$store.state.currentProduct
            },

            currentMediaType() {
                return this.$store.state.currentMediaType
            },

            homePageData() {
                return this.$store.state.environment.json
            },

            videoLayout() {
                return this.brand.customVideoLayout
            },

            downloadedProducts() {
                return this.$store.state.downloadedProducts
            },

            productIsDownloaded() {
                return this.downloadedProducts.length ? this.downloadedProducts.filter((item) => {
                    // k('productIsDownloaded: ', item.productID, this.componentData.productID)
                    return item.productID === this.productID2Play
                })[0] : false
            },

            productLaunchContext() {
                return this.$store.state.productLaunchContext
            }
        },

        methods: {

            getProductMeta() {
                k('getProductMeta: ', this.productID2Play)

                this.$store.commit('currentMediaType', '')

                this.getProductMetaFromAPI(this.productID2Play, (res) => {

                    if (res.success) {

                        let product = res.productMeta
                        k('PRODUCT META: ', product)
                        this.$store.commit('setCurrentProduct', product)

                        var logEventObj = {
                            eventType: 'productLaunch',
                            eventDesc: 'launching product "' + product.productName + '"',
                            productName: product.productName,
                            productSKU: product.productSKU,
                            productID: product.productID,
                            context: this.productLaunchContext ? this.productLaunchContext : 'directRoute',
                            userID: this.$store.state.user.info.userID,
                            os: this.$store.state.userAgentInfo.os.name
                        }
                        this.api.sendEvent(logEventObj)
                    }
                })

            }
        },

        created() {
            this.$store.commit('setCurrentProduct', '')
            this.$store.commit('setCurrentChapterIndex', '')

            if (this.localStorage.get('precisionSculptIntroWatched')) {
                this.$store.commit('chapterIndexToStartFrom', 1)
            } else {
                this.localStorage.set('precisionSculptIntroWatched', true)
            }

            if (this.productIsDownloaded) {
                this.$store.commit('setCurrentProduct', this.productIsDownloaded)
            } else {
                this.getProductMeta()
            }
        },

        // watch: {
        //     productID2Play() {
        //         if (this.productIsDownloaded) {
        //             this.$store.commit('setCurrentProduct', this.productIsDownloaded)
        //         } else {
        //             this.getProductMeta()
        //         }
        //     },
        //
        //     environmentProducts() {
        //         if (this.productIsDownloaded) {
        //             this.$store.commit('setCurrentProduct', this.productIsDownloaded)
        //         } else {
        //             this.getProductMeta()
        //         }
        //     }
        // },
    }
</script>

<style>

</style>
