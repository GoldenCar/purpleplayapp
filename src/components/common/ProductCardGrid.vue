<template>
    <div style="margin-left: auto; margin-right: auto; padding: 0px 15px;">
        <div class="row gutter-sm">
            <div v-for="product in products" class="col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-auto">
                <div :is="productCard" :componentData="product" />
            </div>
        </div>
    </div>
</template>
<script>
import defaultProductCard from './productCard'

export default {
    props: ['products', 'customProductCardPath'],
    components: {
        defaultProductCard
    },
    data () {
        return {
            productCard: null
        }
    },
    created () {
        if (this.customProductCardPath) {
            this.loadIt('ProductCardGridCustomProductCard', this.customProductCardPath)
            this.productCard = 'ProductCardGridCustomProductCard'
        } else {
            this.productCard = defaultProductCard
        }
    }
}
</script>
