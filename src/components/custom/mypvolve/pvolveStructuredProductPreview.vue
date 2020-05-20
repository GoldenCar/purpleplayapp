<template>

    <div id="pvolveStructuredProductPreview">
        <q-inner-loading :visible="!currentProduct" />

        <div v-if="currentProduct" style="padding: 1rem;">

            <img :src="coverImageURL(currentProduct)" style="max-width: 100%; margin: 0 auto; display: block;" />

            <h5 class="thickHeader monty" :style="`color: ${pvolveSalmon}; margin-top: .5rem;`">{{currentProduct.productName}}</h5>
            <div id="longDescription" v-html="currentProduct.moreInfo" style="line-spacing: 2rem;" />

            <pvolveCommentPreview v-if="commentLength" :commentLength="commentLength" :previewComment="previewComment" @readAllReviews="scrollToReviews()" />

        </div>

        <div id="commentsDisplay" v-if="showComments" class="col-12">
            <CommentsDisplay :previewMode="true" @comments="generateCommentQuickLook" :ratingImageSrc="'statics/mypvolve/PLV010-17_PeachIcon_CMYK.png'" />
        </div>
    </div>


</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { pvolveShopifyData } from './pvolveShopifyData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { productInfoTools } from '../../../mixins/productInfoTools'
    import { productPreviewTools } from '../../../mixins/productPreviewTools'

    import CommentsDisplay from '../../common/comments/CommentsDisplay.vue'
    import PvolveCommentPreview from './pvolveCommentPreview.vue'

    export default {
        props: [ 'componentData' ],

        components: {
            CommentsDisplay, PvolveCommentPreview
        },

        mixins: [ pvolveColors, userAndProductInfo, productInfoTools, pvolveShopifyData, productPreviewTools ],

        data() {
            return {
                showComments: false,
                commentLength: 0,
                previewComment: '',

                coverImageURL(item) {
                    return `https://vault.platformpurple.com/static/previews/${item.productSKU}/${item.productSKU}_500px_cover.png`
                }
            }
        },

        computed: {
            currentProduct() {
                return this.$store.state.currentProduct
            },

            productPreviewData() {
                return this.$store.state.productPreviewData
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

            userSubscriptionProductStatusHistory() {
                return this.$store.state.userSubscriptionProductStatusHistory
            },

            subscriptionAccessType() {
                return this.userSubscriptionProductStatusHistory &&
                    this.userSubscriptionProductStatusHistory.length ?
                    this.userSubscriptionProductStatusHistory[0].accessType : ''
            },

            structuredProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    return product.tags.includes('5763')
                }) : []
            },

            userOwned() {
                return this.currentProduct.userActiveProduct
            },
        },

        created() {
            kw('pvolveStructuredProduct preview: ', this.productPreviewData)
        },

        // mounted() {
        //     let userCameFromPvolveStructuredProducts = this.localStorage.get('userCameFromPvolveStructuredProducts')
        //     kw('userCameFromPvolveStructuredProducts: ', userCameFromPvolveStructuredProducts)
        //
        //     if (userCameFromPvolveStructuredProducts) {
        //         this.$nextTick(() => {
        //             this.scrollIt('pvolveStructuredProducts', '', 50)
        //             this.localStorage.set('userCameFromPvolveStructuredProducts', false)
        //         })
        //     }
        // },

        watch: {
            environmentProducts() {
                k('structuredProducts: ', this.structuredProducts)
            },

            productPreviewData() {
                kw('productPreviewData pvolve: ', this.productPreviewData)
                this.$store.commit('setCurrentProduct', this.productPreviewData)
                // this.getShopifyProductDataIfNeeded()
                this.showComments = true
            }
        },

        methods: {
            generateCommentQuickLook(comments) {
                k('generateCommentQuickLook: ', comments)
                this.commentLength = comments.length
                this.previewComment = comments.length ? comments[0] : ''
            },

            scrollToReviews() {
                var container = '#structuredProductDetails .scroll'
                this.scrollIt('commentsDisplay', container)
            }
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
