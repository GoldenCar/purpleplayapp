<template>

    <div id="pvolveFilterResultProductGrid" class="bg-white">
        <div class="row" style="padding: 2rem 0 0;">
            <!-- <div class="col-12" v-if="(currentView === 'preview' || pbandOnlyUser) && environmentProductAndTagState.indexOf('fetching') === -1" style="padding-bottom: 1rem;">
                <pvolveTrialOrSubscribe :componentData="{}" @subscribe="goToSignUpNow()" @trial="route('/trial')" />
            </div> -->

            <h2 class="col-12" align="center" :style="`color: #333; margin: 1rem 0;`">All Workouts</h2>
        </div>

        <div class="bg-grey-2">
            <div class="row well">
                <div class="col-12 justify-center" align="center" style="padding: .5rem;">

                    <q-btn v-if="environmentProducts" flat @click="toggleSearch()" style="color: #333; margin: .25rem;">
                        <h6 style="font-size: .8rem; letter-spacing: 1px;">
                            Search Workouts
                            <q-icon :name="openSearch ? `fas fa-chevron-up` : `fas fa-chevron-down`" style="font-size: .7rem;" />
                        </h6>
                    </q-btn>

                    <q-btn v-if="tagHeadingsObj4Scope && showTagSidebar" flat @click="toggleFilters()" style="color: #333; margin: .25rem;">
                        <h6 style="font-size: .8rem; letter-spacing: 1px;">
                            Filter Workouts
                            <span v-if="userSelectedTags.length" :style="'background: ' + pvolveMintTitle + '; color: #fff; padding: 0 .25rem; border-radius: .25rem;'">{{userSelectedTags.length}}</span>
                            <q-icon :name="openFilters ? `fas fa-chevron-up` : `fas fa-chevron-down`" style="font-size: .7rem;" />
                        </h6>
                    </q-btn>

                </div>

                <q-slide-transition>
                    <div class="col-12" v-if="openSearch">
                        <pvolveHomeSearch :componentData="{}" />
                    </div>
                </q-slide-transition>

                <q-slide-transition>
                    <div class="col-12" v-if="tagHeadingsObj4Scope && showTagSidebar && openFilters" style="padding: 1rem .5rem;">
                        <div
                            class="bg-grey-3"
                            style="padding: .5rem;"
                            :is="tagSidebar"
                            :productScope="productScope"
                            :tagScope="tagScope"
                            :tagHeadingsObj4Scope="tagHeadingsObj4Scope"
                            @selectTag="selectTag"
                        />
                    </div>
                </q-slide-transition>

            </div>
        </div>

        <div id="displayProducts" v-if="showDisplayProducts" class="row well justify-center relative-position" style="min-height: 5rem;">

            <div class="col-12">
                <div class="row items-stretch justify-center">
                    <div
                        :class="componentData.columnClass || (showTagSidebar ? 'col-xs-6 col-sm-4 col-md-4 col-lg-3' : 'col-xs-6 col-sm-4 col-md-3 col-lg-2')"
                        v-if="displayProducts && displayProducts.length"
                        v-for="product in displayProducts"
                        :key="product.productID"
                        style="padding: .5rem;"
                    >
                        <pvolveProductCard class="productCard" :componentData="product" />
                    </div>
                </div>
            </div>

            <q-inner-loading :visible="!displayProducts && (environmentProductAndTagState ? true : false)" align="center">
                <q-spinner :size="30" />
                loading products...
            </q-inner-loading>

            <h5 v-if="displayProducts && !displayProducts.length" align="center" class="full-width">No products.</h5>

            <div class="col-12" id="bottom"></div>

        </div>

        <!-- <div v-else>
            <div class="row well" style="margin-top: 2rem; padding: 0 1rem;">
                <h6 style="text-transform: uppercase;"><img :src="levelImageSrc('beginner')" style="max-width: 3rem; vertical-align: bottom; margin: -0.5rem 0;" /> Beginner workouts</h6>
            </div>

            <productSection :componentData="beginnerSectionComponentData" :sectionIndex="-1" />

            <div class="row well" style="margin-top: 2rem; padding: 0 1rem;">
                <h6 style="text-transform: uppercase;"><img :src="levelImageSrc('intermediate')" style="max-width: 3rem; vertical-align: bottom; margin: -0.5rem 0;" /> Intermediate workouts</h6>
            </div>

            <productSection :componentData="intermediateSectionComponentData" :sectionIndex="-1" />

            <div class="row well" style="margin-top: 2rem; padding: 0 1rem;">
                <h6 style="text-transform: uppercase;"><img :src="levelImageSrc('advanced')" style="max-width: 3rem; vertical-align: bottom; margin: -0.5rem 0;" /> Advanced workouts</h6>
            </div>

            <productSection :componentData="advancedSectionComponentData" :sectionIndex="-1" />
        </div> -->

        <q-modal
            v-model="openOnboardingModal"
            :content-css="{width: '550px', minHeight: '80vh'}"
        >
            <q-modal-layout id="pvolveOnboardingModalLayout">

                <pvolveOnboarding v-if="openOnboardingModal" @close="openOnboardingModal = false" />

            </q-modal-layout>
        </q-modal>

    </div>

