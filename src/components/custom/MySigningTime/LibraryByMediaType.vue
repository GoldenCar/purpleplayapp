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

            <div v-if="showTagSidebar" class="col-12 bg-grey-3" style="padding: .5rem; width: 100%;">
                <div
                    :is="clientTagSidebar"
                    :productScope="environmentProducts"
                    :tagScope="environmentTags"
                    :tagHeadingsObj4Scope="environmentTagHeadingObj"
                    @selectTag="selectTag"
                />
            </div>

            <div class="col-12" :style="`${showSearchbar ? 'padding-top: 3.5rem;' : ''} height: 100%;`">
                <div align="center">
                    <h6 v-if="(showDownloadsOnly || appOffline) && !downloadedProducts.length">No downloads yet.{{appOffline ? ' Connect your device to the internet to download content.' : ''}}</h6>

                    <h6 v-if="(searchString || userSelectedTags.length) && !displayProducts.length">No results found.</h6>
                </div>

                <div class="row" style="padding: .5rem; background: #7eb4e95e;">
                    <div class="col-6">
                        <q-toggle v-model="videoLock" color="red" :icon="`${videoLock ? 'fas fa-lock' : 'fas fa-unlock'}`" left-label :label="`${videoLock ? 'Turn off child lock?' : 'Turn on child lock?'}`" style="margin-right: 16px;" @input="toggleVideoLock" />
                    </div>

                    <div class="col-6" v-if="(downloadedProducts.length || productDownloadQueue.length) && !appOffline" align="right">
                        <q-btn size="xs" flat @click="toggleDownloadsOnly()" style="background: #fff; color: #545454;">
                            {{showDownloadsOnly ? 'SHOW ALL PRODUCTS' : 'SHOW DOWNLOADS ONLY'}}
                        </q-btn>
                    </div>
                </div>

                <q-tabs v-if="!showSearchbar && !showTagSidebar" color="white">

                    <q-tab
                        v-for="type in mediaTypes"
                        :disable="!mediaTypeHasAnyOwnedItems(type)"
                        slot="title"
                        :default="type.default"
                        :key="type.name"
                        :name="type.name"
                        color="black"
                        align="center"
                        style="min-width: 4rem;"
                        @select="selectTypeTab(type)"
                    >
                        <span v-if="!type.src" style="font-size: .8rem;">
                            <q-icon :name="type.icon" style="font-size: .8rem;" />
                            <br />
                            {{type.name}}
                        </span>
                        <img v-else :src="type.src" style="max-height: 33px; height: auto; max-width: 100%;" />
                    </q-tab>
                </q-tabs>

                <div v-if="appOffline || (!appOffline && (environmentProducts && environmentProducts.length))" class="bg-grey-3 row justify-center relative-position" style="padding: 1rem;">
                    <div v-for="item in displayProducts" class="col-xs-6 col-sm-4 col-md-3 col-lg-2" style="padding: .5rem;" align="center" @click="launchProduct(item)">
                        <div :is="clientProductCard" class="productCard" :componentData="item" />
                    </div>

                    <div id="bottomOfGrid" v-if="showScrollFire && (productPool.length > displayProducts.length)" class="col-12 bg-grey-3" style="min-height: 2rem; margin-bottom: 1rem; position: relative;">
                        <q-inner-loading :visible="true" />
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
    import contentPlaceholder from '../../common/contentPlaceholder'
    import defaultTagSidebar from '../../common/tagSidebar'
    import defaultProductCard from '../../common/productCard'
    import OnScreen from 'onscreen';
    import { globalComputedData } from '../../../mixins/globalComputedData'

    const os = new OnScreen();

    export default {
        data() {
            return {
                productTypes2Hide: ['channel', 'modcontent_bundle', 'test_modcontent_bundle', 'offline_channel'],

                itemImageURL(item) {
                    return 'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + item.productSKU + '/' + item.productSKU + '_image_cover.png'
                },

                localSearchString: '',
                videoLock: false,

                displayBatch: 1,
                productDisplayBatchLength: 30,
                showScrollFire: false,
                showSearchbar: false,
                showTagSidebar: false,
                selectedFilterType: '',

                mediaTypeHasAnyOwnedItems(type) {
                    return this.validProducts ? this.validProducts.filter((product) => {
                        return this.typeFilter(product, type)
                    }).length : ''
                },

                typeFilter(item, type) {
                    let codeMatch = type.code ? item.tags.includes(type.code) : true
                    let searchStringMatch = type.searchStringMatch ? item.searchString.toLowerCase().includes(type.searchStringMatch.toLowerCase()) : true
                    return codeMatch && searchStringMatch
                }
            }
        },

        mixins: [ globalComputedData ],

        components: {
            defaultProductCard, defaultTagSidebar, contentPlaceholder
        },

        computed: {

            mediaTypes() {
                return  [{
                    name: 'video',
                    icon: 'fas fa-play',
                    default: this.userOwnsProductsOtherThanFree ? true : false,
                    code: '4145'
                },
                {
                    name: 'Baby Signing Time',
                    src: 'statics/mysigningtime/baby-signing-time.png',
                    searchStringMatch: 'baby signing time'
                },
                {
                    name: 'Potty Time',
                    src: 'statics/mysigningtime/potty-time.png',
                    searchStringMatch: 'potty time'
                },
                {
                    name: 'Signing Time',
                    src: 'statics/mysigningtime/signing-time.png',
                    searchStringMatch: 'signing time'
                },
                {
                    name: 'Treeschoolers',
                    src: 'statics/mysigningtime/treeschoolers.png',
                    searchStringMatch: 'treeschoolers'
                },
                {
                    name: 'music',
                    icon: 'fas fa-music',
                    code: '4146'
                },
                {
                    name: 'ebooks',
                    icon: 'fas fa-book',
                    code: '4143'
                },
                {
                    name: 'guides',
                    icon: 'fas fa-file-pdf',
                    code: '4144'
                },
                {
                    name: 'free',
                    icon: 'fas fa-star',
                    default: this.userOwnsProductsOtherThanFree ? false : true,
                }]
            },

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
                var productsToSearch = this.appOffline ? this.downloadedProducts : this.showDownloadsOnly && this.allDownloads.length ? this.allDownloads : this.searchString ? this.validProducts : this.productsThatMatchType
                // k('productsToSearch: ', productsToSearch)

                // searching and filtering
                return this.searchString ? productsToSearch.filter((item) => {
                    return item.searchString.toLowerCase().includes(this.searchString.toLowerCase())
                }) : productsToSearch
            },

            productsThatMatchType() {
                return this.validProducts.filter((product) => {
                    return this.selectedFilterType === 'free' ? this.freeAndPreviewProductIDs.includes(product.productID) : this.typeFilter(product, this.selectedFilterType)
                })
            },

            validProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((item) => {
                    // k('validProduct? ', item, !this.productTypes2Hide.includes(item.productType))
                    return !this.productTypes2Hide.includes(item.productType) && item.webplayer
                        // && (!this.brand.validSubscriptionProductIDs && !this.brand.previewBundleID) || (this.brand.validSubscriptionProductIDs && !this.brand.validSubscriptionProductIDs.includes(item.productID))
                        // && (this.brand.previewBundleID && item.productID != this.brand.previewBundleID)
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
                return this.$store.state.freeProducts
            },

            previewProducts() {
                return this.$store.state.previewProducts
            },

            globalVideoLock() {
                return this.$store.state.globalVideoLock
            },

            clientProductCard() {
                return this.brand.clientProductCard || defaultProductCard
            },

            clientTagSidebar() {
                return this.brand.clientTagSidebar || defaultTagSidebar
            },

            freeAndPreviewProducts() {
                return this.previewProducts.concat(this.freeProducts)
            },

            freeAndPreviewProductIDs() {
                return this.freeAndPreviewProducts.map(freeAndPreviewProduct => { return freeAndPreviewProduct.productID })
            },

            userOwnsProductsOtherThanFree() {
                return this.validProducts.filter((product) => {
                    return !this.freeAndPreviewProductIDs.includes(product.productID)
                }).length
            },

            freeMediaType() {
                return this.mediaTypes.find((type) => { return type.name === 'free' })
            }
        },

        watch: {
            environmentProducts() {
                this.showScrollFire = true
            },

            globalVideoLock() {
                k('watch globalVideoLock: ', this.globalVideoLock)

                this.localStorage.set('globalVideoLock', this.globalVideoLock)
            },

            selectedFilterType() {
                k('selectedFilterType: ', this.selectedFilterType)

                this.localStorage.set('selectedFilterType', this.selectedFilterType)
            }
        },

        created() {
            k('environmentProductAndTagState: ', this.environmentProductAndTagState)

            let selectedFilterType = this.localStorage.get('selectedFilterType')
            if (selectedFilterType) {
                this.selectedFilterType = selectedFilterType
            }

            let globalVideoLock = this.localStorage.get('globalVideoLock')
            if (globalVideoLock) {
                this.$store.commit('globalVideoLock', globalVideoLock)
            }
            this.videoLock = this.globalVideoLock

            if (this.environmentProducts) this.showScrollFire = true

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
                this.$store.commit('userSelectedTag', String(tagID))
            },

            selectTypeTab(type) {
                k('selectTypeTab: ', type)

                if (this.mediaTypeHasAnyOwnedItems(type)) {
                    this.selectedFilterType = type
                    this.displayBatch = 1
                }
            },

            toggleVideoLock(val) {
                k('toggleVideoLock: ', val)

                k('videoLock: ', this.videoLock)
                k('globalVideoLock: ', this.globalVideoLock)

                this.$store.commit('globalVideoLock', val)
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

    .row.flex-center.q-tabs-left-scroll,
    .row.flex-center.q-tabs-right-scroll {
        display: flex !important;
    }

    /* .q-tabs-head {
        background: #2d82bd !important;
    } */
</style>
