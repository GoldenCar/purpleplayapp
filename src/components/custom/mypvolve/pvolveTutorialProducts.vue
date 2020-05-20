<template>

    <div id="tutorials">
        <PvolveTrialBanner />
        <ninetyDayChallengeBanner />

        <div class="row well justify-center">

            <h3 class="col-12" align="center" :style="`color: ${brandColor};`">
                Beginner Workouts & Tutorials
            </h3>

            <q-inner-loading :visible="showLoader" style="z-index: 9;" />

            <div v-if="showLoader" class="col-12 row" style="padding: 1rem;">
                <div
                    v-for="n in 9"
                    class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3"
                    style="padding: .5rem;"
                >
                    <contentPlaceholder />
                </div>
            </div>

            <div
                v-if="!showLoader && environmentProducts && environmentProducts.length"
                v-for="item in tutorialWorkouts"
                class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3"
                style="padding: .5rem;"
            >
                <pvolveProductCard class="productCard" :componentData="item" />
            </div>

        </div>

    </div>


</template>

<script>
import contentPlaceholder from '../../common/contentPlaceholder'
import pvolveProductCard from './pvolveProductCard'
import PvolveTrialBanner from './PvolveTrialBanner'
import ninetyDayChallengeBanner from './ninetyDayChallengeBanner'

import { pvolveColors } from './pvolveColors'
import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
import { globalComputedData } from '../../../mixins/globalComputedData'

export default {
    data() {
        return {

        }
    },

    mixins: [pvolveColors, userAndProductInfo, globalComputedData],

    components: {
        PvolveTrialBanner,
        ninetyDayChallengeBanner,
        contentPlaceholder,
        pvolveProductCard,
    },

    computed: {
        showLoader() {
            return !this.appOffline && this.environmentProductAndTagState.indexOf('fetching') > -1 ? true : false
        },

        tutorialWorkouts() {
            return this.environmentProducts
                ? this.environmentProducts.filter(product => {
                      return product.tags.split(',').includes('5494') || product.tags.split(',').includes('15')
                  })
                : ''
        },
    },

    methods: {

    },

    watch: {
        userInfo() {
            if (this.userInfo) this.getUserPreferences(() => {})
        },

        appOffline() {
            if (this.appOffline) {
                this.route('/library')
            }
        }
    },

    created() {
        if (this.userInfo) this.getUserPreferences(() => {})
    },
}
</script>

<style>
</style>