</template>

<script>
    import pvolveStructuredProducts from './pvolveStructuredProducts'
    import defaultTagSidebar from '../../common/tagSidebar'
    import pvolveHomeSearch from './pvolveHomeSearch'
    import pvolveOnboarding from './pvolveOnboarding'
    import productSection from '../../common/showcase/productSection'
    import pvolveProductCard from './pvolveProductCard'

    import { pvolveColors } from './pvolveColors'
    import { pvolveProductSectionTools } from './pvolveProductSectionTools'
    import { contentItemFiltering } from '../../../mixins/contentItemFiltering'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { pvolveLibrarySortTools } from './pvolveLibrarySortTools'

    import OnScreen from 'onscreen'
    const os = new OnScreen()

    export default {
        props: ['componentData'],

        mixins: [userAndProductInfo, globalComputedData, contentItemFiltering, pvolveColors, pvolveProductSectionTools, pvolveLibrarySortTools],

        components: {
            defaultTagSidebar,
            pvolveHomeSearch,
            pvolveStructuredProducts,
            pvolveOnboarding,
            productSection,
            pvolveProductCard
        },

        data() {
            return {
                openOnboardingModal: false,
                openSearch: false,
                openFilters: false,
                batchIndex: 1,
                gridDelta: 30,
                showMobileFilters: false,
                doNotShowOnboarding: false,

                showProductButton(productID) {
                    // let userSubscriptionAccessTypeCheck = !this.subscriptionAccessType || (this.subscriptionAccessType && this.subscriptionAccessType !== 'freeTrialAccess')
                    return this.userHasAccess([productID])
                        // && (!item.hideIfFreeTrialAccess || (item.hideIfFreeTrialAccess && userSubscriptionAccessTypeCheck))
                }
            }
        },

        computed: {

            showDisplayProducts() {
                return !this.componentData.filterOnlyMode || this.searchString.length || this.userSelectedTags.length || this.sortLibraryTopRated || this.sortLibraryMostRecent || this.showFavoritesOnly || this.showExclusiveContentOnly
                // return !this.componentData.filterOnlyMode && (!this.ownsSubscription || (this.ownsSubscription && (this.searchString.length || this.userSelectedTags.length || this.sortLibraryTopRated || this.sortLibraryMostRecent || this.showFavoritesOnly || this.showExclusiveContentOnly)))
            },

            ownsSubscription() {
                return this.userSubscriptionProductStatusHistory ? this.userSubscriptionProductStatusHistory.filter((status) => {
                    return status.accessStatus && status.accessStatus !== 'inactive'
                }).length ? true : false : false
            },

            forSaleProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    return product.available4Sale
                }) : ''
            },

            userActiveProducts() {
                // kw('get user active products')
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    return product.userActiveProduct && product.webplayer && (product.productType == 'bundleProduct' || product.productType === 'exclusiveContent')
                }) : ''
            },

            productScope() {
                k('product scope: ', this.componentData.productScope)

                // return this.ownsSubscription ? this.userActiveProducts : this.componentData.productScope ? this[this.componentData.productScope] : this.forSaleProducts
                return this.userActiveProducts
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
                var products = this.productScope

                if (this.userSelectedTags && this.userSelectedTags.length) {
                    products = this.getProductsThatMatchTags(this.userSelectedTags, this.productScope)
                    // products = this.getProductsThatMatchTagsPvolve(this.userSelectedTags, this.productScope)
                }
                if (this.searchString) products = this.j_.queryArrayAllPartialMatches(this.productScope, 'searchString', this.searchString)

                k('productPool: ', products)
                return products
            },

            displayProducts() {
                var displayProducts = this.productsToLoad.slice(0, this.batchIndex * this.gridDelta)
                k('displayingProducts: ', displayProducts)

                return displayProducts
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

            searchString() {
                return this.$store.state.searchString
            },

            tagHeadingsObj4Scope() {
                return this.environmentTagHeadingObj
            },

            userActiveTags() {
                return this.environmentTags ? Object.keys(this.environmentTags).filter((tagKey) => {
                    var tag = this.environmentTags[tagKey]
                    return tag.userActiveProduct && tag.webplayer
                }) : ''
            },

            tagScope() {
                return this.currentView === 'myLibrary' ? this.userActiveTags : this.environmentTags
            },

            showTagSidebar() {
                return this.componentData.showTagSidebar
            },

            homePageData() {
                return this.$store.state.environment.json
            },

            userSubscriptionProductStatusHistory() {
                return this.$store.state.userSubscriptionProductStatusHistory
            },

            subscriptionAccessType() {
                return this.userSubscriptionProductStatusHistory &&
                    this.userSubscriptionProductStatusHistory.length ?
                    this.userSubscriptionProductStatusHistory[0].accessType : ''
            },

            tagSidebar() {
                return this.brand.clientTagSidebar
            },

            // pbandOnlyUser() {
            //     return this.userHasAccess([151876]) && !this.userHasAccess(this.homePageData.e.validSubscriptionProductIDs)
            // }
        },

        methods: {
            lazyLoad(element) {
                // kw('bottom of grid enter!')
                if (this.displayProducts && (this.displayProducts.length !== this.productPool.length)) this.batchIndex = Number(this.batchIndex) + 1
            },

            hideElement(element) {
                element.style.visibility = 'hidden'
            },

            showElement(element) {
                element.style.visibility = 'visible'
            },

            selectTag(tagID) {
                k('selectTag: ', tagID, this.userSelectedTags)
                this.$store.commit('userSelectedTag', String(tagID))

                // if (this.currentView !== 'myLibrary') {
                //     if (this.userSelectedTags.length) {
                //         this.route('/tagFilter/' + this.userSelectedTags.join(','))
                //     }
                //     else {
                //         this.route('/shop')
                //     }
                // }
            },

            closeOnboarding() {
                this.openOnboardingModal = false
            },

            openOnboarding() {
                this.api.sendEvent({
                    eventType: 'userLaunchedOnboarding',
                    eventDesc: 'user tapped to see the onboarding modal',
                    userID: this.userInfo.userID
                })

                this.openOnboardingModal = true
            },

            structuredProductButton(routePath) {
                this.$store.commit('setProductLaunchContext', 'productCard')
                this.route(routePath)
            },

            rerouteUserIfNecessary() {
                k('rerouteUserIfNecessary!')

                if (!this.productScope.length) {
                    k('no productScope')
                    this.route('/preview')
                }

                if (this.currentView === 'preview') {
                    k('on preview!')
                    if (this.userActiveProducts && this.userActiveProducts.length) {
                        k('user owns stuff!')
                        this.route('/library')
                    }
                }
            },

            sortLibrary(type) {
                switch (type) {
                    case 'favorites':
                        this.$store.commit('setShowFavoritesOnly', !this.showFavoritesOnly)
                        this.$store.commit('sortLibraryTopRated', false)
                        this.$store.commit('sortLibraryMostRecent', false)
                        break;

                    case 'topRated':
                        this.$store.commit('setShowFavoritesOnly', false)
                        this.$store.commit('sortLibraryTopRated', !this.sortLibraryTopRated)
                        this.$store.commit('sortLibraryMostRecent', false)
                        break;

                    case 'mostRecent':
                        this.$store.commit('setShowFavoritesOnly', false)
                        this.$store.commit('sortLibraryTopRated', false)
                        this.$store.commit('sortLibraryMostRecent', !this.sortLibraryMostRecent)
                        break;

                    default:
                        this.$store.commit('setShowFavoritesOnly', false)
                        this.$store.commit('sortLibraryTopRated', false)
                        this.$store.commit('sortLibraryMostRecent', false)
                }
            },

            goToSignUpNow() {
                this.$store.commit('addKeyPathInStore', { keyPath: 'initialParameters.signUpNow', value: true })
                this.route('/offer/special?signUpNow=true')
            },

            toggleSearch() {
                this.openSearch = !this.openSearch

                if (!this.openSearch) {
                    this.$store.commit('saveSearchString', '')
                } else {
                    if (this.openFilters) {
                        this.openFilters = false
                        this.$root.$emit('clearPvolveFilters')
                    }
                }
            },

            toggleFilters() {
                this.openFilters = !this.openFilters

                if (!this.openFilters) {
                    this.$root.$emit('clearPvolveFilters')
                } else {
                    if (this.openSearch) {
                        this.openSearch = false
                        this.$store.commit('saveSearchString', '')
                    }
                }
            }
        },

        watch: {
            searchString() {
                k('filter by search: ', this.searchString)

                if (this.searchString) {
                    var logEventObj = {
                        searchText: this.searchString,
                        eventDesc: 'filtering products by search string "' + this.searchString + '"'
                    }

                    if (this.currentView === 'myLibrary') {
                        logEventObj.eventType = 'filterLibraryProductsBySearch'
                    } else {
                        logEventObj.eventType = 'filterShopProductsBySearch'
                    }

                    this.api.sendEvent(logEventObj)
                }
            },

            userSelectedTags() {
                if (this.userSelectedTags && this.userSelectedTags.length) {

                    var tagNames = []
                    this.userSelectedTags.forEach((tagID) => {
                        // k('tagScope: ', this.environmentTags, tagID, this.environmentTags[tagID])
                        tagNames.push(this.environmentTags[tagID].tagName)
                    })

                    var logEventObj = {
                        eventDesc: 'filtering products by tags: "' + tagNames.join(', ') + '"',
                        userSelectedTagIDs: this.userSelectedTags,
                        userSelectedTagNames: tagNames
                    }

                    if (this.currentView === 'myLibrary') {
                        logEventObj.eventType = 'filterLibraryProductsByTag'
                    } else {
                        logEventObj.eventType = 'filterShopProductsByTag'
                    }

                    // k('logEventObj: ', logEventObj)

                    this.api.sendEvent(logEventObj)
                }
            },

            productScope() {
                if (this.productScope) this.rerouteUserIfNecessary()
            },

            doNotShowOnboarding() {
                if (this.doNotShowOnboarding) this.localStorage.set('onboarded', true)
            },

            favoritedProductIDs() {
                k('favoritedProductIDs: ', this.favoritedProductIDs)

                if (this.favoritedProductIDs && !this.favoritedProductIDs.length && this.showFavoritesOnly) {
                    this.$store.commit('setShowFavoritesOnly', false)
                }
            },

            userInfo() {
                if (this.userInfo) this.getUserPreferences(() => {})
            }
        },

        created() {
            // k('componentData: ', this.componentData)

            if (this.userInfo) this.getUserPreferences(() => {})

            os.on('enter', '#bottom', this.lazyLoad)
            os.on('leave', '.productCard', this.hideElement)
            os.on('enter', '.productCard', this.showElement)

            if (this.productScope) this.rerouteUserIfNecessary()
        }
    }
</script>

<style scoped>
    .productCard {
        height: 100%;
    }

    .pchip {
        /* width: fit-content; */
        color: #fff;
        background: #fff;
        border-radius: .25rem;
        padding: .25rem .5rem;
        margin: 0;
    }
</style>
