import { mediaTimeTracking } from './mediaTimeTracking'

export const videoPlayback = {
    data() {
        return {
            playerID: '',
            openModal: false,
            advancedPlaybackControls: false,
            currentPlaybackRate: 1,
            loopOn: '',
            loopInPoint: '',
            loopOutPoint: '',
            seeking: false,
            currentPlayheadTime: 0,
            lastTimeSaved: 0,
            lastTimeSent: 0,
            videoPaused: true,
            currentTime: 0
        }
    },

    mixins: [mediaTimeTracking],

    computed: {

        currentProduct() {
            return this.$store.state.currentProduct
        },

        currentMediaType() {
            return this.$store.state.currentMediaType
        },

        chapters() {
            return this.$store.state.currentProduct.productJSON.video
        },

        playbackRatesForSelection() {
            return this.playerOptions.playbackRates.map(rate => {
                return {
                    label: (this.windowWidth > 552 ? 'Speed ' : '') + 'x' + String(rate),
                    value: rate,
                }
            })
        },

        windowWidth() {
            return this.$store.state.windowWidth
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

        // listen event
        onPlayerPlay(player) {
            k('player play!', player, document.getElementById(this.playerID).currentTime)
            this.videoPaused = false

            k('player play: seeking?' + this.seeking)

            if (this.seeking) {
                // user has stopped seeking
                kw('seeking complete')
                this.seeking = false

                // this is causing a bug
                // this.mediaSeeked(this.currentPlayheadTime, this.currentTime, 'video')
                // this.currentPlayheadTime = this.currentTime
                // send current media event
            }
        },

        onPlayerPause(player) {
            k('player pause!', player, document.getElementById(this.playerID).currentTime)
            this.videoPaused = true
        },

        onPlayerLoadeddata(player) {
            k('player loadeddata!', player)
            this.$emit('playerLoadedData')

            this.currentPlayheadTime = 0
            this.currentTime = 0
            this.playerID = player.id_ + '_html5_api'

            document.getElementById(this.playerID).onseeking = (player) => {
                kw('on seeking ... player seeking?: ' + this.seeking)
                if (!this.seeking && Math.abs(this.currentPlayheadTime - this.currentTime) > 10) {
                    kw('set player seeking')
                    this.seeking = true // set to true and then once seeking done; "play" listener is triggered to signal seeking over
                    this.mediaSeeked(this.currentPlayheadTime, this.currentTime, 'video')
                }
            }

            // autoplay on mobile
            // if (this.$q.platform.is.mobile) {
            //     console.warn('HEY YALL')
            //     document.getElementById(this.playerID).muted = true
            //     document.getElementById(this.playerID).play()
            // }
        },

        onPlayerPlaying(player) {
            k('player playing!', player, document.getElementById(this.playerID).currentTime)
            this.videoPaused = false

            k('player playing: seeking?' + this.seeking)

            if (this.seeking) {
                // user has stopped seeking
                kw('seeking complete')
                this.seeking = false

                // this is causing a bug
                // this.mediaSeeked(this.currentPlayheadTime, this.currentTime, 'video')
                // this.currentPlayheadTime = this.currentTime
                // send current media event
            }
        },

        onPlayerTimeupdate(currentTime) {

            // k('player timeupdate!', currentTime, this.currentPlayheadTime)

            this.currentTime = currentTime

            // used for looping
            if (this.loopOutPoint &&
                this.loopInPoint &&
                this.loopOn &&
                currentTime > this.loopOutPoint) {
                // k('set loop point')
                document.getElementById(this.playerID).currentTime = this.loopInPoint
            }

            // var currentTime = document.getElementById(this.playerID).currentTime

            if (Math.abs(this.currentPlayheadTime - currentTime) > 10) {
                // kw('setting seeking flag')
                k(currentTime)
                k(this.currentPlayheadTime)
                this.seeking = true // this is for jumping in media (vs scrubbing)

                this.mediaSeeked(this.currentPlayheadTime, this.currentTime, 'video')
            }

            // k('update playhead tracking')
            this.currentPlayheadTime = currentTime // update current playhead tracking

            if (!this.seeking) { // seeked events are handled separately
                // see if new chapter has been reached
                if (this.currentChapter.chapterStartSeconds || this.currentChapter.chapterStartSeconds == 0) {
                    // this is a timecode chapter
                    var seeked2ChapterIndex = this.chapterIndexForTimecode(this.chapters, this.currentChapter.fileName, currentTime)
                    // k('seeked2ChapterIndex: ', seeked2ChapterIndex, this.$store.state.currentChapterIndex)

                    if (seeked2ChapterIndex != this.$store.state.currentChapterIndex) {
                        kw('new chapter reached: ', seeked2ChapterIndex)
                        this.$store.commit('setCurrentChapterIndex', seeked2ChapterIndex)
                        this.$store.commit('setCurrentChapter', this.chapters[seeked2ChapterIndex])
                        // k('next chapter info set')
                        this.sendCurrentMediaPlayEventIfExists() // send this before updating the media play end event

                        // kw('start new play event now')
                        this.startMediaPlayEvent(0, 'video')
                    }
                }
            }

            // k('lastTimeSaved:' + this.lastTimeSaved)
            // k('currentPlayheadTime:' + this.currentPlayheadTime)
            // if (Math.abs(this.lastTimeSaved - this.currentPlayheadTime) > 3) {
            //     // kw('update end')
            //     // update event end time in local storage
            //     this.lastTimeSaved = currentTime
            //     this.updateMediaPlayEvent(currentTime)
            // }

            if (Math.abs(this.lastTimeSaved - this.currentPlayheadTime) > 1) {
                this.lastTimeSaved = currentTime
                this.updateMediaPlayEvent(currentTime)
            }

            if (Math.abs(this.lastTimeSent - this.currentPlayheadTime) > 30) {
                kw('update end')
                // update event end time in local storage
                this.lastTimeSent = currentTime
                // this.updateMediaPlayEvent(currentTime)
                this.sendCurrentMediaPlayEventIfExists() // send this before updating the media play end event

                k('start new play event now')
                this.startMediaPlayEvent(this.lastTimeSaved, 'video')
            }
        },

        onPlayerEnded(player) {
            // this.endMediaTrackSegment(this.currentPlayheadPosition)
            // this.sendCurrentMediaPlayEventIfExists() // send this before updating the media play end event

            var logEventObj = {
                eventType: 'chapterComplete',
                eventDesc: `user completed chapter ${this.currentChapter.displayName} in ${this.currentProduct.productName}`,
                productSKU: this.currentProduct.productSKU,
                productID: this.currentProduct.productID
            }
            this.api.sendEvent(logEventObj)
            this.$emit('nextChapter')
        },

        onPlayerError(player) {
            ke('player error: ', player)

            this.api.sendEvent({
                eventType: 'mediaError',
                eventDesc: 'error while playing media file for ' + this.currentProduct.productName,
                productSKU: this.currentProduct.productSKU,
                productID: this.currentProduct.productID,
                fileName: this.currentChapter.url,
                errorMsg: player.error_ ? player.error_.message : ''
            })

            let resumePlaybackFromErrorFlag = this.localStorage.get('resumePlaybackFromError')
            if (this.productIsDownloaded && player.error_ && player.error_.code === 4 && !resumePlaybackFromErrorFlag) {
                this.localStorage.set('resumePlaybackFromError', true)
                this.resumePlaybackFromError()
            }
        },

        resumePlaybackFromError() {
            k('resumePlaybackFromError')

            // save current player time
            this.$store.commit('chapterStartSecondsToPlayFrom', this.currentTime)

            k('resumePlaybackFromError vars: ', this.chapters, this.$store.state.currentChapterIndex, this.currentProduct)

            // file error means file is mutated
            let productStateKey = `${this.chapters[this.$store.state.currentChapterIndex].fileName}.${this.currentProduct.productSKU}.mutated`
            k('productStateKey: ', productStateKey)
            this.localStorage.set(productStateKey, true)

            // re-unmutate file
            // play file from saved time
            this.$emit('reInitLocalFile')

        }
    },

    watch: {
        playerID() {
            this.$emit('setVideoID', this.playerID)
        }
    }
}
