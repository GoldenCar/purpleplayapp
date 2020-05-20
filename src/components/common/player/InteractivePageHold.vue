<template>
    <div style="background: #efefef;">
        <MediaMenu />
        <div v-if="$store.state.isElectronApp">
            <webview :src="productUrl" style="width: 100vw; height: 500px"></webview>
        </div>
    </div>
</template>

<script>
    import MediaMenu from './MediaMenu'

    export default {
        components: {
            MediaMenu
        },

        data() {
            return {
                productUrl: ''
            }
        },

        computed: {
            currentProduct() {
                return this.$store.state.currentProduct
            },

            downloadedProducts() {
                return this.$store.state.downloadedProducts
            },

            productIsDownloaded() {
                return this.downloadedProducts.length ? this.downloadedProducts.filter((item) => {
                    return item && (item.productID == this.currentProduct.productID)
                })[0] : false
            }
        },

        methods : {
            launchPage(product) {
                if (this.productIsDownloaded) {
                    // get the file url
                    if (this.$store.state.isCordovaApp) {
                        this.productUrl = `cdvfile://localhost/library-nosync/${product.productSKU}/${product.fileName.replace('.zip', '')}/index.html`;
                    } else if (this.$store.state.isElectronApp) {
                        this.productUrl = `${this.getLocalURL(product.productSKU, product.fileName).signedURL.replace('.zip', '')}/index.html`
                    }
                } else {
                    // return the streaing url
                    this.productUrl = product.streamingURL
                }

                if (this.$store.state.isCordovaApp) {
                    const showLocation = this.platformID === 'android' ? 'yes' : 'no';
                    window.open(this.productUrl, '_blank', `location=${location}`)
                }
            }
        },

        created() {
            if (this.currentProduct.productJSON.zip && this.currentProduct.productJSON.zip.length === 1){
                this.launchPage(this.currentProduct.productJSON.zip[0])
            }
        }
    }
</script>

<style>

</style>
