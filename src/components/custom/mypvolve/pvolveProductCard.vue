<template>

    <div class="relative-position pvolveCard" @click="selectItem()">
        <div class="topLeftHeader">
            <div class="pchip" v-if="productIsNew" :style="`background: ${pvolveMintTitle}; padding-right: 1rem; clip-path: polygon(100% 0%, 0% 0%, 0% 100%, 85% 100%); -webkit-clip-path: polygon(100% 0%, 0% 0%, 0% 100%, 85% 100%);`">
                <h6 style="margin: 0;">NEW!</h6>
            </div>
            <div class="pchip" v-if="exclusiveProduct" :style="`margin-top: .25rem; background:${pvolveSalmon}; padding-right: 1rem; clip-path: polygon(100% 0%, 0% 0%, 0% 100%, 85% 100%); -webkit-clip-path: polygon(100% 0%, 0% 0%, 0% 100%, 85% 100%);`">
                <h6 style="margin: 0;">EXCLUSIVE</h6>
            </div>
            <!--<q-btn @click.stop="" flat size="xs" :style="`border-radius: unset; background: ${pvolveMintTitle}; color: #fff; padding: .25rem;`">-->
            <!--    <q-icon name="fa-calendar" style="font-size: .8rem !important; margin: .25rem .25rem;" />-->
            <!--    <q-icon name="fa-plus" style="font-size: .8rem !important; margin: .25rem .25rem;" />-->
            <!--</q-btn>-->
        </div>

        <div class="topRightHeader">
            <div v-if="productIsQueued || productIsDownloading || productIsDownloaded" class="pchip" :style="`background: ${pvolveSalmon};`">
                <h6 style="margin: 0; font-size: .7rem;" v-if="productIsQueued && !productIsDownloading">QUEUED</h6>
                <h6 style="margin: 0; font-size: .7rem;" v-if="productIsDownloading">DOWNLOADING</h6>
                <h6 style="margin: 0; font-size: .7rem;" v-if="productIsDownloaded">DOWNLOADED</h6>
            </div>
        </div>

        <div class="pvolveCoverImage" :style="cardStyle">

        </div>

        <div :style="`padding: .5rem .25rem ${freeProduct ? '0' : '2rem'}; color: #524F4C; font-size: .9rem;`">
            <h6 class="thickHeader" style="margin: 0; color: #524F4C; text-transform: none; font-size: .8rem; letter-spacing: -0.03rem;">
                {{ componentData.productName }}
                <span :style="`font-size: .7rem; color: ${pvolveSalmon};`">({{moment(componentData.duration * 1000).format('mm:ss')}})</span>
            </h6>

            <div style="margin-top: .25rem; max-height: 1rem; overflow: hidden; font-size: .7rem; color: #555;">
                <!--<q-icon name="fa-tag" style="font-size: .6rem !important;" />-->
                <div v-if="productTags" v-for="(tag, index) in productTags" class="float-left monty allCaps" :style="index > 0 ? 'margin-left: .25rem;' : ''">
                    <!--<q-icon name="fa-tag" style="font-size: .8rem !important; margin: 0 .5rem 0 0;" />-->
                    {{index > 0 ? ' | ' + tag : tag}}
                </div>
            </div>

            <div class="row" style="padding-top: .5rem;">
                <div class="col">
                    <div v-if="componentData.avgRating" style="margin-top: .25rem;">
                        <img v-for="n in Math.floor(Number(componentData.avgRating))" src="statics/mypvolve/PLV010-17_PeachIcon_CMYK.png" style="width: .9rem;" />
                    </div>
                </div>
                <div v-if="showFavoriting" class="col text-right">
                    <q-btn flat size="xs" @click.stop="toggleFavorite()" style="padding: .25rem 0;">
                        <q-icon class="fa-heart vertical-middle" :class="isFavorite ? 'fas' : 'far'" style="font-size: 1rem;" />
                    </q-btn>
                </div>
            </div>

            <div v-if="!freeProduct && downloadAllowed" class="bottomHeader" align="center" >
                <q-inner-loading :visible="downloadLoader" />

                <q-progress
                    color="green"
                    height="10px"
                    v-if="productIsDownloading && currentProductFileDownloadingProgress"
                    :percentage="Number(currentProductFileDownloadingProgress)"
                    :style="`color: ${pvolveMintTitle} !important;`"
                />

                <q-btn v-if="!productIsDownloading && !productIsDownloaded && !productIsQueued" outline size="sm" class="full-width" @click.stop="downloadItem(componentData)" style="padding: 0 .5rem; background: #fff !important; color: #333;">
                    <q-icon name="fas fa-download" style="font-size: .7rem;" />
                    <h6 style="font-size: .7rem; margin: 0; letter-spacing: 1px;">Download</h6>
                </q-btn>

                <q-btn v-if="productIsDownloading" outline size="sm" class="full-width" @click.stop="cancelProductDownload()" style="padding: 0 .5rem; background: #fff !important; color: #333;">
                    <span v-if="currentProductFileDownloadingIndex && productFileDownloads">File: {{currentProductFileDownloadingIndex + 1}}/{{productFileDownloads.length}}</span>
                    <q-icon color="red" name="fas fa-ban" style="font-size: .7rem;" />
                    <h6 style="font-size: .7rem; margin: 0; letter-spacing: 1px;">Cancel</h6>
                </q-btn>

                <q-btn v-if="productIsDownloaded" outline size="sm" class="full-width" @click.stop="deleteLocalProduct(componentData.productSKU)" style="padding: 0 .5rem; background: #fff !important; color: #333;">
                    <q-icon color="red" name="fas fa-times" style="font-size: .7rem;" />
                    <h6 style="font-size: .7rem; margin: 0; letter-spacing: 1px;">Delete</h6>
                </q-btn>

            </div>
        </div>

    </div>

