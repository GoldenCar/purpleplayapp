<template>
    <div class="row justify-center relative-position bg-grey-3">
        <q-inner-loading :visible="showLoader" style="z-index: 9;" />

        <div v-if="showLoader" class="col-12 row justify-center" style="padding: 1rem;">
            <div
                v-for="n in 18"
                class="col-xs-6 col-sm-4 col-md-3 col-lg-2"
                style="padding: .5rem;"
            >
                <contentPlaceholder />
            </div>
        </div>

        <div v-if="!showLoader" class="col-12 row">

            <div v-if="showSearchbar" class="col-12 bg-white" style="padding: .5rem; position: fixed; width: 100%; z-index: 9;">
                <q-search inverted clearable color="grey" v-model="localSearchString" @input="filterBySearch" />
            </div>

            <div class="col-12" :style="showSearchbar ? 'padding-top: 3.5rem;' : ''">
                <div v-if="showTagSidebar" class="col-12 bg-grey-3" style="padding: .5rem; width: 100%;">
                    <div
                        :is="clientTagSidebar"
                        :productScope="environmentProducts"
                        :tagScope="environmentTags"
                        :tagHeadingsObj4Scope="environmentTagHeadingObj"
                        @selectTag="selectTag"
                    />
                </div>

                <div v-if="(downloadedProducts.length || productDownloadQueue.length) && !appOffline" class="col-12" align="right" :style="`background: #fff; padding: 0.25rem .25rem .5rem;`">
                    <q-toggle v-model="showDownloadsOnlyDisplay" color="grey" icon="fas fa-download" left-label :label="`${showDownloadsOnlyDisplay ? 'SHOW ALL PRODUCTS' : 'SHOW DOWNLOADS ONLY'}`" style="margin-right: 16px; font-size: .5rem;" @input="toggleDownloadsOnly()" />
                </div>

                <div v-if="appOffline || (!appOffline && (environmentProducts && environmentProducts.length))" class="row bg-grey-3 justify-center relative-position" style="min-height: 3rem; padding: 1rem;">

                    <div class="col-12" align="center">
                        <h6>Your {{showDownloadsOnly || appOffline ? 'Downloads' : (searchString || userSelectedTags.length ? 'Filtered Library' : 'Library')}}</h6>
                        <hr />

                        <h6 v-if="(showDownloadsOnly || appOffline) && !allDownloads.length">No downloads yet.{{appOffline ? ' Connect your device to the internet to download content.' : ''}}</h6>

                        <h6 v-if="(searchString || userSelectedTags.length) && !displayProducts.length">No results found.</h6>
                    </div>

                    <div
                        v-for="item in displayProducts"
                        class="col-xs-6 col-sm-4 col-md-3 col-lg-2"
                        style="padding: .5rem;"
                        align="center"
                        @click="launchProduct(item)"
                    >
                        <div :is="clientProductCard" class="productCard" :componentData="item" />
                    </div>
                </div>

            </div>

            <div id="bottomOfGrid" v-if="showScrollFire && (productPool.length > displayProducts.length)" class="col-12 bg-grey-3" style="min-height: 2rem; position: relative;">
                <q-inner-loading size="md" :visible="true" />
            </div>
        </div>

    </div>
</template>

<script>
    import contentPlaceholder from './contentPlaceholder'
    import defaultTagSidebar from './tagSidebar'
    import defaultProductCard from './productCard'
    import OnScreen from 'onscreen';
    import { globalComputedData } from '../../mixins/globalComputedData'
    import { contentItemFiltering } from '../../mixins/contentItemFiltering'

    const os = new OnScreen();

    export default {
        data() {
            return {
                productTypes2Hide: ['channel', 'program_bundle', 'modcontent_bundle', 'test_modcontent_bundle', 'offline_channel'],

                itemImageURL(item) {
                    return 'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + item.productSKU + '/' + item.productSKU + '_image_cover.png'
                },

                localSearchString: '',

                displayBatch: 1,
                productDisplayBatchLength: 30,
                showScrollFire: false,
                showSearchbar: false,
                showTagSidebar: false,

                showDownloadsOnlyDisplay: false
            }
        },

        mixins: [globalComputedData, contentItemFiltering],

        components: {
            contentPlaceholder, defaultProductCard, defaultTagSidebar
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

            validProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((item) => {
                    return !this.productTypes2Hide.includes(item.productType)
                        && (!this.brand.validSubscriptionProductIDs && !this.brand.previewBundleID) || (this.brand.validSubscriptionProductIDs && !this.brand.validSubscriptionProductIDs.includes(item.productID))
                        && (this.brand.previewBundleID && item.productID != this.brand.previewBundleID)
                }) : []
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

            clientProductCard() {
                return this.brand.clientProductCard || defaultProductCard
            },

            clientTagSidebar() {
                return this.brand.clientTagSidebar || defaultTagSidebar
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

            allDownloads() {
                if (!this.allDownloads.length && this.showDownloadsOnly) this.$store.commit('showDownloadsOnly', false)
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

            // search filtering
            if (this.searchString) {
                this.localSearchString = this.searchString
                this.showSearchbar = true
            }

            this.$root.$on('toggleSearchbar', () => {
                if (this.showSearchbar) {
                    this.localSearchString = ''
                    this.$store.commit('saveSearchString', '')
                }
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
                this.$store.commit('userSelectedTag', String(tagID))
            },

            toggleDownloadsOnly() {
                this.$store.commit('showDownloadsOnly', !this.showDownloadsOnly)
            }
        }
    }
</script>

<style>
    .q-search .q-icon {
        margin-bottom: .2rem;
    }
</style>
