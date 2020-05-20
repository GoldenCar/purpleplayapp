<template>
    <div class="row justify-center relative-position">

        <div v-if="showSearchbar" class="col-12 bg-white shadow-4" style="padding: .5rem; position: fixed; width: 100%; z-index: 9;">
            <q-search inverted clearable color="grey" v-model="localSearchString" @input="filterBySearch" />
        </div>

        <div class="col-12" :style="showSearchbar ? 'padding-top: 3.5rem;' : ''">
            <q-btn v-if="inAppMessage" class="full-width" @click="openInAppMessage()" :style="`background: ${brand.brandColor};`">
                <div v-if="inAppMessageLastUpdated !== inAppMessageLastSeen" :style="`background: ${brand.brandColorSecondary}; color: #fff; border-radius: .2rem; font-size: .8rem; padding: .1rem .25rem; margin-right: .5rem;`">New</div>
                Walk Talk
                <q-icon :name="showInAppMessage ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" style="font-size: .8rem; margin: .75rem;" />
            </q-btn>

            <q-slide-transition>
                <div v-if="showInAppMessage && inAppMessage" class="shadow-6 bg-grey-3" style="position: relative; z-index: 1; padding: 1.5rem;">
                    <div class="bg-white shadow-5" style="font-size: .9rem; padding: 1rem;">
                        <span v-html="inAppMessage" />
                    </div>
                </div>
            </q-slide-transition>

            <div v-if="appOffline || (!appOffline && (environmentProducts && environmentProducts.length) || environmentProductAndTagState.indexOf('fetching') > -1)" class="row bg-grey-3 justify-center relative-position" style="min-height: 3rem; padding: 1rem;">
                <q-inner-loading :visible="showLoader" style="z-index: 9;" />

                <div class="col-12" align="center">
                    <h6>Your {{showDownloadsOnly || appOffline ? 'Downloads' : (searchString || userSelectedTags.length ? 'Filtered Library' : 'Library')}}</h6>
                    <hr />
                </div>

                <div v-if="environmentTagHeadingObj && mwtSubscriber" class="col-12 row justify-center" style="padding: .5rem;">
                    <q-btn-group>
                        <q-btn
                            @click="clearFilters()"
                            :style="`${windowWidth < 525 ? 'padding: .5rem; ' : ''}${userSelectedTags && !userSelectedTags.length ? `color: #444 !important; background-color: ${brandColor} !important;` : 'color: #fff; background-color: #9e9e9e !important;'}`"
                        >
                            <span :style="windowWidth < 525 ? 'font-size: .7rem;' : ''">All</span>
                        </q-btn>
                        <q-btn
                            v-for="filter in multipleSelectOptionsFromTagHeading('distance')"
                            :key="filter.label"
                            @click="selectTag(filter.value)"
                            :style="`${windowWidth < 525 ? 'padding: .5rem; ' : ''}${userSelectedTags && userSelectedTags.includes(String(filter.value)) ? `color: #444 !important; background-color: ${brandColor} !important;` : 'color: #fff; background-color: #9e9e9e !important;'}`"
                        >
                            <span :style="windowWidth < 525 ? 'font-size: .7rem;' : ''">{{filter.label}}</span>
                        </q-btn>
                    </q-btn-group>
                </div>

                <div class="col-12" align="center">
                    <h6 v-if="(showDownloadsOnly || appOffline) && !downloadedProducts.length">No downloads yet.{{appOffline ? ' Connect your device to the internet to download content.' : ''}}</h6>

                    <h6 v-if="(searchString || userSelectedTags.length) && !displayProducts.length">No results found.</h6>
                </div>

                <div v-if="ydwSubscriber && !appOffline && !searchString && !userSelectedTags.length && !showDownloadsOnly" class="col-xs-12 col-sm-3 col-md-2" style="padding: .5rem;" align="center" @click="route('/yourdailywalk')">
                    <div :style="yourDailyWalkCard">
                        <div style="position: absolute; top: 50%; transform: translateY(-50%); width: 100%;">
                            <img style="max-height: 4rem;" src="https://f3r6v6t8.ssl.hwcdn.net/static/shopLogos/yourdailywalk.png?t=1512095195369" />
                            <h6 class="text-white">
                                go to<br />Your Daily Walk
                            </h6>
                        </div>
                    </div>
                </div>

                <div
                    v-for="item in displayProducts"
                    :class="item.productType === 'exclusiveContent' ? 'col-xs-12 col-sm-4 col-md-3' : 'col-xs-6 col-sm-3 col-md-2'"
                    style="padding: .5rem;"
                    align="center"
                    @click="launchProduct(item)"
                >
                    <div :is="clientProductCard" class="productCard" :componentData="item.productType === 'exclusiveContent' ? addExtraItemInfo(item) : item" />
                </div>

            </div>

        </div>

        <div id="bottomOfGrid" v-if="showScrollFire && (productPool.length > displayProducts.length)" class="col-12 bg-grey-3" style="min-height: 2rem; position: relative;">
            <q-inner-loading size="md" :visible="true" />
        </div>

        <!-- <q-modal
            v-model="showInAppMessage"
            :content-css="{minWidth: '100vw', minHeight: '100vh', background: 'rgba(255, 255, 255, .9)' }"
        >
            <q-modal-layout v-if="showInAppMessage" id="inAppMessage">

                <div class="bg-grey-3" style="padding: .75rem 1rem;">
                    <q-icon name="fas fa-comment-alt" align="center" :style="`color: ${brand.brandColor};`"/>

                    <q-btn flat size="sm" style="float: right; padding: .5rem;" @click="dismissInAppMessage()">
                        Dismiss <q-icon name="fas fa-times" style="margin: 0 0 0 .5rem;" />
                    </q-btn>
                </div>

                <div class="bg-white" style="font-size: .9rem; padding: 1rem;">
                    <span v-html="inAppMessage" />
                </div>

            </q-modal-layout>
        </q-modal> -->

    </div>
