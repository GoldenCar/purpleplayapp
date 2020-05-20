<template>

    <div id="structuredProgramVideoLayout">

        <div class="row well">

            <div class="col-sm-12 col-md-7" style="padding: 1rem;">

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

            </div>

            <div v-if="currentChapter" class="col-sm-12 col-md-5" style="padding: 1rem;">

                <h3 :style="'color: ' + pvolveMintTitle + ';'">{{ currentChapter.displayName }}</h3>
                <!--<h5 :style="'letter-spacing: -1px; color: ' + pvolveSalmon + '; text-transform: none; margin-top: 0;'" class="monty">{{currentProduct.productName}}</h5>-->
                <p id="longDescription" v-html="currentChapter.chapterDescription" style="margin-top: 1rem; line-spacing: 2rem; font-size: .9rem;"></p>

                <!-- <div id="sharing">
                    <h5 :style="'color: ' + pvolveMintTitle + '; margin: 0;'">Sharing:</h5>

                    <a id="share-email" href="mailto:?subject=Check out p.volve on demand!&body=I just finished my p.volve workout! Check out p.volve here: https://pvolve.com" target="_blank">
                        <q-btn size="md" round flat color="grey">
                            <q-icon name="fas fa-envelope" color="grey" />
                        </q-btn>
                    </a>

                    <q-btn id="share-facebook" size="md" round flat @click="share2Facebook(currentProduct)" color="grey">
                        <q-icon name="fab fa-facebook-f" />
                    </q-btn>

                    <q-btn id="share-twitter" size="md" round flat @click="share2Twitter(currentProduct)" color="grey">
                        <q-icon name="fab fa-twitter" />
                    </q-btn>
                </div> -->

                <pvolveCommentPreview v-if="commentLength" :commentLength="commentLength" :previewComment="previewComment" @readAllReviews="scrollToReviews()" />

            </div>

        </div>

        <div v-if="currentProduct" class="bg-grey-3" style="padding: 1rem;">
            <div class="row well">
                <recommendProductToFriend class="col-12" align="center" :product="currentProduct" />
            </div>
        </div>

        <div v-if="currentProduct" class="bg-white" style="padding: 1rem;">
            <div class="row well">
                <pvolveMiniShop :equipmentUsed="equipmentUsed" />
            </div>
        </div>

        <div v-if="currentProduct" id="commentsDisplay" style="padding-top: 1rem;">
            <div class="row well">
                <CommentsDisplay :previewMode="!userOwned" @comments="generateCommentQuickLook" :ratingImageSrc="'https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/PLV010-17_PeachIcon_CMYK.png'" />
            </div>
        </div>

    </div>

</template>

<script>
import PurpleVideo from '../../common/player/PurpleVideo'
import pvolveMiniShop from './pvolveMiniShop'
import CommentsDisplay from '../../common/comments/CommentsDisplay.vue'
import PvolveCommentPreview from './pvolveCommentPreview.vue'
import recommendProductToFriend from './recommendProductToFriend.vue'

import { pvolveColors } from './pvolveColors'
import { videoPlayback } from '../../../mixins/videoPlayback'
import { social } from '../../../mixins/social'
import { productInfoTools } from '../../../mixins/productInfoTools'
import { pvolveShopifyData } from './pvolveShopifyData'

export default {
    props: ['currentChapter', 'playerOptions'],

    mixins: [pvolveColors, videoPlayback, social, productInfoTools, pvolveShopifyData],

    components: {
        pvolveMiniShop,
        CommentsDisplay,
        PurpleVideo,
        PvolveCommentPreview,
        recommendProductToFriend,
    },

    data() {
        return {
            commentLength: 0,
            previewComment: '',
        }
    },

    computed: {
        environmentProducts() {
            return this.$store.state.environmentProducts
        },

        pvolvePlayerOptions() {
            let pvolvePlayerOptions = this.playerOptions || {}
            pvolvePlayerOptions.aspectRatio = '16:9'
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
            return 'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + this.currentProduct.productSKU + '/' + this.currentProduct.productSKU + '_500px_cover.png'
        },

        userOwned() {
            return this.currentProduct.userActiveProduct
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
    },

    methods: {
        onPlayerEnded(player) {
            // this.endMediaTrackSegment(this.currentPlayheadPosition)

            // this.$emit('nextChapter')
            this.$store.commit('openPlayerModal', true)
        },

        generateCommentQuickLook(comments) {
            k('generateCommentQuickLook: ', comments)
            this.commentLength = comments.length
            this.previewComment = comments.length ? comments[0] : ''
        },

        scrollToReviews() {
            var container = this.userOwned ? '' : '#previewContainer .scroll'
            this.scrollIt('commentsDisplay', container)
        },
    },

    watch: {
        currentProduct() {
            k('currentProduct watch: ', this.currentProduct)

            this.getShopifyProductDataIfNeeded();
        },
    },

    created() {
        k('pvolve video layout created')
        // k('currentProduct: ', j(this.currentProduct))
        // k('chapterIndexToStartFrom: ', this.chapterIndexToStartFrom)

        this.getShopifyProductDataIfNeeded();
    },
}
</script>

<style scoped>
.transportButton {
    padding: 0.5rem;
    color: #000 !important;
}

.video-js {
    /*height: 50vh;*/
}
</style>