</template>

<script>

    import { pvolveColors } from './pvolveColors'
    import { productCardTools } from '../../../mixins/productCardTools'
    import { productCardDownloadTools } from '../../../mixins/productCardDownloadTools'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['componentData', 'notSelectable', 'freeProduct'],

        mixins: [pvolveColors, productCardTools, productCardDownloadTools, userAndProductInfo, globalComputedData],

        data() {
            return {
                truncate(string) {
                    var truncateLength = 250
                    return string.length > truncateLength ? string.substring(0, truncateLength) + '...' : string
                },
                excludedTagIDs: ['1031', '2507', '4145', '5156', '5420'],
                addToWorkoutShortcut: false
            }
        },

        computed: {
            authenticated() {
                return this.$store.state.user.authenticated
            },

            coverImageURL() {
                return 'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + this.componentData.productSKU + '/' + this.coverImageFileName
            },

            downloadedImageURL() {
                return this.getLocalURL(this.componentData.productSKU, this.coverImageFileName).signedURL
            },

            coverImageFileName() {
                return this.componentData.productSKU + '_500px_cover.png'
            },

            imageURL() {
                // k('imageURL: ', this.productIsDownloaded, this.downloadedImageURL, this.coverImageURL)
                return this.productIsDownloaded ? this.downloadedImageURL : this.coverImageURL
            },

            cardStyle() {
                return `background: url(${this.imageURL});`
            },

            productIsNew() {
                return this.componentData.tags.split(',').includes('5521')
            },

            exclusiveProduct() {
                return this.componentData.productType === 'exclusiveContent'
            },

            environmentTags() {
                return this.$root.$store.state.environmentTags
            },

            productTags() {
                var productTagReturn = null
                if (this.environmentTags && this.componentData.tags) {
                    // k('productTags: ', this.environmentTags, this.componentData.tags)
                    productTagReturn = []
                    var productTagNames = this.componentData.tags.split(',').map((tagID) => {
                        // k('tagObj: ', tagID, this.environmentTags[tagID], !this.excludedTagIDs.includes(tagID))
                        return this.environmentTags[tagID] && !this.excludedTagIDs.includes(tagID) ? this.environmentTags[tagID].tagName : false
                    })
                    productTagNames.forEach((tagName) => {
                        if (tagName && !productTagReturn.includes(tagName)) {
                            productTagReturn.push(tagName)
                        }
                    })
                }
                return productTagReturn
            },

            structuredProduct() {
                return this.componentData.tags.includes('5763')
            },

            appOffline() {
                return this.$store.state.appOffline
            },

            specialProductRoutes() {
                return this.brand.specialProductRoutes
            },

            isFavorite() {
                return this.favoritedProductIDs.includes(this.componentData.productID);
            },

            mediaFavoritesPreference() {
                return this.userPreferences ? this.userPreferences.find(preference => preference.type === 'mediaFavorites') : null
            },

            favoritedProductIDs() {
                return this.mediaFavoritesPreference && this.mediaFavoritesPreference.favorites ? this.mediaFavoritesPreference.favorites : []
            },

            favoriteProductsPreferenceID() {
                return this.mediaFavoritesPreference && this.mediaFavoritesPreference.id ? this.mediaFavoritesPreference.id : ''
            },

            showFavoriting() {
                // k('showFavoriting: ', this.authenticated, this.userPreferences, this.componentData.productID, this.userHasAccess([this.componentData.productID]))
                return this.authenticated && this.userPreferences && this.userHasAccess([this.componentData.productID])
            }
        },

        methods: {
            selectItem() {
                k('selectItem: ', this.componentData)

                if (this.notSelectable) return false

                this.$store.commit('setCurrentProduct', this.componentData)
                this.$store.commit('setProductLaunchContext', 'productCard')

                if (this.structuredProduct && !this.appOffline) {
                    this.route(this.specialProductRoutes[String(this.componentData.productID)])
                } else {
                    this.route('/play/' + this.componentData.productID)
                }
            },

            giftItem() {
                // k('giftItem: ', this.componentData)
                if (this.notSelectable) return false

                // this.route('/shop/' + this.componentData.productID)
                this.$store.commit('setProductID2Preview', this.componentData.productID)
                this.$root.$emit('openProductPreview', true)
            },

            getNewFavorites() {
                if (this.favoritedProductIDs.includes(this.componentData.productID)) {
                    return this.favoritedProductIDs.filter(productId => productId !== this.componentData.productID);
                }
                return [...this.favoritedProductIDs, this.componentData.productID];
            },

            toggleFavorite() {
                k('toggleFavorite: ', this.mediaFavoritesPreference, this.favoriteProductsPreferenceID)

                const req = {
                    userID: this.$store.state.user.info.userID,
                    userLoginToken: this.$store.state.user.userLoginToken,
                    type: 'mediaFavorites',
                    environment: this.$store.state.environment.name,
                    favorites: this.getNewFavorites(),
                }

                k('saveFavoritesToDB req: ', req)

                this.saveUserPreferenceToAPI(this.favoriteProductsPreferenceID, req, () => {})
            }
        },

        watch: {
            // userPreferences() {
            //     k('userPreferences: ', this.userPreferences)
            //     this.addToWorkoutShortcut = this.userPreferences.filter((item) => {
            //         return item.type === 'workoutPreferences'
            //     })[0]
            // },
        },

        created() {
            if (!this.userPreferences) {
                this.getUserPreferences(() => {})
            }
            // k('componentData: ', this.componentData)

            // if (this.userPreferences) {
            //     this.addToWorkoutShortcut = this.userPreferences.filter((item) => {
            //         return item.type === 'workoutPreferences'
            //     })[0]
            // } else {
            //
            // }
        }
    }
