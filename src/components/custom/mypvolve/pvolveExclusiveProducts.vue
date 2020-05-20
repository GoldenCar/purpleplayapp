<template>

    <div id="pvolveExclusiveProducts" v-if="userHasAccessToAnyShelfItems" :style="`background: ${componentData.backgroundColor ? componentData.backgroundColor : '#fff'};`">
        <div class="row well">

            <h3 class="col-12" align="center" style="margin: 1rem 0;">
                <span :style="`color: ${pvolveMintTitle}; background: ${componentData.backgroundColor ? componentData.backgroundColor : '#fff'}`">{{componentData.heading}}</span>
            </h3>

            <div v-if="exclusiveProducts.length" class="row justify-center full-width">
                <div v-for="(product, index) in exclusiveProducts" :key="index" :class="componentData.columnClass ? componentData.columnClass : 'col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3'" style="padding: .5rem;">
                    <pvolveProductCard class="productCard" :componentData="product" />
                </div>
            </div>
        </div>

    </div>

</template>

<script>
    import pvolveProductCard from './pvolveProductCard'
    import { pvolveColors } from './pvolveColors'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { productInfoTools } from '../../../mixins/productInfoTools'

    import pvolveStructuredProductPreview from './pvolveStructuredProductPreview.vue'

    export default {
        props: [ 'componentData' ],

        components: {
            pvolveProductCard, pvolveStructuredProductPreview
        },

        mixins: [ pvolveColors, userAndProductInfo, productInfoTools ],

        data() {
            return {

            }
        },

        computed: {
            currentProduct() {
                return this.$store.state.currentProduct
            },

            environmentJSON() {
                return this.$store.state.environment.json
            },

            environmentProducts() {
                return this.$store.state.environmentProducts
            },

            authenticated() {
                return this.$store.state.user.authenticated
            },

            exclusiveProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    // k('exclusiveProduct: ', product.productName, product)
                    return product.productType === 'exclusiveContent' && product.userActiveProduct && product.webplayer
                }) : []
            },

            specialProductRoutes() {
                return this.environmentJSON.e.specialProductRoutes
            },

            userHasAccessToAnyShelfItems() {
                let exclusiveProductIDs = this.exclusiveProducts.map((product) => {
                    return product.productID
                })
                return this.userHasAccess(exclusiveProductIDs)
            }
        },

        created() {
            kw('pvolveExclusiveProducts! ', this.exclusiveProducts)
        },

        mounted() {

        },

        watch: {
            environmentProducts() {
                k('exclusiveProducts: ', this.exclusiveProducts)
            },

            currentProduct() {
                kw('currentProduct pvolve: ', this.currentProduct)
            }
        },

        methods: {

        }
    }
</script>

<style>

    .floatingBadge {
        position: absolute;
        right: 0;
        top: 0;
        padding: .25rem .5rem;
        color: #fff;
        font-size: .8rem;
        font-weight: 700;
        border: 2px solid white;
    }

</style>