</template>

<script>
    import defaultTagSidebar from '../../common/tagSidebar'
    import defaultProductCard from '../../common/productCard'
    import FreeProductCard from './FreeProductCard'
    import OnScreen from 'onscreen'

    import { validProducts } from './walkAtHomeValidProducts'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { contentItemFiltering } from '../../../mixins/contentItemFiltering'

    const os = new OnScreen()

    export default {
        data() {
            return {
                itemImageURL(item) {
                    return 'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + item.productSKU + '/' + item.productSKU + '_image_cover.png'
                },

                localSearchString: '',
                selectedDistanceOptions: [],

                displayBatch: 1,
                productDisplayBatchLength: 20,
                showScrollFire: false,
                showSearchbar: false,
                showTagSidebar: false,

                showInAppMessage: false,
                inAppMessage: '',
                inAppMessageLastUpdated: '',
                inAppMessageLastSeen: '',

                addExtraItemInfo(item) {
                    item.coverImageFileName = item.productSKU + '_ws.jpg'
                    return item
                },

                multipleSelectOptionsFromTagHeading(headingName) {
                    return Object.keys(this.environmentTagHeadingObj[headingName].tags).map((tagKey) => {
                        let tag = this.environmentTagHeadingObj[headingName].tags[tagKey]
                        return {
                            label: tag.tagName,
                            value: tag.id
                        }
                    })
                },
            }
        },

        mixins: [globalComputedData, contentItemFiltering, validProducts],

        components: {
            defaultProductCard, defaultTagSidebar, FreeProductCard
        },

        computed: {

            searchString() {
                return this.$store.state.searchString
            },

            appOffline() {
                return this.$store.state.appOffline
            },

            displayProducts() {
                let displayProducts = this.productPool.slice(0, this.productDisplayBatchLength * this.displayBatch)
                k('displayProducts: ', displayProducts)

                return displayProducts
            },

            productPool() {
                // var productsToSearch = this.appOffline || this.showDownloadsOnly ? this.downloadedProducts : this.validProducts
                var productsToSearch = this.appOffline ? this.downloadedProducts : this.showDownloadsOnly && this.allDownloads.length ? this.allDownloads : this.validProducts
                // k('productsToSearch: ', productsToSearch)

                if (this.userSelectedTags && this.userSelectedTags.length) {
                    productsToSearch = this.getProductsThatMatchTags(this.userSelectedTags, productsToSearch)
                }

                // searching and filtering
                return this.searchString ? productsToSearch.filter((item) => {
                    return item.searchString.toLowerCase().includes(this.searchString.toLowerCase())
                }) : productsToSearch
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
                return this.environmentProductAndTagState.indexOf('fetching') > -1 ? true : false
            },

            freeProducts() {
                return this.$root.$store.state.freeProducts
            },

            previewProducts() {
                return this.$root.$store.state.previewProducts
            },

            clientProductCard() {
                return this.brand.clientProductCard || defaultProductCard
            },

            clientTagSidebar() {
                return this.brand.clientTagSidebar || defaultTagSidebar
            },

            yourDailyWalkCard() {
                return 'position: relative; background: #80c830; height: 100%; min-height: 10rem; border: 1px solid #cecece; border-radius: .2rem; box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12); cursor: pointer;'
            },

            ydwSubscriber() {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    return this.ydwSubscriberIDs.includes(product.productID)
                }).length : ''
            }
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

            searchString() {
                k('filter by search')

                if (this.searchString) {
                    var logEventObj = {
                        eventType: 'filterLibraryProductsBySearch',
                        searchText: this.searchString,
                        eventDesc: 'filtering products by search string "' + this.searchString + '"'
                    }

                    this.api.sendEvent(logEventObj)
                }
            },

            userSelectedTags() {
                k('environmentTags: ', this.environmentTags)

                if (this.userSelectedTags && this.userSelectedTags.length) {

                    var tagNames = []
                    this.userSelectedTags.forEach((tagID) => {
                        tagNames.push(this.environmentTags[tagID].tagName)
                    })

                    var logEventObj = {
                        eventType: 'filterLibraryProductsByTag',
                        eventDesc: 'filtering products by tags: "' + tagNames.join(', ') + '"',
                        userSelectedTagIDs: this.userSelectedTags,
                        userSelectedTagNames: tagNames
                    }

                    k('logEventObj: ', logEventObj)
                    this.api.sendEvent(logEventObj)
                }
            }
        },

        mounted() {
            if (this.environmentProducts) this.showScrollFire = true
        },

        created() {
            k('environmentProductAndTagState: ', this.environmentProductAndTagState)

            let inAppMessageLastSeen = this.localStorage.get('inAppMessageLastSeen')
            if (inAppMessageLastSeen) this.inAppMessageLastSeen = inAppMessageLastSeen

            if (!this.appOffline) this.getInAppMessage()

            // search filtering
            if (this.searchString) {
                this.localSearchString = this.searchString
                this.showSearchbar = true
            }

            this.$root.$on('toggleSearchbar', () => {
                if (this.showSearchbar) this.$store.commit('saveSearchString', '')
                this.showSearchbar = !this.showSearchbar
            })

            // show tag filtering
            this.$root.$on('toggleTagSidebar', () => {
                // if (this.showTagSidebar) this.$store.commit('saveSearchString', '')
                this.showTagSidebar = !this.showTagSidebar
            })

            // lazy loading
            os.on('enter', '#bottomOfGrid', (element) => {
                // k('i see the bottom!')
                this.displayBatch++
            })

            os.on('leave', '.productCard img', (element) => {
                // k('leave: ', element)
                element.style.visibility = 'hidden'
            })

            os.on('enter', '.productCard img', (element) => {
                // k('enter: ', element)
                element.style.visibility = 'visible'
            })
        },

        methods: {
            filterBySearch(val) {
                k('filterBySearch: ', val)

                this.$store.commit('saveSearchString', val)
                window.scrollTo({
                    'behavior': 'smooth',
                    'left': 0,
                    'top': 0
                });

                this.api.sendEvent({
                    eventType: "userSearchedContent",
                    eventDesc: "user searched for " + val,
                    searchVal: val,
                    userID: this.userInfo.userID
                })
            },

            selectTag(tagID) {
                k('selectTag: ', tagID, this.userSelectedTags)

                this.$store.commit('setUserSelectedTags', String(tagID))
            },

            clearFilters() {
                this.$store.commit('setUserSelectedTags', '')
                // this.selectedDistanceOptions = []
            },

            getInAppMessage() {
                this.api.get(`${this.api.apiv4Route}api/client/digitalwalkathome/inAppMessage`, res => {
                    k('getInAppMessage: ', res)

                    if (res.message) this.inAppMessage = res.message
                    if (res.lastUpdated) this.inAppMessageLastUpdated = res.lastUpdated

                    k('inAppMessageLastSeen: ', this.inAppMessageLastSeen)
                    k('inAppMessageLastUpdated: ', this.inAppMessageLastUpdated)
                })
            },

            openInAppMessage() {
                this.showInAppMessage = !this.showInAppMessage
                this.inAppMessageLastSeen = this.inAppMessageLastUpdated
                this.localStorage.set('inAppMessageLastSeen', this.inAppMessageLastUpdated)

                k('inAppMessageLastSeen: ', this.inAppMessageLastSeen)
                k('inAppMessageLastUpdated: ', this.inAppMessageLastUpdated)
            }
        }
    }
</script>

<style>
    .q-search .q-icon {
        margin-bottom: .2rem;
    }
</style>
