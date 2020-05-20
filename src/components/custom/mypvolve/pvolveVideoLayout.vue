<template>

    <div id="pvolveVideoLayout" class="row">

        <div class="col-12 row">

            <div v-if="userOwned" class="col-12">
                <q-btn id="backToLibrary" @click="exitMedia()" flat :style="`color: ${pvolveSalmon}; margin-top: .5rem;`">
                    <q-icon name="fas fa-chevron-left" style="margin-right: .5rem;" />
                    <h6>Back</h6>
                </q-btn>
            </div>

            <div v-if="userOwned" :class="`col-sm-12 ${!appOffline || (appOffline && chapters.length > 1) ? 'col-lg-6' : ''}`" style="padding: 1rem;">

                <purple-video
                    ref="videoPlayer"
                    id="watch"
                    :options="pvolvePlayerOptions"
                    v-if="pvolvePlayerOptions.sources && pvolvePlayerOptions.sources.length"
                    @play="onPlayerPlay($event)"
                    @pause="onPlayerPause($event)"
                    @loadeddata="onPlayerLoadeddata($event)"
                    @playing="onPlayerPlaying($event)"
                    @timeupdate="onPlayerTimeupdate($event)"
                    @ended="onPlayerEnded($event)"
                    @error="onPlayerError($event)"
                    @ready="$emit('playerReady')"
                />

                <div v-if="chapters.length > 1" align="center">
                    <h5 :style="`color: ${pvolveSalmon};`">{{ currentChapter.displayName }}</h5>
                </div>

                <div v-if="currentProduct.productJSON && chapters.length > 1" style="border-top: 1px solid #eee; margin: 1rem 0;">
                    <h4 :style="`color: ${pvolveSalmon};`">Chapters</h4>
                    <div v-for="(chapter, index) in chapters">
                        <q-btn @click="chapterTap(index)" color="grey-5" class="full-width" style="border: solid 1px #ccc; margin: .3rem 0;">
                            <q-icon name="fas fa-play" style="margin-right: .5rem; font-size: 1rem;" />
                            <span class="monty">{{ chapter.displayName }}</span>
                        </q-btn>
                    </div>
                </div>

            </div>

            <!-- <div v-if="!userOwned" class="col-sm-12 col-lg-6" style="padding: 1rem;">
                <img :src="coverImageURL" style="max-width: 100%; margin: 0 auto; display: block;" />
            </div> -->

            <div :class="`col-sm-12 ${!appOffline || (appOffline && chapters.length > 1) ? 'col-lg-6' : ''}`" style="padding: 1rem;">

                <h5 :style="`letter-spacing: -1px; color: ${pvolveMintTitle}; text-transform: none; margin-top: 0;`" class="monty">{{currentProduct.productName || productPreviewData.productName}}</h5>
                <p id="longDescription" v-html="currentProduct.moreInfo" style="margin-top: 1rem; line-spacing: 2rem;"></p>

                <!--<h5 :style="'letter-spacing: -1px; color: ' + pvolveMintTitle + '; text-transform: none;'" class="monty">Equipment used</h5>-->
                <!--<p>{{equipmentUsed}}</p>-->

                <!-- <div id="sharing">
                    <h5 :style="'color: ' + pvolveMintTitle + '; margin: 0;'">Sharing:</h5>

                    <a id="share-email" href="mailto:?subject=Check out p.volve on demand!&body=I just finished my p.volve workout! Check out p.volve here: https://pvolve.com" target="_blank">
                        <q-btn size="md" round flat color="grey">
                            <q-icon name="fas fa-envelope" color="grey" />
                        </q-btn>
                    </a>

                    <q-btn id="share-facebook" size="md" round flat @click="share2Facebook(currentProduct || productPreviewData)" color="grey">
                        <q-icon name="fab fa-facebook-f" />
                    </q-btn>

                    <q-btn id="share-twitter" size="md" round flat @click="share2Twitter(currentProduct || productPreviewData)" color="grey">
                        <q-icon name="fab fa-twitter" />
                    </q-btn>
                </div> -->

                <pvolveCommentPreview v-if="commentLength" :commentLength="commentLength" :previewComment="previewComment" />

            </div>

        </div>

        <div v-if="!appOffline" class="col-12 bg-grey-3" style="padding: 2rem; margin-top: 1rem;">
            <recommendProductToFriend :product="currentProduct" />
        </div>

        <div v-if="!appOffline && !forSubmission" class="col-12" style="padding: 1rem;">
            <pvolveMiniShop :equipmentUsed="equipmentUsed" />
        </div>

        <div v-if="!appOffline" id="commentsDisplay" class="col-12">
            <CommentsDisplay :previewMode="!userOwned" @comments="generateCommentQuickLook" :ratingImageSrc="'https://vault.platformpurple.com/static/clients/mypvolve/PLV010-17_PeachIcon_CMYK.png'" />
        </div>

    </div>

</template>

<script>
import PurpleVideo from '../../common/player/PurpleVideo'
import pvolveMiniShop from './pvolveMiniShop'
import CommentsDisplay from '../../common/comments/CommentsDisplay.vue'
import pvolveCommentPreview from './pvolveCommentPreview.vue'
import recommendProductToFriend from './recommendProductToFriend.vue'