</script>

<style scoped>

    .pvolveCard {
        /*background-size: cover !important;*/
        /*background-position: 50% !important;*/
        background: #f5f5f5;
        position: relative;
        height: 100%;
        padding: .5rem;
        /*border: 1px solid #c7c7c7;*/
        cursor: pointer;
    }

    .pvolveCoverImage {
        height: 10rem;
        background-size: cover !important;
        background-position: 50% !important;
    }

    .bottomHeader {
        /* background: rgba(0, 0, 0, .5); */
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        /* padding: .25rem 0; */
        display: inline;
        word-wrap: break-word;
    }

    .bottomLeftHeader {
        width: calc(100% - 3rem);
        font-size: .9rem;
        color: #fff;
        vertical-align: middle;
        float: left;
    }

    .bottomRightHeader {
        text-align: center;
        font-size: .9rem;
        color: #fff;
        vertical-align: middle;
        float: right;
    }

    .topLeftHeader {
        /*background: rgba(0, 0, 0, .4);*/
        text-align: center;
        font-size: .9rem;
        color: #fff;
        vertical-align: middle;
        position: absolute;
        top: 1rem;
        left: 0;
    }

    .topRightHeader {
        /* background: rgba(0, 0, 0, .4); */
        text-align: right;
        font-size: .9rem;
        color: #fff;
        vertical-align: middle;
        position: absolute;
        top: 1rem;
        right: 0;
    }

    .pchip {
        /* width: fit-content; */
        color: #fff;
        padding: .25rem .5rem;
        margin: 0;
    }

    .tagchip {
        /*background: rgba(0, 0, 0, 0.4);*/
        border: #fff 1px solid;
        color: #000;
        font-size: .6rem;
        margin: .1rem .1rem 0 0;
        padding: .1rem .25rem;
        border-radius: .2rem;
        width: fit-content;
        display: inline-flex;
        text-transform: uppercase;
    }

    .thickHeader {
        font-weight: 900;
    }

    .fa-heart {
        color: #F69477;
    }

</style>
