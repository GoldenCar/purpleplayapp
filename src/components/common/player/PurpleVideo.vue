<template>

    <div v-if="videoReady">
        <video id="purpleVideo" class="video-js vjs-big-play-centered" ref="video"></video>
    </div>

</template>

<script>
    import _videojs from 'video.js'
    const videojs = window.videojs || _videojs
    import videojsCss from 'video.js/dist/video-js.css'

    // as of videojs 6.6.0
    const DEFAULT_EVENTS = [
        'loadeddata',
        'canplay',
        'canplaythrough',
        'play',
        'pause',
        'waiting',
        'playing',
        'ended',
        'error'
    ]

    export default {

        props: {
            options: {
                type: Object,
                required: true
            },

            customEventName: {
                type: String,
                default: 'statechanged'
            }
        },

        components: {

        },

        data() {
            return {
                player: '',
                videoReady: true
            }
        },

        computed: {
            sources() {
                return this.options.sources
            },

            start() {
                return this.options.start
            }
        },

        mounted() {
            k('playerOptions: ', this.options)

            if (!this.player) {
                this.initialize()
            }

            document.addEventListener("pause", this.handleAppPause, false)
        },

        methods: {
            initialize() {

                // ios fullscreen
                if (this.playsinline) {
                    this.$refs.video.setAttribute('playsinline', this.playsinline)
                    this.$refs.video.setAttribute('webkit-playsinline', this.playsinline)
                }

                k('initialize player with options: ', this.options)

                // player
                const self = this

                this.player = videojs(this.$refs.video, this.options, function() {
                    // events
                    const events = DEFAULT_EVENTS.concat(self.events)

                    // watch events
                    const onEdEvents = {}
                    for (let i = 0; i < events.length; i++) {
                        if (typeof events[i] === 'string' && onEdEvents[events[i]] === undefined) {
                            (event => {
                                onEdEvents[event] = null
                                this.on(event, () => {
                                    self.$emit(event, self.player)
                                })
                            })(events[i])
                        }
                    }

                    var video = self.$refs.video

                    // watch timeupdate
                    this.on('timeupdate', function() {
                        self.$emit('timeupdate', this.currentTime())
                    })

                    // watch loaded data for new src and new start on mobile
                    this.on('loadeddata', function() {
                        k('purple video loaded data: ', self.start)
                        video.currentTime = self.start
                    })

                    // player readied
                    self.$emit('ready', this)

                    // no right click on video
                    // k('video for context menu: ', video)

                    if (video.addEventListener) { // IE >= 9; other browsers
                        video.addEventListener('contextmenu', (e) => {
                            // alert("You've tried to open context menu"); //here you draw your own menu
                            e.preventDefault()
                        }, false)
                    } else { // IE < 9
                        video.attachEvent('oncontextmenu', () => {
                            // alert("You've tried to open context menu")
                            window.event.returnValue = false
                        })
                    }
                })
            },

            dispose(cb) {
                if (this.player && this.player.dispose) {
                    if (this.player.techName_ !== 'Flash') {
                        this.player.pause && this.player.pause()
                    }
                    this.player.dispose()
                    this.player = null

                    this.$nextTick(() => {
                        this.videoReady = false
                        this.$nextTick(() => {
                            this.videoReady = true
                            this.$nextTick(() => {
                                cb()
                            })
                        })
                    })
                }
            },

            handleAppPause() {
                // Handle the pause event
                k('handle app pause!')

                document.getElementById('purpleVideo_html5_api').pause()
            },

            handleFullScreen(e) {
                k('handleFullScreen: ', e)

                var isFullscreenNow = document.webkitFullscreenElement !== null
                kw('Fullscreen ' + isFullscreenNow)
            }
        },

        watch: {
            sources() {
                kw('sources has changed: ', this.sources)
                if (this.sources && this.sources.length) {
                    if (this.player) {
                        this.player.src(this.options.sources)
                    } else {
                        this.initialize()
                    }
                }
            },

            start() {
                kw('start has changed: ', this.start)
                document.getElementById('purpleVideo_html5_api').currentTime = this.start
                if (document.getElementById('purpleVideo_html5_api').paused) document.getElementById('purpleVideo_html5_api').play()
            }
        },

        beforeDestroy() {
            if (this.player) {
                this.dispose(() => {
                    k('destroyed!')
                })
            }

            document.removeEventListener("pause", this.handleAppPause, false);
        }

    }
</script>

<style>

</style>
