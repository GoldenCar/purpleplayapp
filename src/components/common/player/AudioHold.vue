<template>

    <div
        ref="audioLayout"
        :currentTrack="currentTrack"
        :playerOptions="playerOptions"
        :audioSrc="audioSrc"
        :audioZipURL="audioZipURL"
        :is="audioLayout"

        @prevTrack="prevTrack"
        @nextTrack="nextTrack"
        @togglePlay="togglePlay"
        @playTrack="playTrack"
    />

</template>

<script>
    import DefaultAudioLayout from './DefaultAudioLayout'
    import { mediaTimeTracking } from '../../../mixins/mediaTimeTracking'

    export default {
        components: {
            DefaultAudioLayout
        },

        mixins: [mediaTimeTracking],

        data() {
            return {
                audioLayout: '',
                currentTrack: '',
                audioSrc: '',
                audioZipURL: '',
                switchingChapters: false,
                playerOptions: {
                    playbackRates: [0.5, 0.7, 1, 1.5, 2],
                    start: 0
                },
            }
        },

        computed: {
            homePageData() {
                return this.$store.state.environment.json
            },

            currentProduct() {
                return this.$store.state.currentProduct
            },

            currentChapter() {
                return this.$store.state.currentChapter
            },

            tracks() {
                return this.$store.state.currentProduct.productJSON.audio
            },

            userLoginToken() {
                return this.$store.state.user.userLoginToken
            },

            chapterIndexToStartFrom() {
                return this.$store.state.chapterIndexToStartFrom
            },

            chapterStartSecondsToPlayFrom() {
                return this.$store.state.chapterStartSecondsToPlayFrom
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

        methods: {
            initPlayback() {
                if (!this.tracks[this.chapterIndexToStartFrom || 0]) {
                    this.$q.notify({
                        message: 'There is a problem with the product media. Please contact support.',
                        type: 'negative',
                        icon: 'fas fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                    this.route('/library')
                } else {
                    this.playTrack(this.chapterIndexToStartFrom || 0)
                }

                if (this.chapterIndexToStartFrom || this.chapterIndexToStartFrom === 0) this.$store.commit('chapterIndexToStartFrom', '')
            },

            togglePlay() {
                var el = document.getElementById('listen')
                k('audio paused? ', el.paused)

                if (el.paused) {
                    el.play()
                } else {
                    el.pause()
                }
            },

            prevTrack() {
                var prevTrackIndex = this.tracks.indexOf(this.currentTrack) - 1
                k('prevTrackIndex: ', prevTrackIndex)
                if (prevTrackIndex <= -1) prevTrackIndex = 0
                if (prevTrackIndex > -1) this.playTrack(prevTrackIndex)
            },

            nextTrack() {
                var nextTrackIndex = this.tracks.indexOf(this.currentTrack) + 1
                k('nextTrackIndex: ', nextTrackIndex)

                if (this.tracks[nextTrackIndex]) {
                    this.playTrack(nextTrackIndex)
                } else {
                    this.route('/library')
                }
            },

            playTrack(trackIndex) {
                k('playTrack: ', trackIndex)

                this.audioSrc = ''
                this.sendCurrentMediaPlayEventIfExists() // send any remaining mediaplay event

                if (this.currentTrack) this.switchingChapters = true

                this.$store.commit('setCurrentChapter', '')

                this.getNewURL(trackIndex, (res) => {
                    if (res) {
                        this.currentTrack = this.currentProduct.productJSON.audio[trackIndex]
                        this.audioSrc = res.signedURL

                        this.$store.commit('setCurrentChapter', this.currentTrack)
                        this.$store.commit('setCurrentChapterIndex', trackIndex)

                        // if (switchingChapters) {
                        //     kw('do not start new media event') // bc seek listener is triggered when it plays
                        // } else {
                        this.startMediaPlayEvent(0, 'audio')
                        // }
                    } else {
                        kw('could not get new url!')
                    }
                })
            },

            getNewURL(trackIndex, cb) {
                if (this.productIsDownloaded) {

                    //load in predictable path
                    var res = this.getLocalURL(this.currentProduct.productSKU, this.tracks[trackIndex].fileName)

                    // todo: unencrypt ?

                    cb(res)

                } else if (this.tracks[trackIndex].uri) {
                  cb ({ signedURL: this.tracks[trackIndex].uri })
                } else {
                    this.api.signURL(this.currentProduct.productSKU, this.tracks[trackIndex].fileName, this.userLoginToken, 'audio', (res) => {
                        // k('signURL res: ', res)

                        if (!res.signedURL) {
                            k('signURL res no url: ', res)
                            this.$q.notify({
                                message: 'There was a problem getting the media for this product. Please contact support.',
                                type: 'negative',
                                icon: 'fas fa-exclamation-circle',
                                position: 'bottom-left'
                            })

                            cb(false)
                        } else {
                            cb(res)
                        }
                    })
                }
            },

            requestAudioZip() {
                var req = {
                    "productName": this.currentProduct.productName,
                    "userLoginToken": this.userLoginToken,
                    "productSKU": this.currentProduct.productSKU,
                    "mediaType": "audioZipFile"
                }

                k('requestAudioZipRequest req: ', req)

                this.api.post(this.api.apiv4Route + 'api/product/signedURL', req, (res) => {
                    k('requestAudioZipRequest res: ', res)

                    if (res.signedURL) this.audioZipURL = res.signedURL
                })
            }
        },

        mounted() {
            k('this is current player instance object', document.getElementById('listen'))
            this.audioLayout = this.brand.customAudioLayout || 'DefaultAudioLayout'

            this.initPlayback()
            if (this.currentProduct.downloadAllowed) this.requestAudioZip()
        },

        beforeDestroy() {
            this.$store.commit('setCurrentChapter', '')
            this.$store.commit('setCurrentChapterIndex', '')
            this.sendCurrentMediaPlayEventIfExists() // send any remaining mediaplay event
        }

    }
</script>

<style>
    .transportButton {
        padding: .5rem;
        color: #000 !important;
    }

    #listen {
        width: 100%;
    }
</style>
