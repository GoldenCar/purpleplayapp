export const videoTools = {
    data() {
        return {
            videoID: '',
            playerOptions: {
                // component options
                start: 0,
                playsinline: true,

                // videojs options
                fluid: false,
                autoplay: true,
                controls: true,
                muted: false,
                language: 'en',
                playbackRates: [0.5, 0.7, 1, 1.5, 2],
                sources: [],
                tracks: [],
                height: '100%',
                aspectRatio: '16:9',
            },
            firstChapterPlayed: true,
        }
    },

    mixins: [],

    computed: {
        currentProduct() {
            return this.$store.state.currentProduct
        },

        chapters() {
            return this.$store.state.currentProduct.productJSON.video
        },

        currentChapter() {
            return this.$store.state.currentChapter
        },

        currentChapterIndex() {
            return this.$store.state.currentChapterIndex
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

        nestedChapters() {
            return this.$store.state.nestedChapters
        },

        windowHeight() {
            return this.$store.state.windowHeight
        },

        homePageData() {
            return this.$store.state.environment.json
        },

        currentMediaType() {
            return this.$store.state.currentMediaType
        },
    },

    methods: {
        initPlayback() {
            k('initPlayback! ', this.chapters, this.chapterIndexToStartFromz)

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
            if (this.chapterIndexToStartFrom || this.chapterIndexToStartFrom === 0) this.$store.commit('chapterIndexToStartFrom', '')
        },

        playerReady() {
            kw('READY!')
        },

        setVideoID(id) {
            k('setVideoID: ', id)
            this.videoID = id
        },

        togglePlay(pauseOnly) {
            var el = document.getElementById(this.videoID)
            kw('togglePlay: ', this.videoID)
            k('videoPaused: ', el.paused, pauseOnly)

            if (el.paused && !pauseOnly) {
                // if (this.videoPaused) {
                el.play()
            } else {
                el.pause()
            }
        },

        prevChapter() {
            var prevChapterIndex = this.currentChapterIndex - 1
            // k('prevChapterIndex: ', prevChapterIndex)
            if (prevChapterIndex <= -1) prevChapterIndex = 0
            if (prevChapterIndex > -1) this.playChapter(prevChapterIndex)
        },

        nextChapter() {
            if (this.videoID && document.getElementById(this.videoID) && !document.getElementById(this.videoID).paused) {
                k('pause playing video before continuing')
                this.togglePlay(true)
            }

            var nextChapterIndex = this.currentChapterIndex + 1
            k('nextChapterIndex: ', this.currentChapterIndex, nextChapterIndex)

            if (this.chapters[nextChapterIndex]) {
                this.playChapter(nextChapterIndex)
            } else {
                if (this.$store.state.selectedProductModal) {
                    this.$store.commit('addKeyPathInStore', {
                        keyPath: 'selectedProductModal',
                        value: null,
                    })
                } else {
                    if (this.brand.hooks && this.brand.hooks.productComplete) this.$root.$emit('openPlayerModal', true)
                    this.route(this.$store.state.comingFrom)
                }
            }
        },

        selectChapterHeading(index) {
            k('selectChapterHeading: ', index)

            this.nestedChapters[index].showNested = !this.nestedChapters[index].showNested
            this.$store.commit('nestedChapters', this.nestedChapters)
            k('nestedChapters: ', this.nestedChapters[index])
        },

        selectChapter(selectedChapter) {
            k('selectChapter: ', selectedChapter)
            if (selectedChapter.chapterOffset) selectedChapter.chapterStartSeconds = selectedChapter.chapterOffset

            // todo: test viability of findIndex on different platforms
            let i = this.chapters.findIndex(chapter => {
                if (chapter.chapterOffset) chapter.chapterStartSeconds = chapter.chapterOffset
                return chapter.fileName === selectedChapter.fileName && chapter.chapterStartSeconds === selectedChapter.chapterStartSeconds
            })

            if (i > -1) {
                this.playChapter(i)
            } else {
                ke('chapter not found...')
            }
        },

        playChapter(newChapterIndex) {
            k('playChapter: ', newChapterIndex, this.currentChapterIndex)
            if (newChapterIndex === this.currentChapterIndex) return false

            if (this.productIsDownloaded) this.$store.commit('waitForMutationToExitMedia', true)

            var chapterIsPrevious = newChapterIndex < this.currentChapterIndex
            var previousChapterIndex = this.currentChapterIndex
            k('chapter indexes: ', previousChapterIndex, newChapterIndex, this.chapters[newChapterIndex])

            this.sendCurrentMediaPlayEventIfExists() // send any remaining mediaplay event

            if (!this.chapters[newChapterIndex].fileName || this.chapters[newChapterIndex].nonMovieChapter) {
                k('not a movie chapter: ', chapterIsPrevious)
                this.$store.commit('setCurrentChapter', this.chapters[newChapterIndex])
                this.$store.commit('setCurrentChapterIndex', newChapterIndex)

                if (chapterIsPrevious) {
                    this.prevChapter()
                } else {
                    this.nextChapter()
                }
            } else {
                k('is a movie chapter: ', previousChapterIndex, newChapterIndex, this.chapters[newChapterIndex].fileName)

                var newFileName = previousChapterIndex || previousChapterIndex === 0 ? this.chapters[newChapterIndex].fileName !== this.chapters[previousChapterIndex].fileName : true
                kw('need new url?: ', newFileName)

                if (newFileName) {
                    this.getNewURL(newChapterIndex, res => {
                        k('getNewURL: ', res)
                        if (res) {
                            this.$store.commit('setCurrentChapter', this.chapters[newChapterIndex])
                            this.$store.commit('setCurrentChapterIndex', newChapterIndex)

                            this.startMediaPlayEvent(0, 'video')

                            // todo: download captions tracks?
                            if (!this.productIsDownloaded) this.addCaptionTracks(res);

                            this.addVideoSources(res)
                            this.setStartSeconds()
                        } else {
                            kw('could not get new url!')
                        }
                    })
                } else {
                    this.$store.commit('setCurrentChapter', this.chapters[newChapterIndex])
                    this.$store.commit('setCurrentChapterIndex', newChapterIndex)
                    this.setStartSeconds()
                }
            }
        },

        getNewURL(newChapterIndex, cb) {
            k('getNewURL: ', this.productIsDownloaded)

            if (this.productIsDownloaded) {
                // new streaming movie; need local path
                this.initLocalFile(newChapterIndex, cb)
            } else {
                if (this.chapters[newChapterIndex].uri) {
                    cb({ signedURL: this.chapters[newChapterIndex].uri })
                } else {
                    // new streaming movie; need to sign url
                    this.api.signURL(this.currentProduct.productSKU, this.chapters[newChapterIndex].fileName, this.userLoginToken, 'video', res => {
                        k('signURL res: ', j(res))

                        if (!res.signedURL) {
                            // k('signURL res no url: ', res)

                            var message = 'There was a problem getting the media for this product. Please contact support.'
                            if (res.messageCode && res.messageCode === 'userDoesNotHaveAccess')
                                message = 'You do not have access to this product. Please contact support if you are experiencing an issue.'

                            this.$q.notify({
                                message: message,
                                type: 'negative',
                                icon: 'fas fa-exclamation-circle',
                                position: 'bottom-left',
                            })
                            cb(false)
                        } else {
                            cb(res)
                        }
                    })
                }
            }
        },

        initLocalFile(chapterIndex, cb) {
            var localURL = this.getLocalURL(this.currentProduct.productSKU, this.chapters[chapterIndex].fileName)
            k('localURL: ', localURL)

            let productStateKey = `${this.chapters[chapterIndex].fileName}.${this.currentProduct.productSKU}.mutated`
            let isMutated = JSON.parse(localStorage.getItem(productStateKey))

            kw('is downloaded already mutated?', isMutated)

            this.mutate(
                this.currentProduct.productSKU,
                this.chapters[chapterIndex].fileName,
                res => {
                    k('mutate to play url success: ', res)
                    cb(localURL)
                },
                false
            )
        },

        reInitLocalFile() {
            this.initLocalFile(this.currentChapterIndex, res => {
                k('getNewURL: ', res)
                if (res) {
                    this.startMediaPlayEvent(0, 'video')

                    // todo: download captions tracks?
                    // this.addCaptionTracks(res);

                    this.addVideoSources(res)
                    this.setStartSeconds()

                    this.localStorage.set('resumePlaybackFromError', false)

                    setTimeout(() => {
                        document.getElementById('purpleVideo_html5_api').currentTime = this.playerOptions.start
                    }, 1000)
                } else {
                    kw('could not get new url!')
                }
            })
        },

        setStartSeconds() {
            k('set start seconds: ', this.currentChapter)
            // k('chapterStartSecondsToPlayFrom: ', this.chapterStartSecondsToPlayFrom)
            // k('chapterStartSeconds: ', this.currentChapter.chapterStartSeconds)
            // k('chapterOffset: ', this.currentChapter.chapterOffset)
            // k('firstChapterPlayed: ', this.firstChapterPlayed)
            // k('are there chapterStartSecondsToPlayFrom? ', this.chapterStartSecondsToPlayFrom)

            if (!this.firstChapterPlayed) {
                var startPosition = this.chapterStartSecondsToPlayFrom || this.currentChapter.chapterStartSeconds || this.currentChapter.chapterOffset || 0
                kw('set new playhead position: ', startPosition)

                // todo: find out why setting this.playerOptions.start does not work in all cases
                document.getElementById('purpleVideo_html5_api').currentTime = startPosition

                // TODO: found that this doesn't work always;
                this.playerOptions.start = startPosition
            } else {
                this.playerOptions.start = 0
                this.firstChapterPlayed = false
            }

            if (this.chapterStartSecondsToPlayFrom) this.$store.commit('chapterStartSecondsToPlayFrom', '')
        },

        addVideoSources(res) {
            kw('add video sources')

            this.playerOptions.sources = []
            this.playerOptions.sources.push({
                type: 'video/mp4',
                src: res.signedURL,
            })
        },

        addCaptionTracks(res) {
            k('vtt subtitles: ', res.subtitles)

            if (res.subtitles && res.subtitles.length) {
                // this.playerOptions.tracks = []

                res.subtitles.forEach(captionObj => {
                    k('captionObj: ', captionObj)
                    captionObj.src = captionObj.file
                    this.playerOptions.tracks.push(captionObj)
                })
            } else {
                k('no vtt subtitles')
            }
        },

        generateNestedChapters() {
            k('generateNestedChapters: ', this.currentProduct.productJSON.video)

            var array = JSON.parse(JSON.stringify(this.currentProduct.productJSON.video))

            var max = 0
            for (var i = 0; i < array.length; i++) {
                array[i].expanded = false
                if (max < array[i].nestLevel) {
                    max = array[i].nestLevel
                }
                if (!array[i].children) {
                    array[i].children = []
                }
                if (!array[i].showNested) {
                    array[i].showNested = false
                }
            }
            for (max; max > 0; max--) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i].nestLevel) {
                        while (array[i] && max == array[i].nestLevel) {
                            array[i - 1].children.push(array[i])
                            array.splice(i, 1)
                        }
                    }
                }
            }

            k('nestedChapters: ', array)
            this.$store.commit('nestedChapters', array)
        },
    },

    created() {
        k('currentMediaType: ', this.currentMediaType)
    },

    watch: {
        currentMediaType() {
            k('currentMediaType: ', this.currentMediaType)
        },
    },
}
