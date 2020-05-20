<template>
    <div>
        <PvolveTrialBanner />
        <ninetyDayChallengeBanner />

        <div class="row justify-center relative-position" style="padding-bottom: 1rem;">
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

            <div v-if="!showLoader" class="col-12 row">

                <div v-if="showSearchbar" class="col-12 bg-white" style="padding: 1rem; width: 100%; z-index: 9;">
                    <q-search inverted clearable color="grey" v-model="localSearchString" @input="filterBySearch" />
                </div>

                <div class="col-12">

                    <div v-if="appOffline || (!appOffline && (environmentProducts && environmentProducts.length))" class="row bg-white justify-center relative-position" style="padding: 1rem;">

                        <div class="col-12" align="center">
                            <h3 class="col-12" align="center" style="margin: 1rem 0;">
                                <span :style="`color: ${pvolveMintTitle};`">{{showDownloadsOnly || appOffline ? 'Downloaded Workouts' : (searchString || userSelectedTags.length ? 'Filtered Workouts' : 'All Workouts')}}</span>
                            </h3>

                            <h6 v-if="(showDownloadsOnly || appOffline) && !downloadedProducts.length">No downloads yet.{{appOffline ? ' Connect your device to the internet to download content.' : ''}}</h6>
                        </div>

                        <div v-if="!appOffline && displayProducts && displayProducts.length" class="col-12 row justify-center" align="center" style="padding: .5rem;">

                            <q-btn v-if="environmentTagHeadingObj" outline size="xs" @click="toggleFilters()" style="background: #fff !important; color: #333; margin: .25rem;">
                                <h6 class="thickHeader" style="font-size: .8rem; color: #524F4C; margin: 0; letter-spacing: 1px;">
                                    Filter Workouts
                                    <span v-if="userSelectedTags.length" :style="`background: ${pvolveMintTitle}; color: #fff; padding: 0 .25rem; border-radius: .25rem;`">{{userSelectedTags.length}}</span>
                                    <q-icon :name="showTagSidebar ? 'fas fa-chevron-down' : 'fas fa-chevron-right'" :style="`color: ${pvolveMintTitle}; margin-right: 0; font-size: .8rem;`" />
                                </h6>
                            </q-btn>

                        </div>

                        <div v-if="!appOffline && showTagSidebar" class="col-12" style="padding: .5rem">
                            <div class="full-width bg-grey-3" style="padding: .5rem;">
                                <div
                                    :is="tagSidebar"
                                    :productScope="environmentProducts"
                                    :tagScope="environmentTags"
                                    :tagHeadingsObj4Scope="environmentTagHeadingObj"
                                    @selectTag="selectTag"
                                />
                            </div>
                        </div>

                        <div v-if="(searchString || userSelectedTags.length) && !displayProducts.length" class="col-12" align="center">
                            <h6>No results found.</h6>
                        </div>

                        <div
                            v-for="item in displayProducts"
                            class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3"
                            style="padding: .5rem;"
                        >
                            <pvolveProductCard class="productCard" :componentData="item" />
                        </div>
                    </div>

                </div>

                <div id="bottomOfGrid" v-if="showScrollFire && (productsToLoad.length > displayProducts.length)" class="col-12 bg-white" style="min-height: 2rem; position: relative;">
                    <q-inner-loading visible />
                </div>

            </div>
        </div>
    </div>

</template>

<script>
import contentPlaceholder from '../../common/contentPlaceholder'
import pvolveProductCard from './pvolveProductCard'
import PvolveTrialBanner from './PvolveTrialBanner'
import ninetyDayChallengeBanner from './ninetyDayChallengeBanner'

import { globalComputedData } from '../../../mixins/globalComputedData'
import { contentItemFiltering } from '../../../mixins/contentItemFiltering'
import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
import { pvolveColors } from './pvolveColors'
import { pvolveLibrarySortTools } from './pvolveLibrarySortTools'

import OnScreen from 'onscreen'
const os = new OnScreen()

