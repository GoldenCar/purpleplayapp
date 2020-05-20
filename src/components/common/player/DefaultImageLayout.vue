<template>

    <div class="position-relative">
        <MediaMenu style="border-bottom: 1px solid #ccc;" />

        <div class="well">
          <img class="image-product" :src="imgSrc">
        </div>
    </div>

</template>

<script>
    import MediaMenu from './MediaMenu'

    export default {
        props: [],

        components: {
            MediaMenu
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
                    return item.productID == this.currentProduct.productID
                })[0] : false
            }
        },

        data () {
            return {
                imgSrc: ''
            }
        },

        created () {
          this.getImage()
        },

        methods: {
            getImage() {
                if (this.productIsDownloaded) {
                    let fileName = this.currentProduct.productJSON.image[0].fileName
                    let productId = this.currentProduct.productSKU || this.currentProduct.id

                    let localURL = this.getLocalURL(productId, fileName).signedURL
                    this.imgSrc = localURL
                } else {
                    this.imgSrc = this.currentProduct.productJSON.image[0].uri
                }
            }
        }
    }
</script>

<style>
.image-product {
  width: 100%;
}
</style>
