<template>

    <q-toolbar style="background: #1A1A1A !important;">

        <q-btn id="closeVideoPlayer" style="padding: 0 .5rem;" @click="exitMedia()" flat>
            <q-icon color="white" name="fas fa-chevron-left" />
        </q-btn>

        <q-toolbar-title align="center">
            {{currentProduct.productName}} {{currentChapter.displayName ? `- ${currentChapter.displayName}` : ''}}
        </q-toolbar-title>

        <q-btn
            v-if="mediaTypesForProduct.length > 1"
            flat
            color="white"
            style="padding: 0 .5rem;"
            @click="openMediaModal = !openMediaModal"
        >
            <q-icon name="fas fa-play-circle" style="margin: 0 .5rem;" />
            <span class="gt-sm">Media</span>
        </q-btn>

        <q-modal
          v-model="openMediaModal"
          :content-css="{minWidth: '80vw', minHeight: '80vh'}"
        >
            <q-modal-layout>
                <q-toolbar class="q-layout-header" :style="chapterStyle">
                    <h6 class="q-toolbar-title">
                        Media Options
                    </h6>
                    <q-btn flat @click="openMediaModal = false">
                        <q-icon name="fas fa-times" />
                    </q-btn>
                </q-toolbar>

                <q-list link separator>
                    <q-item
                        v-for="item in mediaTypesForProduct"
                        :key="item.text"
                        :id="item.text + 'Tab'"
                        @click.native="selectTab(item)"
                    >
                        <q-item-side>
                            <q-icon :name="item.icon" />
                        </q-item-side>
                        <q-item-main>
                            <q-item-tile label>
                                {{item.text}}
                            </q-item-tile>
                        </q-item-main>
                    </q-item>
                </q-list>

            </q-modal-layout>
        </q-modal>

    </q-toolbar>

</template>

<script>
    import { mediaTimeTracking } from '../../../mixins/mediaTimeTracking'

    export default {
        data() {
            return {
                selectedTabID: 'video',
                openMediaModal: false,
                mediaOptions: [{
                    action: 'playProduct',
                    active: '',
                    icon: 'fas fa-video',
                    text: 'video',
                    id: 'video'
                },
                {
                    action: 'playAudioProduct',
                    active: '',
                    icon: 'fas fa-music',
                    text: 'audio',
                    id: 'audio'
                },
                {
                    action: 'showAdditionalMedia',
                    active: '',
                    icon: 'fas fa-folder',
                    text: 'additional media',
                    id: 'pdf'
                }],

                showMediaType(mediaType) {
                    var res = this.currentProduct.productJSON[mediaType]
                    if (mediaType === 'pdf') res = this.currentProduct.productJSON[mediaType] || this.currentProduct.productJSON['zip']
                    return res
                }
            }
        },

        mixins: [mediaTimeTracking],

        computed: {
            mediaTypesForProduct() {
                return this.mediaOptions.filter((mediaType) => {
                    return this.showMediaType(mediaType.id)
                })
            },

            currentChapter() {
                return this.$store.state.currentChapter
            },

            currentProduct() {
                return this.$store.state.currentProduct
            },

            comingFrom() {
                return this.$store.state.comingFrom
            },

            brandColor() {
                return this.brand.brandColor
            },

            chapterStyle() {
                return this.brandColor ? 'background: ' + this.brandColor + ' !important;' : 'background: #777 !important;'
            },

            waitForMutationToExitMedia() {
                return this.$store.state.waitForMutationToExitMedia
            }
        },

        methods: {
            selectTab(item) {
                k('selectTab: ', item)

                // this.selectedTabID = item.id
                this.$store.commit('currentMediaType', item.id)
            },

            exitMedia() {
                k('exitMedia: ', this.comingFrom)

                // if (this.waitForMutationToExitMedia) return false

                // for android because beforeDestroy does not fire
                this.$store.commit('setCurrentChapter', '')
                this.$store.commit('setCurrentChapterIndex', '')
                this.sendCurrentMediaPlayEventIfExists() // send any remaining mediaplay event

                this.$store.commit('currentMediaType', '')

                if (this.$store.state.selectedProductModal) {
                    this.$store.commit('addKeyPathInStore', {
                        keyPath: "selectedProductModal",
                        value: null
                    });
                } else {
                    if (this.comingFrom && this.comingFrom !== '/signin') {
                        this.route(this.comingFrom)
                    } else {
                        this.route('/library')
                    }
                }
            }
        },

        mounted() {

        },

        beforeDestroy() {

        }
    }
</script>

<style>

</style>