export default {
    data() {
        return {
            productTypes2Hide: ['channel', 'bundleProduct', 'modcontent_bundle', 'test_modcontent_bundle', 'offline_channel'],

            itemImageURL(item) {
                return 'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + item.productSKU + '/' + item.productSKU + '_500px_cover.png'
            },

            localSearchString: '',

            displayBatch: 1,
            productDisplayBatchLength: 20,
            showScrollFire: false,
            showSearchbar: false,
            showTagSidebar: false,
        }
    },

    mixins: [globalComputedData, contentItemFiltering, userAndProductInfo, pvolveColors, pvolveLibrarySortTools],

    components: {
        PvolveTrialBanner,
        contentPlaceholder,
        pvolveProductCard,
    },

    computed: {
        searchString() {
            return this.$store.state.searchString
        },

        appOffline() {
            return this.$store.state.appOffline
        },

        forSubmission() {
            return window.forSubmission
        },

        productsToLoad() {
            var productsToLoad = ''

            if (this.productPool) {
                productsToLoad = this.productPool

                // only one sort at a time
                if (this.sortLibraryTopRated) productsToLoad = this.topRatedSort
                if (this.sortLibraryMostRecent) productsToLoad = this.mostRecentSort
                if (this.showFavoritesOnly) productsToLoad = this.onlyFavoritedProducts
                if (this.showExclusiveContentOnly) productsToLoad = this.onlyExclusiveContent
            }

            return productsToLoad
        },

        displayProducts() {
            var displayProducts = this.productsToLoad.slice(0, this.productDisplayBatchLength * this.displayBatch)
            k('displayingProducts: ', displayProducts)

            return displayProducts
        },

        topRatedSort() {
            var productPool = this.j_.cloneObject(this.productPool)
            return productPool.sort((a, b) => {
                return b.avgRating - a.avgRating
            })
        },

        mostRecentSort() {
            var productPool = this.j_.cloneObject(this.productPool)
            return productPool.sort((a, b) => {
                return b.productID - a.productID
            })
        },

        onlyFavoritedProducts() {
            var productPool = this.j_.cloneObject(this.productPool)
            return productPool.filter(product => this.favoritedProductIDs.includes(product.productID))
        },

        onlyExclusiveContent() {
            var productPool = this.j_.cloneObject(this.productPool)
            return productPool.filter(product => product.productType === 'exclusiveContent')
        },

        productPool() {
            // var productsToSearch = this.appOffline || this.showDownloadsOnly ? this.downloadedProducts : this.productScope
            var productsToSearch = this.appOffline ? this.downloadedProducts : this.showDownloadsOnly && this.allDownloads.length ? this.allDownloads : this.productScope
            // k('productsToSearch: ', productsToSearch)

            if (this.userSelectedTags && this.userSelectedTags.length) {
                productsToSearch = this.getProductsThatMatchTags(this.userSelectedTags, productsToSearch)
            }

            // searching and filtering
            return this.searchString
                ? productsToSearch.filter(item => {
                      return item.searchString.toLowerCase().includes(this.searchString.toLowerCase())
                  })
                : productsToSearch
        },

        productScope() {
            return this.userActiveProducts ? this.userActiveProducts : []
        },

        userActiveProducts() {
            return this.environmentProducts
                ? this.environmentProducts.filter(product => {
                      return product.userActiveProduct && product.webplayer && (product.productType == 'bundleProduct' || product.productType === 'exclusiveContent')
                  })
                : ''
        },

        specialRouteProducts() {
            return this.environmentProducts
                ? this.environmentProducts.filter(item => {
                      // k('valid Product? ', item.productName, this.brand.specialProductRoutes[item.productID])
                      return this.brand.specialProductRoutes && this.brand.specialProductRoutes[item.productID]
                  })
                : []
        },

        downloadedProducts() {
            return this.$store.state.downloadedProducts
        },

        productDownloadQueue() {
            return this.$store.state.productDownloadQueue
        },

        allDownloads() {
            return this.productDownloadQueue.concat(this.downloadedProducts)
        },

        showDownloadsOnly() {
            return this.$store.state.showDownloadsOnly
        },

        showLoader() {
            return !this.appOffline && this.environmentProductAndTagState.indexOf('fetching') > -1 ? true : false
        },

        freeProducts() {
            return this.$root.$store.state.freeProducts
        },

        tagSidebar() {
            return this.brand.clientTagSidebar
        },
    },

    watch: {
        environmentProducts() {
            this.showScrollFire = true
        },

        environmentProductAndTagState() {
            k('environmentProductAndTagState: ', this.environmentProductAndTagState)
        },

        showLoader() {
            k('showLoader: ', this.showLoader)
        },

        allDownloads() {
            if (!this.allDownloads.length && this.showDownloadsOnly) this.$store.commit('showDownloadsOnly', false)
        },

        searchString() {
            k('filter by search')
            this.localSearchString = this.searchString

            if (this.searchString) {
                var logEventObj = {
                    eventType: 'filterLibraryProductsBySearch',
                    searchText: this.searchString,
                    eventDesc: 'filtering products by search string "' + this.searchString + '"',
                }

                this.api.sendEvent(logEventObj)
            }
        },

        userSelectedTags() {
            k('environmentTags: ', this.environmentTags)

            if (this.userSelectedTags && this.userSelectedTags.length) {
                var tagNames = []
                this.userSelectedTags.forEach(tagID => {
                    tagNames.push(this.environmentTags[tagID].tagName)
                })

                var logEventObj = {
                    eventType: 'filterLibraryProductsByTag',
                    eventDesc: 'filtering products by tags: "' + tagNames.join(', ') + '"',
                    userSelectedTagIDs: this.userSelectedTags,
                    userSelectedTagNames: tagNames,
                }

                k('logEventObj: ', logEventObj)
                this.api.sendEvent(logEventObj)
            }
        },

        favoritedProductIDs() {
            k('favoritedProductIDs: ', this.favoritedProductIDs)

            if (this.favoritedProductIDs && !this.favoritedProductIDs.length && this.showFavoritesOnly) {
                this.$store.commit('setShowFavoritesOnly', false)
            }
        },

        userInfo() {
            if (this.userInfo) this.getUserPreferences(() => {}, true)
        },
    },

    mounted() {
        if (this.environmentProducts) this.showScrollFire = true

        if (this.userInfo) this.getUserPreferences(() => {}, true)
    },

    created() {
        k('environmentProductAndTagState: ', this.environmentProductAndTagState)

        // search filtering
        if (this.searchString) {
            this.localSearchString = this.searchString
            this.showSearchbar = true
        }

        this.$root.$on('toggleSearchbar', () => {
            if (this.showSearchbar) this.$store.commit('saveSearchString', '')
            this.showSearchbar = !this.showSearchbar

            window.scrollTo({
                behavior: 'smooth',
                left: 0,
                top: 0,
            })
        })

        // show tag filtering
        this.$root.$on('toggleTagSidebar', () => {
            // if (this.showTagSidebar) this.$store.commit('saveSearchString', '')
            this.showTagSidebar = !this.showTagSidebar
        })

        // lazy loading
        os.on('enter', '#bottomOfGrid', element => {
            // k('i see the bottom!')
            this.displayBatch++
        })

        os.on('leave', '.pvolveCard .pvolveCoverImage', element => {
            // k('leave: ', element)
            element.style.visibility = 'hidden'
        })

        os.on('enter', '.pvolveCard .pvolveCoverImage', element => {
            // k('enter: ', element)
            element.style.visibility = 'visible'
        })
    },

    methods: {
        selectTag(tagID) {
            k('selectTag: ', tagID, this.userSelectedTags)
            this.$store.commit('userSelectedTag', String(tagID))
        },

        filterBySearch(val) {
            k('filterBySearch: ', val)

            this.$store.commit('saveSearchString', val)
            window.scrollTo({
                behavior: 'smooth',
                left: 0,
                top: 0,
            })

            this.api.sendEvent({
                eventType: 'userSearchedContent',
                eventDesc: 'user searched for ' + val,
                searchVal: val,
                userID: this.userInfo.userID,
            })
        },

        toggleFilters() {
            this.showTagSidebar = !this.showTagSidebar
            window.scrollTo({
                behavior: 'smooth',
                left: 0,
                top: 0,
            })
        },
    },
}
</script>

<style>
.q-search .q-icon {
    margin-bottom: 0.2rem;
}
</style>
