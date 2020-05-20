<template>

    <div class="position-relative">
        <MediaMenu style="border-bottom: 1px solid #ccc;" />

        <div class="well">
            <q-card>
                <div style="background: linear-gradient(#efefef, #999); padding: 1rem;">

                    <div class="row">
                        <div class="col-md-3 col-lg-2" align="center" style="padding: 0 .5rem;">
                            <img :src="coverImageURL" style="max-width: 100%; max-height: 11rem;" />
                        </div>

                        <div class="col-md-9 col-lg-10" style="padding: 0 .5rem;">
                            <h5 style="line-height: 1.5rem; margin-top: .5rem;">{{currentProduct.productName}}</h5>
                            <p style="font-size: 1rem;">{{currentTrack.displayName}}</p>

                            <!--<q-inner-loading :visible="!audioSrc" style="z-index: 999;" />-->

                            <audio
                                ref="audioPlayer"
                                id="listen"
                                :src="audioSrc"
                                v-if="audioSrc"
                                controls
                                controlsList="nodownload"
                                autoplay
                                :class="(audioPaused ? 'paused' : 'playing')"
                                @play="onPlayerPlay($event)"
                                @pause="onPlayerPause($event)"
                                @ended="onPlayerEnded($event)"
                                @playing="onPlayerPlaying($event)"
                                @timeupdate="onPlayerTimeupdate($event)"
                                @loadeddata="onPlayerLoadeddata($event)"
                                @ready="playerReadied"
                                style="min-height: 40px;"
                            ></audio>

                            <!-- <div id="playerTransport" class="col-12 row" style="position: relative;"> -->
                                <!-- <q-btn @click="downloadAudioZip()" v-if="audioZipURL" class="col" color="secondary" :style="brandColor ? 'background: ' + brandColor + ';' : ''">
                                    <q-icon name="fas fa-download" />
                                </q-btn>

                                <q-btn id="previousTrackButton" flat size="lg" class="col bg-grey-4 transportButton" @click="$emit('prevTrack')">
                                    <q-icon name="fas fa-step-backward" />
                                </q-btn> -->

                                <!-- <q-btn id="playPauseButton" flat size="lg" class="col bg-grey-4 transportButton" @click="$emit('togglePlay')">
                                    <q-icon :name="audioPaused ? 'fas fa-play' : 'fas fa-pause'" />
                                </q-btn> -->

                                <!-- <q-btn id="nextTrackButton" flat size="lg" class="col bg-grey-4 transportButton" @click="$emit('nextTrack')">
                                    <q-icon name="fas fa-step-forward" />
                                </q-btn>

                                <q-btn v-if="!brand.hideAdvancedControls" id="advancedControlsButton" flat size="lg" class="col bg-grey-4 transportButton" @click="advancedPlaybackControls = !advancedPlaybackControls">
                                    <q-icon name="fas fa-cogs" style="margin-right: .5rem;" :color="advancedPlaybackControls ? 'primary' : 'grey-9'" />
                                    <span class="gt-md">advanced</span>
                                </q-btn> -->
                            <!-- </div> -->

                             <div v-if="advancedPlaybackControls" id="advancedControls" class="col-12 row">
                                <q-btn id="loopInBtn" flat size="lg" class="col bg-grey-4 transportButton" @click="setLoopIn()">
                                    <q-icon name="fas fa-undo" style="margin-right: .5rem;" color="grey-9" />
                                    <span class="gt-sm">loop in</span>
                                    <span class="lt-md">in</span>
                                    <q-chip v-if="loopInPoint" color="primary" style="margin-left: .5rem;">
                                        {{Math.round(loopInPoint)}}
                                    </q-chip>
                                </q-btn>

                                <q-btn id="loopToggleBtn" flat size="lg" :class="'col transportButton ' + (loopOn ? 'bg-blue' : 'bg-grey-4')" @click="loopOn = !loopOn">
                                    <q-icon name="fas fa-sync-alt" style="margin-right: .5rem;" color="grey-9" />
                                    <span class="gt-sm">toggle</span>
                                </q-btn>

                                <q-btn id="loopOutBtn" flat size="lg" class="col bg-grey-4 transportButton" @click="setLoopOut()">
                                    <q-icon name="fas fa-undo" style="margin-right: .5rem;" color="grey-9" />
                                    <span class="gt-sm">loop out</span>
                                    <span class="lt-md">out</span>
                                    <q-chip v-if="loopOutPoint" color="primary" style="margin-left: .5rem;">
                                        {{Math.round(loopOutPoint)}}
                                    </q-chip>
                                </q-btn>

                                <div v-if="showSpeedControl" id="videoSpeedBtn" class="col bg-grey-4 transportButton">
                                    <q-select
                                        align="center"
                                        class="full-width"
                                        :float-label="windowWidth > 552 ? 'Speed' : ''"
                                        v-model="currentPlaybackRate"
                                        :options="playbackRatesForSelection"
                                        @input="changePlaybackRate"
                                        style="padding: .25rem; font-size: 1rem;"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <trackMenu class="full-width" :currentTrack="currentTrack" @selectTrack="$emit('playTrack', $event)" />

            </q-card>
        </div>

    </div>

</template>

<script>
    import trackMenu from '../../common/player/trackMenu'
    import MediaMenu from '../../common/player/MediaMenu'
    import { mediaTimeTracking } from '../../../mixins/mediaTimeTracking'
    import { audioPlayback } from '../../../mixins/audioPlayback'
    import { EKBTools } from './EKBTools'

    export default {
        props: ['currentTrack', 'playerOptions', 'audioSrc', 'audioZipURL'],

        components: {
            trackMenu, MediaMenu
        },

        computed: {
            showSpeedControl() {
                return !this.isCordovaApp || (this.isCordovaApp && this.platformID !== 'android')
            },

            isCordovaApp() {
                return this.$store.state.isCordovaApp
            },

            platformID() {
                return this.$store.state.platformID
            },

            coverImageURL() {
                if (Array.isArray(this.currentProduct.thumbnails)) {
                  let playerSizeThumbnail = this.currentProduct.thumbnails.find(thumbnail => thumbnail.size === 'player')
                  if (playerSizeThumbnail) return playerSizeThumbnail.url

                  return 'statics/ekb/type-icons/' + this.getEKBProductTypeIcon(this.currentProduct) + '.png'
                } else {
                  return 'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + this.currentProduct.productSKU + '/' + this.currentProduct.productSKU + '_image_cover.png'
                }
            },
        },

        mixins: [mediaTimeTracking, audioPlayback, EKBTools],

        watch: {
            audioPaused() {
                k('audioPaused: ', this.audioPaused)
            }
        }

    }
</script>

<style scoped>
    .transportButton {
        padding: .25rem;
        border-radius: 0 !important;
        color: #000 !important;
    }

    .transportButton span {
        font-size: 1rem;
    }

    #listen {
        width: 100%;
    }

    .q-icon {
        margin: .5rem;
        font-size: 1rem;
    }
</style>
