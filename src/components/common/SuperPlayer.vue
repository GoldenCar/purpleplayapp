<template>

    <div>
        <div v-if="currentMediaType">
            <div v-if="currentMediaType === 'html5'" :is="html5Component"></div>

            <VideoHold v-if="currentMediaType === 'video'" :videoLayout="videoLayout" ></VideoHold>

            <AudioHold v-if="currentMediaType === 'audio'"></AudioHold>

            <div :is="eBookReader" v-if="currentMediaType === 'ebook'" />

            <PDFHold v-if="currentMediaType === 'pdf'"></PDFHold>

            <InteractivePageHold v-if="currentMediaType === 'zip'"></InteractivePageHold>

            <DefaultTextLayout v-if="currentMediaType === 'text'"></DefaultTextLayout>

            <DefaultImageLayout v-if="currentMediaType === 'image'"></DefaultImageLayout>
        </div>
    </div>

</template>

<script>

    import VideoHold from './player/VideoHold'
    import AudioHold from './player/AudioHold'
    import PDFHold from './player/PDFHold'
    import InteractivePageHold from './player/InteractivePageHold'
    import DefaultEBookReader from './player/DefaultEBookReader'
    import DefaultVideoLayout from './player/DefaultVideoLayout'
    import DefaultTextLayout from './player/DefaultTextLayout'
    import DefaultImageLayout from './player/DefaultImageLayout'

    import { productInfoTools } from '../../mixins/productInfoTools'
    import { social } from '../../mixins/social'
    import { EKBTools } from '../custom/discoveryekb/EKBTools'

    export default {
        name: 'superPlayer',

        props: ['productID2Play'],

        components: {
            VideoHold,
            AudioHold,
            PDFHold,
            InteractivePageHold,
            DefaultEBookReader,
            DefaultVideoLayout,
            DefaultTextLayout,
            DefaultImageLayout
        },

        mixins: [ productInfoTools, social, EKBTools ],

        data() {
            return {
                html5Component: '',
                eBookReader: ''
            }
        },

        computed: {
            userLoginToken() {
                return this.$store.state.user.userLoginToken
            },

            userInfo() {
                return this.$store.state.user.info
            },

            userAgentInfo() {
                return this.$store.state.userAgentInfo
            },

            environmentProducts() {
                return this.$store.state.environmentProducts
            },

            environmentProductAndTagState() {
                return this.$store.state.environmentProductAndTagState
            },

            userActiveProducts() {
                return this.$root.$store.state.userActiveProducts
            },

            userActiveProductState() {
                return this.$root.$store.state.userActiveProductState
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

            downloadedProducts() {
                return this.$store.state.downloadedProducts
            },

            productIsDownloaded() {
                return this.downloadedProducts.length ? this.downloadedProducts.filter((item) => {
                    return item.productID == this.productID2Play
                })[0] : false
            },

            videoLayout() {
                return this.brand.customVideoLayout || DefaultVideoLayout
            },

            productFormats() {
                return this.$store.state.productFormats
            },

            currentProductFormat() {
                let currentProductFormat
                let currentProductTagIDArr

                if (this.currentProduct && this.currentProduct.tags) {
                    if (this.currentProduct.tags.indexOf(',') > -1) {
                        currentProductTagIDArr = this.currentProduct.tags.split(',')
                    } else {
                        currentProductTagIDArr = [this.currentProduct.tags]
                    }
                }

                if (currentProductTagIDArr && currentProductTagIDArr.length) {
                    currentProductFormat = currentProductTagIDArr.filter((tagID) => {
                        return this.productFormats[String(tagID)]
                    })[0]
                }

                k('currentProductTagIDArr: ', currentProductTagIDArr)
                k('currentProductFormat: ', currentProductFormat)

                return currentProductFormat
            }
        },

        methods: {

            getProductMeta() {
                k('getProductMeta: ', this.productID2Play)

                this.$store.commit('currentMediaType', '')

                // this.getProductMetaFromAPI(product, (res) => {
                this.getProductMetaFromAPI(this.productID2Play, (res) => {
                    if (res.success) {
                        let product = res.productMeta
                        k('PRODUCT META: ', product)

                        this.productLaunch(product)
                    }
                })
            },

            routeToCorrectMedia() {
                let product = this.currentProduct
                k('WHAT PRODUCT AM I? : ', product)

                let productJSON = product.productJSON

                switch (true) {
                    // todo: add html5 products to app?
                    // case (productJSON.html && Object.keys(productJSON.html).length > 0):
                    //     // this is an html products
                    //     k('is html5')
                    //     this.launchHTMLComponent()
                    // break;

                    case ((productJSON.booklength && productJSON.booklength !== 0) || productJSON.ebook):
                        k('is book')
                        this.$store.commit('currentMediaType', 'ebook')
                    break;

                    default:
                        if (productJSON) {
                            if (productJSON.video) {
                                k('is video')
                                this.$store.commit('currentMediaType', 'video')
                            }
                            else if (productJSON.audio) {
                                k('is audio')
                                this.$store.commit('currentMediaType', 'audio')
                            }
                            else if (productJSON.text) {
                                k('is text')
                                this.$store.commit('currentMediaType', 'text')
                            }
                            else if (productJSON.image) {
                                k('is image')
                                this.$store.commit('currentMediaType', 'image')
                            }
                            else if (productJSON.pdf) {
                                k('is pdf')
                                this.$store.commit('currentMediaType', 'pdf')
                            }
                            else if (productJSON.zip) {
                                k('is zip')
                                this.$store.commit('currentMediaType', 'zip')
                            }
                        }
                }
            },

            launchHTMLComponent() {
                var product = this.currentProduct
                // k('PRODUCT: ', product)

                // api.sendEvent({
                //     'eventType': 'launchCustomHTMLComponent',
                //     'productSKU': product.productSKU,
                //     'productID': product.productID,
                //     'eventDesc': 'launching html component for ' + product.productName
                // })

                var componentName = product.productJSON.html.customComponentName
                var componentPath = 'customComponents/' + product.productJSON.html.customComponentFile.replace('.html', '')
                // k('launchHTMLComponent: ', componentName, componentPath)

                this.loadIt(componentName, componentPath)
                this.html5Component = componentName
                this.$store.commit('currentMediaType', 'html5')

                // var loadObj = {}
                //     loadObj[product.productJSON.html.customComponentName] = product.productJSON.html.customComponentFile

                // purpleLib.loadCustomComponent(loadObj, () => {
                //     k('now switching to html5 component')
                //     // self.root.set('html5Product', true)
                //     // self.root.set('scene', product.productJSON.html.customComponentName)
                //     this.$store.commit('currentMediaType', 'html5')
                // })
            },

            productLaunch(product) {
                this.$store.commit('setCurrentProduct', product)
                this.routeToCorrectMedia()

                let contentType = this.currentProductFormat

                if (this.brand.environmentName === 'ekb') {
                    contentType = this.getEKBProductTypeIcon(product);
                }

                var logEventObj = {
                    eventType: 'productLaunch',
                    eventDesc: `launching product "${product.productName}"`,
                    productName: product.productName,
                    productSKU: product.productSKU,
                    productID: product.productID,
                    userID: this.userInfo.userID,
                    os: this.userAgentInfo.os.name,
                    contentType: contentType,
                    fileAccessType: this.productIsDownloaded ? 'local' : 'streaming',
                    sceneContext: this.sceneContext(this.$route.fullPath),
                    context: this.$store.state.productLaunchContext
                }
                this.api.sendEvent(logEventObj)

                if (this.brand.includeSocialLogin && this.brand.includeSocialLogin.facebookAppID) this.fbLogEvent('fb_mobile_content_view', {
                    'fb_content_id': product.productID,
                    'fb_description': `launching product "${product.productName}"`,
                }, null)
            }
        },

        created() {

            k('created SUPERPLAYER')
            this.eBookReader = this.brand.customEbookLayout ||'DefaultEBookReader'

            k('superPlayer productID: ', this.productID2Play)
            k('superPlayer productIsDownloaded: ', this.productIsDownloaded)

            if (this.productIsDownloaded) {
                this.productLaunch(this.productIsDownloaded)
            } else {

                // TODO: Make abstraction when we think of a better one
                if (this.brand.environmentName === 'ekb') {
                    this.getDiscoveryProductInfo(this.productID2Play, (res) => {
                        if (!res.success) {
                            this.$q.notify({
                                message: 'An unknown error occured.',
                                type: 'negative',
                                icon: 'fas fa-exclamation-circle',
                                position: 'bottom-left'
                            });
                            this.$store.commit('addKeyPathInStore', {
                                keyPath: 'selectedProductModal',
                                value: null
                            })
                            return;
                        }

                        if (!res.asset) {
                            this.$q.notify({
                                message: 'Problem accessing product.',
                                type: 'negative',
                                icon: 'fas fa-exclamation-circle',
                                position: 'bottom-left'
                            });
                            this.$store.commit('addKeyPathInStore', {
                                keyPath: 'selectedProductModal',
                                value: null
                            })
                            return;
                        }
                        let product = this.conformEKBAsset(res.asset)
                        this.productLaunch(product)
                    })
                } else {
                    this.getProductMeta((product) => {
                        if (product) {
                            this.productLaunch(product)
                        }
                    })
                }

            }

        }
    }
</script>

<style>

</style>
