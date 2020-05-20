
import { mediaTimeTracking } from './mediaTimeTracking'

export const audioPlayback = {
    data() {
        return {
            advancedPlaybackControls: false,
            currentPlaybackRate: 1,
            loopOn: '',
            loopInPoint: '',
            loopOutPoint: '',
            playerID: 'listen',
            seeking: false,
            currentPlayheadTime: 0,
            lastTimeSaved: 0,
            audioPaused: true
        }
    },

    mixins: [mediaTimeTracking],

    computed: {
        windowWidth() {
            return this.$store.state.windowWidth
        },

        duration() {
            return document.getElementById(this.playerID).duration
        },

        currentTime() {
            return document.getElementById(this.playerID).currentTime
        },

        currentPlayheadChapterOffset() {
            return this.currentChapter.chapterStartSeconds ? this.currentTime - this.currentChapter.chapterStartSeconds : this.currentTime
        },

        currentProduct() {
            return this.$store.state.currentProduct
        },

        coverImageURL() {
            return 'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + this.currentProduct.productSKU + '/' + this.currentProduct.productSKU + '_image_cover.png'
        },

        tracks() {
            return this.$store.state.currentProduct.productJSON.audio
        },

        brandColor() {
            return this.brand.brandColor
        },

        playbackRatesForSelection() {
            return this.playerOptions.playbackRates.map(rate => {
                return {
                    label: 'x' + String(rate),
                    value: rate
                }
            })
        }
    },

    methods: {
        cyclePlaybackRate() {
            var currentPlaybackRateIndex = this.playerOptions.playbackRates.indexOf(document.getElementById(this.playerID).playbackRate)
            k('currentPlaybackRateIndex: ', currentPlaybackRateIndex)

            var nextPlaybackRateIndex = currentPlaybackRateIndex + 1
            if (nextPlaybackRateIndex >= this.playerOptions.playbackRates.length) nextPlaybackRateIndex = 0
            k('next playback rate: ', nextPlaybackRateIndex, this.playerOptions.playbackRates.length, this.playerOptions.playbackRates[nextPlaybackRateIndex])

            document.getElementById(this.playerID).playbackRate = this.playerOptions.playbackRates[nextPlaybackRateIndex]
            this.currentPlaybackRate = this.playerOptions.playbackRates[nextPlaybackRateIndex]
        },

        changePlaybackRate(rate) {
            k('changePlaybackRate: ', rate)

            document.getElementById(this.playerID).playbackRate = rate
            this.currentPlaybackRate = rate
        },

        setLoopIn() {
            k('setLoopIn: ', document.getElementById(this.playerID).currentTime)
            if (!this.loopInPoint) {
                this.loopInPoint = document.getElementById(this.playerID).currentTime
            } else {
                this.loopInPoint = ''
                this.loopOn = false
            }
        },

        setLoopOut() {
            k('setLoopOut: ', document.getElementById(this.playerID).currentTime)
            if (!this.loopOutPoint) {
                this.loopOutPoint = document.getElementById(this.playerID).currentTime
                if (this.loopInPoint) this.loopOn = true
            } else {
                this.loopOutPoint = ''
                this.loopOn = false
            }
        },

        onPlayerPlaying(player) {
            k('audio player playing!', player)
            this.audioPaused = false

            k('seeking?' + this.seeking)

            if (this.seeking) {
                // user has stopped seeking
                kw('seeking complete')
                this.seeking = false

                this.mediaSeeked(this.currentPlayheadTime, document.getElementById(this.playerID).currentTime, 'audio')
                this.currentPlayheadTime = document.getElementById(this.playerID).currentTime
                // send current media event
            }
        },

        onPlayerTimeupdate(player) {
            // k('audio player timeupdate!', player)

            // used for looping
            if (this.loopOutPoint &&
                this.loopInPoint &&
                this.loopOn &&
                document.getElementById(this.playerID).currentTime > this.loopOutPoint) document.getElementById(this.playerID).currentTime = this.loopInPoint

            if (this.playerID && document.getElementById(this.playerID)) {
                var currentTime = document.getElementById(this.playerID).currentTime

                if (Math.abs(this.currentPlayheadTime - currentTime) > 5) {
                    kw('setting seeking')
                    // if (this.$parent.switchingChapters) {
                    //     this.$parent.switchingChapters = false // turn off flag
                    // } else {
                        this.seeking = true // this is for jumping in media (vs scrubbing)
                    // }
                }

                if (!this.seeking) { // seeked events are handled separately
                    // k('update playhead tracking')
                    this.currentPlayheadTime = currentTime // update current playhead tracking

                    // see if new chapter has been reached
                    // if (this.currentChapter.chapterStartSeconds || this.currentChapter.chapterStartSeconds == 0) {
                    //     var seeked2ChapterIndex = this.$root.chapterIndexForTimecode(this.chapters, this.currentChapter.fileName, currentTime)

                    //     if (seeked2ChapterIndex != this.$store.state.currentChapterIndex) {
                    //         kw('new chapter reached')
                    //         this.$store.commit('setCurrentChapterIndex', seeked2ChapterIndex)
                    //         this.$store.commit('setCurrentChapter', this.chapters[seeked2ChapterIndex])
                    //         k('next chapter info set')
                    //         this.$root.sendCurrentMediaPlayEventIfExists() // send this before updating the media play end event

                    //         kw('start new play event now')
                    //         this.$root.startMediaPlayEvent(0, 'video')
                    //     }
                    // }

                    if (Math.abs(this.lastTimeSaved - this.currentPlayheadTime) > 3) {
                        // update event end time in local storage
                        this.lastTimeSaved = currentTime
                        this.updateMediaPlayEvent(currentTime)
                    }
                }
            }
        },

         // listen event
        onPlayerPlay(player) {
            k('player play!', player)
            this.audioPaused = false
        },

        onPlayerPause(player) {
            k('player pause!', player)
            this.audioPaused = true
        },

        onPlayerLoadeddata(player) {
            k('player loadeddata!', player)

            document.getElementById(this.playerID).onseeking = (player) => {
                kw('player seeking?: ' + this.seeking)
                if (!this.seeking) {
                    kw('player seeking')
                    this.seeking = true // set to true and then once seeking done; "play" listener is triggered to signal seeking over
                }
            }
        },

        playerReadied(player) {
            kw('the audio player is readied', player)
        },

        onPlayerEnded(player) {
            k('the player ended', player)
            // this.endMediaTrackSegment(this.currentPlayheadPosition)
            this.sendCurrentMediaPlayEventIfExists()
            this.$emit('nextTrack')
        },

        downloadAudioZip() {
            window.location.href = this.audioZipURL

            var logEventObj = {
                eventType: 'audioZipDownloaded',
                eventDesc: 'downloaded audio zip "' + this.currentProduct.productName + '"',
                productSKU: this.currentProduct.productSKU,
                productID: this.currentProduct.productID,
                audioZipURL: this.audioZipURL
            }
            this.api.sendEvent(logEventObj)
        }
    }
}
