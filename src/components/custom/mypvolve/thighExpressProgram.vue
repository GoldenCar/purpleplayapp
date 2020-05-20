<template>

    <div class="row relative-position" style="min-height: 3rem; padding-bottom: 3rem;">

        <div class="col-12">
            <q-inner-loading :visible="showLoader" />
        </div>

        <div class="col-12" style="padding-bottom: .5rem;">
            <q-btn id="backToLibrary" @click="route($store.state.comingFrom)" flat :style="'color: ' + pvolveSalmon + '; margin-top: .5rem;'">
                <q-icon name="fas fa-chevron-left" style="margin-right: .5rem;" />
                <h6>Back</h6>
            </q-btn>
        </div>

        <div class="row full-width items-center justify-center" style="padding: 1rem;">
            <h6 class="col-12 text-grey-8" align="center">The</h6>
            <h3 class="col-12 thickHeader text-grey-8" align="center">Express Series:</h3>
            <h1 class="col-12 " align="center" :style="`font-size: 4rem; line-height: 3rem; color: ${pvolveMintTitle};`">THIGH</h1>

            <div class="col-12" style="margin-top: 1rem; max-width: 800px; padding: 1rem;">
                <h6 align="center" class="text-grey-8" style="text-transform: none;" v-html="currentProduct.productBlurb"></h6>
            </div>
        </div>

        <transition
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
        >
            <div v-if="currentProduct" class="bg-grey-3 full-width">
                <div class="well row" :style="`padding: ${windowWidth > 767 ? '2rem' : '1rem'};`">
                    <div v-for="(item, index) in chapters" class="col-xs-6 col-sm-3 day" @click="launchWorkout(index)" style="cursor: pointer;">

                        <div class="card">
                            <!--<div class="dayHeader" align="center" :style="'background: ' + (index === currentChapterIndex ? pvolveSalmon : pvolveMintTitle) + ';' ">-->
                            <!--    <h6 align="center">{{item.displayName}}</h6>-->
                            <!--</div>-->

                            <div>
                                <img :src="'https://vault.platformpurple.com/static/clients/mypvolve/ThighExpress_' + (index + 1) + '.jpg'" style="width: 100%;" />
                            </div>

                            <div style="margin-top: -1.75rem;" align="right">
                                <q-btn class="shadow-0" size="xs" :style="'background: ' + (index === currentChapterIndex ? pvolveSalmon : '#616161') + '; padding: .25rem;'" >
                                    <q-icon name="fas fa-play-circle" color="white" />
                                </q-btn>
                            </div>
                        </div>

                        <!--<q-card class="bg-white">-->
                        <!--    <q-card-media>-->
                        <!--        <img src="https://f3r6v6t8.ssl.hwcdn.net/static/previews/bodi4453_week9-243/bodi4453_week9-243_500px_cover.png" />-->
                        <!--    </q-card-media>-->

                        <!--    <q-card-main>-->
                        <!--        {{item.displayName}}-->
                        <!--    </q-card-main>-->
                        <!--</q-card>-->
                    </div>
                </div>
            </div>
        </transition>

        <transition
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
        >
            <div v-if="currentProduct" class="col-12 bg-grey-2" style="padding-bottom: 2rem;">
                <VideoHold :videoLayout="videoLayout" />
            </div>
        </transition>

    </div>

</template>

<script>
import PurpleVideo from '../../common/player/PurpleVideo'
import VideoHold from '../../common/player/VideoHold'

import { pvolveColors } from './pvolveColors'
import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
import { mediaTimeTracking } from '../../../mixins/mediaTimeTracking'
import { designTools } from '../../../mixins/designTools'
import { productInfoTools } from '../../../mixins/productInfoTools'

export default {
    props: ['componentData'],

    components: {
        PurpleVideo,
        VideoHold,
    },

    mixins: [pvolveColors, userAndProductInfo, mediaTimeTracking, designTools, productInfoTools],

    data() {
        return {
            showLoader: true,
            productID2Play: 155563,
            videoLayout: '',
        }
    },

    computed: {
        environmentProducts() {
            return this.$store.state.environmentProducts
        },

        currentProduct() {
            return this.$store.state.currentProduct
        },

        chapters() {
            return this.$store.state.currentProduct.productJSON.video
        },

        currentChapterIndex() {
            return this.$store.state.currentChapterIndex
        },

        environmentJSON() {
            return this.$store.state.environment.json
        },

        userSubscriptionProductStatusHistory() {
            return this.$store.state.userSubscriptionProductStatusHistory
        },

        subscriptionAccessType() {
            return this.userSubscriptionProductStatusHistory && this.userSubscriptionProductStatusHistory.length ? this.userSubscriptionProductStatusHistory[0].accessType : ''
        },

        productLaunchContext() {
            return this.$store.state.productLaunchContext
        },

        downloadedProducts() {
            return this.$store.state.downloadedProducts
        },

        productIsDownloaded() {
            return this.downloadedProducts.length ? this.downloadedProducts.filter(item => {
                // k('productIsDownloaded: ', item.productID, this.componentData.productID)
                return item.productID === this.productID2Play
            })[0] : false
        },

        waitForMutationToExitMedia() {
            return this.$store.state.waitForMutationToExitMedia
        },
    },

    methods: {
        getProductMeta() {
            k('getProductMeta: ', this.productID2Play)
            this.showLoader = true

            this.getProductMetaFromAPI(this.productID2Play, res => {
                this.showLoader = false

                if (res.success) {
                    let product = res.productMeta
                    k('PRODUCT META: ', product)
                    this.$store.commit('setCurrentProduct', product)

                    var logEventObj = {
                        eventType: 'productLaunch',
                        eventDesc: 'launching product "' + product.productName + '"',
                        productName: product.productName,
                        productSKU: product.productSKU,
                        productID: product.productID,
                        context: this.productLaunchContext ? this.productLaunchContext : 'directRoute',
                        userID: this.$store.state.user.info.userID,
                        os: this.$store.state.userAgentInfo.os.name
                    }

                    this.api.sendEvent(logEventObj)
                }
            })
        },

        launchWorkout(index) {
            k('launchWorkout: ', index)

            if (this.waitForMutationToExitMedia) return false

            this.$store.commit('chapterIndexToStartFrom', index)
        },

        checkUserAccess() {
            k('checkUserAccess to thigh express: ')
            k(this.userHasAccess([String(this.productID2Play)]))

            if (this.userHasAccess([String(this.productID2Play)])) {
                if (this.productIsDownloaded) {
                    this.showLoader = false
                    this.$store.commit('setCurrentProduct', this.productIsDownloaded)
                } else {
                    this.getProductMeta()
                }

                this.loadIt('structuredProgramVideoLayout', 'custom/mypvolve/structuredProgramVideoLayout')
                this.videoLayout = 'structuredProgramVideoLayout'
            } else {
                // go back
                this.route('/library')
            }
        },
    },

    watch: {
        environmentProducts() {
            this.checkUserAccess()
        },
    },

    created() {
        k('three day program created! ', this.componentData)

        this.$store.commit('setCurrentProduct', '')

        if (this.environmentProducts) {
            this.checkUserAccess()
        }
    },
}
</script>

<style scoped>
.card {
    position: relative;
    background: #fff;
    /*height: 100%;*/
    border: 1px solid #ddd;
    cursor: pointer;
    /*margin-bottom: 2rem;*/
}

.day {
    width: 14.28%;
    display: block;
}

.dayDate {
    color: #999;
    background: #fff;
    padding: 0.3rem;
}

.dayHeader {
    background: #999;
    color: #fff;
    padding: 0.3rem;
}
</style>
