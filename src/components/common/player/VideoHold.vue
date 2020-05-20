<template>
    <div
        :currentChapter="currentChapter"
        :playerOptions="playerOptions"
        :is="videoLayout"

        @setVideoID="setVideoID"
        @playerReady="playerReady"
        @playerLoadedData="playerLoadedData"
        @togglePlay="togglePlay"
        @nextChapter="nextChapter"
        @prevChapter="prevChapter"
        @selectChapter="selectChapter"
        @selectChapterHeading="selectChapterHeading"
        @reInitLocalFile="reInitLocalFile"
    />
</template>

<script>
import DefaultVideoLayout from './DefaultVideoLayout'
import { mediaTimeTracking } from '../../../mixins/mediaTimeTracking'
import { videoTools } from '../../../mixins/videoTools'

export default {
    props: ['videoLayout'],

    components: {
        DefaultVideoLayout,
    },

    mixins: [mediaTimeTracking, videoTools],

    data() {
        return {}
    },

    computed: {
        downloadedProducts() {
            return this.$store.state.downloadedProducts
        },

        productIsDownloaded() {
            return this.downloadedProducts.length
                ? this.downloadedProducts.filter(item => {
                      return item.productID == this.currentProduct.productID
                  })[0]
                : false
        },

        platformID() {
            return this.$store.state.platformID
        },
    },

    created() {
        k('videoHold created: ', this.chapterIndexToStartFrom)
        this.$store.commit('setCurrentChapter', '')
        this.$store.commit('setCurrentChapterIndex', '')

        if (!this.chapters[this.chapterIndexToStartFrom || 0]) {
            this.$q.notify({
                message: 'There is a problem with the product media. Please contact support.',
                type: 'negative',
                icon: 'fas fa-exclamation-circle',
                position: 'bottom-left',
            })
            this.route('/library')
        } else {
            this.playChapter(this.chapterIndexToStartFrom || 0)
        }
        if (this.chapterIndexToStartFrom) this.$store.commit('chapterIndexToStartFrom', '')

        this.generateNestedChapters()
    },

    methods: {
        playerLoadedData() {
            kw('playerLoadedData!')
            if (this.productIsDownloaded) {
                // mutate file back
                k('device platform: ', this.platformID)
                if (this.platformID === 'android') {
                    const currentProduct = this.currentProduct
                    const currentChapter = this.currentChapter
                    setTimeout(() => {
                        k('mutate timeout over')
                        this.mutate(
                            currentProduct.productSKU,
                            currentChapter.fileName,
                            res => {
                                k('re mutate after player loaded data: ', res)
                            },
                            true
                        )
                        this.$store.commit('waitForMutationToExitMedia', false)
                    }, 2000)
                } else {
                    k('no mutate timeout')
                    this.mutate(
                        this.currentProduct.productSKU,
                        this.currentChapter.fileName,
                        res => {
                            k('re mutate after player loaded data: ', res)
                        },
                        true
                    )
                    this.$store.commit('waitForMutationToExitMedia', false)
                }
            }
        },
    },

    watch: {
        chapterIndexToStartFrom() {
            k('watch chapterIndexToStartFrom: ', this.chapterIndexToStartFrom)
            if (this.chapterIndexToStartFrom || this.chapterIndexToStartFrom === 0) this.initPlayback()
        },
    },

    beforeDestroy() {
        this.$store.commit('setCurrentChapter', '')
        this.$store.commit('setCurrentChapterIndex', '')
        this.sendCurrentMediaPlayEventIfExists() // send any remaining mediaplay event
    },
}
</script>

<style>
#watch {
    width: 100%;
    margin: 0 auto;
    /*height: 100%;*/
    /* max-width: 1440px; */
    /* height: 70vh !important; */
    /*overflow: hidden;*/
}

.video-js {
    width: 100%;
    height: calc(100vh - 11rem);
}

.vjs-caption-settings {
    z-index: 1;
}
</style>
