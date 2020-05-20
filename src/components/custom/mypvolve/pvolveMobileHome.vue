<template>

    <div id="home">

        <PvolveTrialBanner />

        <div id="pvolveOptionShelf" class="row full-width bg-white">

            <div v-if="shelfItems" class="row well justify-center">
                <div
                    v-for="item in shelfItems"
                    @click="shelfAction(item)"
                    class="col-xs-12 col-sm-6 col-lg-3 cursor-pointer relative-position"
                    style="padding: .5rem;"
                >
                    <div :style="shelfOptionStyle(item)">
                        <!--<img :src="item.imageURL" style="max-width: 100%;" />-->
                        <div v-html="item.title" style="line-height: .5rem;"></div>
                    </div>
                </div>

                <div class="col-sm-12" style="padding: .5rem;" align="center">
                    <q-btn outline @click="showOnboarding" :style="`background: #fff !important; color: #333;`">
                        <h6 class="thickHeader" style="letter-spacing: 1px;">
                            {{windowWidth > 370 ? (contentSchedulePreferences ? 'Change' : 'Create') : ''}} Workout Plan
                        </h6>
                    </q-btn>
                </div>
            </div>

        </div>

        <pvolveStructuredProductsHome v-if="ownsSubscription" :componentData="{
          'id': 'pvolveStructuredProductsHome',
          'component': 'pvolveStructuredProductsHome',
          'componentPath': 'mypvolve/pvolveStructuredProductsHome.html',
          'heading': 'P\'s structured plans',
          'headingColor': '#555',
          'backgroundColor': '#fff',
          'visibility': {
            'showcase': true
          }
        }" />

        <pvolveFilterResultProductGrid :componentData="{
          'id': 'filterResults',
          'component': 'pvolveFilterResultProductGrid',
          'componentPath': 'mypvolve/pvolveFilterResultProductGrid.html',
          'productScope': 'bundleProducts',
          'filterOnlyMode': false,
          'tags': '',
          'showTagSidebar': true,
          'customTagSidebar': 'pvolveTagSidebar',
          'columnClass': 'col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3',
          'visibility': {
            'showcase': true
          }
        }" />

    </div>


</template>

<script>
import contentPlaceholder from '../../common/contentPlaceholder'
import pvolveProductCard from './pvolveProductCard'
import PvolveTrialBanner from './PvolveTrialBanner'
import pvolveStructuredProductsHome from './pvolveStructuredProductsHome'
import pvolveFilterResultProductGrid from './pvolveFilterResultProductGrid'

import { pvolveColors } from './pvolveColors'
import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
import { globalComputedData } from '../../../mixins/globalComputedData'

export default {
    data() {
        return {
            shelfOptionStyle(item) {
                return `height: 100%; color: #fff; background: url(${item.imageURL}) 50% 0% / cover; padding: 2rem 1rem;`
            },
        }
    },

    mixins: [pvolveColors, userAndProductInfo, globalComputedData],

    components: {
        PvolveTrialBanner,
        contentPlaceholder,
        pvolveProductCard,
        pvolveStructuredProductsHome,
        pvolveFilterResultProductGrid
    },

    computed: {
        showLoader() {
            return !this.appOffline && this.environmentProductAndTagState.indexOf('fetching') > -1 ? true : false
        },

        shelfItems() {
            return [{
                title: '<h2 style="line-height: 3rem;">Beginners <br /> start here</h2>',
                imageURL: 'https://vault.platformpurple.com/static/clients/mypvolve/shelfOption1.jpg',
                route: '/beginners'
            },
            {
                title: `<h2 style="line-height: 3rem;">P's structured plans</h2>`,
                imageURL: 'https://vault.platformpurple.com/static/clients/mypvolve/shelfOption2.jpg',
                scrollTo: 'pvolveStructuredProductsHome'
            },
            {
                title: '<h2 style="line-height: 3rem;">Create <br /> my workout</h2>',
                imageURL: 'https://vault.platformpurple.com/static/clients/mypvolve/shelfOption3.jpg',
                route: '/onboarding'
            },
            {
                title: '<h2 style="line-height: 3rem;">Browse <br /> the library</h2>',
                imageURL: 'https://vault.platformpurple.com/static/clients/mypvolve/shelfOption4.jpg',
                scrollTo: 'pvolveFilterResultProductGrid'
            }]
        },

        structuredProducts() {
            return this.environmentProducts
                ? this.environmentProducts.filter(product => {
                      return product.tags.includes('5763')
                  })
                : []
        },

        userAccessToAnyShelfItems() {
            return this.structuredProducts
                ? this.structuredProducts.filter(item => {
                      return this.userHasAccess([item.productID])
                  }).length
                : ''
        },

        contentSchedulePreferences() {
            return this.userPreferences
                ? this.userPreferences.filter(item => {
                      return item.type === 'contentSchedulePreferences'
                  })[0]
                : ''
        },

        newWorkouts() {
            return this.environmentProducts
                ? this.environmentProducts.filter(product => {
                      return product.tags.split(',').includes('5521')
                  })
                : ''
        },

        userSubscriptionProductStatusHistory() {
            return this.$store.state.userSubscriptionProductStatusHistory
        },

        ownsSubscription() {
            return this.userSubscriptionProductStatusHistory ? this.userSubscriptionProductStatusHistory.filter((status) => {
                return status.accessStatus && status.accessStatus !== 'inactive'
            }).length ? true : false : false
        }
    },

    methods: {
        shelfAction(item) {
            if (item.route) this.route(item.route)
            if (item.scrollTo) {
                this.scrollIt(item.scrollTo, '', 50)
            }
            if (item.action) this[item.action](item)
        },

        showOnboarding() {
            this.route('/onboarding')
        },
    },

    watch: {
        userInfo() {
            if (this.userInfo) this.getUserPreferences(() => {})
        },

        appOffline() {
            if (this.appOffline) {
                this.route('/library')
            }
        },
    },

    created() {
        if (this.userInfo) this.getUserPreferences(() => {})
    },
}
</script>

<style>
</style>
