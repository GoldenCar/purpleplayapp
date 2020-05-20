<template>
    <div v-if="freeProducts && freeProducts.length" class="row full-width">
        <div class="col-12" align="center">
            <h6>{{brand.freeProductsRowTitle || 'Free videos!'}}</h6>
            <hr />
        </div>

        <div class="row inline justify-center col-12" style="padding-bottom: 1rem;">
            <q-inner-loading :visible="showLoader" />

            <div v-if="environmentProductAndTagState && !showLoader" v-for="item in displayProducts" :class="`${brand.freeProductsRowCardClass ? brand.freeProductsRowCardClass : 'col-xs-12 col-sm-6 col-md-4 col-lg-3'}`" style="padding: .5rem;">
                <div :is="freeProductCard" :componentData="item" :freeProduct="true" />
            </div>
        </div>
    </div>
</template>

<script>
    import defaultFreeProductCard from './freeProductCard'

    export default {

        components: {
            defaultFreeProductCard
        },

        data() {
            return {

            }
        },

        computed: {

            showLoader() {
                return this.environmentProductAndTagState.indexOf('fetching') > -1 ? true : false
            },

            freeProducts() {
                return this.$root.$store.state.freeProducts
            },

            previewProducts() {
                return this.$root.$store.state.previewProducts
            },

            authenticated() {
                return this.$root.$store.state.user.authenticated
            },

            displayProducts() {
                return this.authenticated ? this.previewProducts.concat(this.freeProducts) : this.previewProducts
            },

            environmentProductAndTagState() {
                return this.$store.state.environmentProductAndTagState
            },

            freeProductCard() {
                return this.brand.clientFreeProductCard || this.brand.clientProductCard || defaultFreeProductCard
            }
        },

        methods: {
            launchIt(item) {
                var isPreviewProduct = this.previewProducts.filter((product) => {
                    return product.productID == item.productID
                })
                k('launchIt: ', isPreviewProduct)

                if (isPreviewProduct.length) {
                    this.launchFreeProduct(item)
                } else {
                    this.launchProduct(item)
                }
            }
        },

        watch: {
            previewProducts() {
                k('previewProducts: ', this.previewProducts)
                k('environmentProductAndTagState: ', this.environmentProductAndTagState)
                k('showLoader: ', this.showLoader)
            }
        },

        created() {

        }
    }
</script>

<style>
</style>
