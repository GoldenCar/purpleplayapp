import { productInfoTools } from './productInfoTools'

export const productCardDownloadTools = {
    props: ['componentData', 'notSelectable'],

    mixins: [productInfoTools],

    data() {
        return {
            downloadLoader: false
        }
    },

    computed: {
        downloadAllowed() {
            return this.componentData.downloadAllowed
        },

        downloadedImageURL() {
            return this.getLocalURL(this.componentData.productSKU, `${this.productIsDownloaded && this.productIsDownloaded.localCoverImageFileName ? this.productIsDownloaded.localCoverImageFileName : `${this.componentData.productSKU}_image_cover.png`}`).signedURL
        },

        downloadedProducts() {
            return this.$store.state.downloadedProducts
        },

        productDownloadQueue() {
            return this.$store.state.productDownloadQueue
        },

        productFileDownloads() {
            return this.$store.state.productFileDownloads
        },

        currentProductFileDownloadingIndex() {
            var inProgressIndex = this.j_.indexFromArray(this.productFileDownloads, 'status', 'inProgress')
            var queuedIndex = this.j_.indexFromArray(this.productFileDownloads, 'status', 'queued')
            return inProgressIndex !== -1 ? inProgressIndex : queuedIndex
        },

        currentProductFileDownloadingProgress() {
            var downloadItem = this.currentProductFileDownloadingIndex ? this.productFileDownloads[this.currentProductFileDownloadingIndex] : ''
            return downloadItem ? Number(downloadItem.progress.replace('%', '')) : ''
        },

        productIsDownloading() {
            return this.productDownloadQueue.length ? this.productDownloadQueue[0].productID === this.componentData.productID : false
        },

        productIsQueued() {
            return this.productDownloadQueue.length ? this.productDownloadQueue.filter((item) => {
                return item.productID === this.componentData.productID
            })[0] : false
        },

        productIsDownloaded() {
            return this.downloadedProducts.length ? this.downloadedProducts.filter((item) => {
                // k('productIsDownloaded: ', item.productID, this.componentData.productID)
                return item.productID === this.componentData.productID
            })[0] : false
        }
    },

    created() {

    },

    methods: {

        downloadItem(item) {
            k('downloadItem: ', item)

            if (!this.downloadAllowed) return false

            this.downloadLoader = true

            this.getProductMetaFromAPI(item.productID, (res) => {
                this.downloadLoader = false

                if (res.success) {
                    let product = res.productMeta
                    k('PRODUCT META: ', product)

                    if (this.coverImageFileName) product.localCoverImageFileName = this.coverImageFileName

                    this.$store.commit('addProductToDownloadQueue', product)
                    this.startDownloadQueue()

                    var logEventObj = {
                        eventType: 'downloadingProduct',
                        eventDesc: 'user has queued a product for download: ' + product.productName,
                        productName: product.productName,
                        productSKU: product.productSKU,
                        productID: product.productID,
                        userID: this.$store.state.user.info.userID,
                        os: this.$store.state.userAgentInfo.os.name,
                        publisherID: product.publisherID,
                    }
                    this.api.sendEvent(logEventObj)
                }
            })
        }
    },
}