import { pvolveColors } from './pvolveColors'
import { pvolveShopifyData } from './pvolveShopifyData'
import { videoPlayback } from '../../../mixins/videoPlayback'
// import { productPreviewTools } from '../../../mixins/productPreviewTools'
import { social } from '../../../mixins/social'
import { productInfoTools } from '../../../mixins/productInfoTools'

export default {
    props: ['currentChapter', 'playerOptions'],

    mixins: [
        pvolveColors,
        videoPlayback,
        social,
        productInfoTools,
        pvolveShopifyData,
        // productPreviewTools
    ],

    components: {
        pvolveMiniShop,
        CommentsDisplay,
        PurpleVideo,
        pvolveCommentPreview,
        recommendProductToFriend
    },

    data() {
        return {
            // moreInfo: '',
            commentLength: 0,
            previewComment: '',
        }
    },

    computed: {
        appOffline() {
            return this.$store.state.appOffline
        },

        forSubmission() {
            return window.forSubmission
        },

        environmentProducts() {
            return this.$store.state.environmentProducts
        },

        pvolvePlayerOptions() {
            let pvolvePlayerOptions = this.playerOptions || {}
            pvolvePlayerOptions.aspectRatio = '16:9'
            pvolvePlayerOptions.autoplay = true
            return pvolvePlayerOptions
        },

        currentProduct() {
            return this.$store.state.currentProduct
        },

        equipmentUsed() {
            return this.$store.state.equipmentUsed
        },

        goingTo() {
            return this.$store.state.goingTo
        },

        coverImageURL() {
            return `https://f3r6v6t8.ssl.hwcdn.net/static/previews/${this.currentProduct.productSKU || this.productPreviewData.productSKU}/${this.currentProduct.productSKU || this.productPreviewData.productSKU}_500px_cover.png`
        },

        userOwned() {
            // return this.currentProduct.userActiveProduct
            return true
        },

        shopifyProductData() {
            return this.$store.state.shopifyProductData
        },

        chapterIndexToStartFrom() {
            return this.$store.state.chapterIndexToStartFrom
        },

        environmentData() {
            return this.$store.state.environment.data
        },

        environmentJSON() {
            return this.$store.state.environment.json
        },

        userLoginToken() {
            return this.$store.state.user.userLoginToken
        },

        productPreviewModalOpen() {
            return this.$store.state.productPreviewModalOpen
        },

        initialParameters() {
            return this.$store.state.initialParameters
        },

        productID2Preview() {
            return this.$root.$store.state.productID2Preview
        },

        productPreviewData() {
            return this.$root.$store.state.productPreviewData
        },

        userSubscriptionProductStatusHistory() {
            return this.$root.$store.state.userSubscriptionProductStatusHistory
        },

        previouslyOwnedTrial() {
            return this.userSubscriptionProductStatusHistory && this.userSubscriptionProductStatusHistory.length
        },

        waitForMutationToExitMedia() {
            return this.$store.state.waitForMutationToExitMedia
        },
    },

    methods: {
        goToTrial() {
            if (this.productPreviewModalOpen) {
                this.$root.$emit('closeProductPreview')
                this.$root.$on('closedProductPreview', () => {
                    this.route('/trial')
                    this.$root.$off('closedProductPreview')
                })
            } else {
                this.route('/trial')
            }
        },

        goToCheckoutWithMonthlySub() {
            k('this.productPreviewModalOpen: ', this.productPreviewModalOpen)

            if (this.productPreviewModalOpen) {
                this.$root.$emit('closeProductPreview')
                this.$root.$on('closedProductPreview', () => {
                    this.$store.commit('addKeyPathInStore', {
                        keyPath: 'initialParameters.cart',
                        value: '148014',
                    })

                    this.route('/shop/checkout')
                    this.$root.$off('closedProductPreview')
                })
            } else {
                this.$store.commit('addKeyPathInStore', {
                    keyPath: 'initialParameters.cart',
                    value: '148014',
                })
                this.route('/shop/checkout')
            }
        },

        generateCommentQuickLook(comments) {
            k('generateCommentQuickLook: ', comments)
            this.commentLength = comments.length
            this.previewComment = comments.length ? comments[0] : ''
        },

        exitMedia() {
            k('waitForMutationToExitMedia: ', this.waitForMutationToExitMedia)
            if (this.waitForMutationToExitMedia) return false
            this.route(this.$store.state.comingFrom)
        },

        chapterTap(index) {
            k('waitForMutationToExitMedia: ', this.waitForMutationToExitMedia)
            if (this.waitForMutationToExitMedia) return false
            this.$parent.playChapter(index)
        },
    },

    created() {
        k('pvolve video layout created: ', this.productID2Preview, this.currentProduct)

        if (this.currentProduct && !this.appOffline) {
            this.getShopifyProductDataIfNeeded()
        }
    },
}
</script>

<style>
.transportButton {
    padding: 0.5rem;
    color: #000 !important;
}

.video-js {
    /*height: 50vh;*/
}
</style>
