<template>

    <div style="background: #000;">

        <q-modal
          v-model="openModal"
          :content-css="{minWidth: '80vw', minHeight: '80vh'}"
        >
            <q-modal-layout>
                <q-toolbar slot="header" :style="chapterStyle">
                    <div class="q-toolbar-title" style="font-size: 1.5rem;">
                        Chapters
                    </div>
                    <q-btn flat @click="openModal = false">
                        <q-icon style="font-size: 1.5rem;" name="fas fa-times" />
                    </q-btn>
                </q-toolbar>

                <chapterMenu
                    :currentChapter="currentChapter"
                    v-if="openModal"
                    @selectChapter="$emit('selectChapter', $event)"
                    @selectChapterHeading="$emit('selectChapterHeading', $event)"
                    @closeChapters="openModal = false"
                />
            </q-modal-layout>
        </q-modal>

        <MediaMenu slot="header" style="z-index: 0;" />

        <q-inner-loading :visible="!currentChapter" style="z-index: 999;" />

        <purple-video
            ref="videoPlayer"
            id="watch"
            :options="playerOptions"
            v-if="playerOptions.sources && playerOptions.sources.length"
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
</template>

<script>
import PurpleVideo from '../../common/player/PurpleVideo'
import chapterMenu from '../../common/player/chapterMenu'
import MediaMenu from '../../common/player/MediaMenu'
import { videoPlayback } from '../../../mixins/videoPlayback'

export default {
    props: ['currentChapter', 'playerOptions'],

    mixins: [videoPlayback],

    components: {
        chapterMenu,
        MediaMenu,
        PurpleVideo,
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

        windowWidth() {
            return this.$store.state.windowWidth
        },

        chapterStyle() {
            return `position: absolute; top: 0; width: 100%; z-index: 999; background: ${this.brandColor ? this.brandColor : '#777'} !important;`
        },

        brandColor() {
            return this.brand.brandColor
        }
    },

    watch: {
        videoPaused() {
            k('videoPaused: ', this.videoPaused)
        },
    },
}
</script>

<style scoped>
.pchip {
    font-size: 0.8rem;
    background: #2196f3;
    color: #000;
    padding: 0.1rem 0.3rem;
    /*margin: .25rem;*/
    border-radius: 0.2rem;
    /*float: right;*/
}

.transportButton {
    padding: 0.25rem;
    border-radius: 0 !important;
    color: #000 !important;
}

.transportButton span {
    font-size: 1rem;
}

.q-icon {
    margin: 0.5rem;
    font-size: 1rem;
}

.q-btn-big {
    min-height: 44px !important;
}
</style>
