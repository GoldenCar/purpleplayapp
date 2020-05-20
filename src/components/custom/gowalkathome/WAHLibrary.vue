<template>
    <div class="row justify-center relative-position">

        <div class="col-12">

            <div v-if="(userActiveProducts && userActiveProducts.length) || userActiveProductState.indexOf('fetching') > -1" class="row bg-grey-3 justify-center relative-position" style="min-height: 3rem; padding: 1rem;">
                <q-inner-loading :visible="showLoader" />

                <div class="col-12" align="center">
                    <h6>Your Library</h6>
                    <hr />
                </div>

                <div v-if="ydwSubscriber" class="col-xs-6 col-sm-3 col-md-2" style="padding: .5rem;" align="center" @click="route('/yourdailywalk')">
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
                    v-for="item in validProducts"
                    v-if="!ydwSubscriberIDs.includes(item.productID) && (brand.freeBundleID && item.productID !== brand.freeBundleID) && (brand.previewBundleID && item.productID !== brand.previewBundleID)"
                    class="col-xs-6 col-sm-3 col-md-2"
                    style="padding: .5rem;"
                    align="center"
                    @click="$root.launchProduct(item)"
                >
                    <walkAtHomeCard :componentData="item" />
                </div>
            </div>

            <freeProductsRow></freeProductsRow>
        </div>
    </div>
</template>

<script>
    import walkAtHomeCard from './walkAtHomeCard'
    import freeProductsRow from '../../common/freeProductsRow'

    export default {
        data() {
            return {
                productTypes2Hide: ['channel', 'bundleProduct', 'modcontent_bundle', 'test_modcontent_bundle', 'offline_channel'],

                itemImageURL(item) {
                    return 'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + item.productSKU + '/' + item.productSKU + '_image_cover.png'
                }
            }
        },

        components: {
            walkAtHomeCard,
            freeProductsRow
        },

        computed: {

            showLoader() {
                return this.userActiveProductState.indexOf('fetching') > -1 ? true : false
            },

            ydwSubscriberIDs() {
                return this.brand.validSubscriptionProductIDs
            },

            ydwSubscriber() {
                return this.userActiveProducts ? this.userActiveProducts.filter((product) => {
                    return this.ydwSubscriberIDs.includes(product.productID)
                }).length : ''
            },

            authenticated() {
                return this.$root.$store.state.user.authenticated
            },

            validProducts() {
                return this.userActiveProducts ? this.userActiveProducts.filter((product) => {
                    // return this.productTypes2Hide.includes(product.productType) ? false : true
                    return product.statusTypes ? product.statusTypes.split(',').indexOf('2') > -1 || (product.statusTypes == 9 && (product.masterProducts ? product.masterProducts.indexOf(this.ydwSubscriberIDs[0]) === -1 && product.masterProducts.indexOf(this.ydwSubscriberIDs[1]) === -1 && product.masterProducts.indexOf(this.ydwSubscriberIDs[2]) === -1 : false)) : ''
                }) : ''
            },

            userActiveProducts() {
                return this.$root.$store.state.userActiveProducts
            },

            userActiveProductState() {
                return this.$root.$store.state.userActiveProductState
            },

            yourDailyWalkCard() {
                return 'position: relative; background: #80c830; height: 100%; min-height: 10rem; border: 1px solid #cecece; border-radius: .2rem; box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12); cursor: pointer;'
            },

            freeBundleID() {
                return this.brand.freeBundleID
            }
        },

        watch: {
            userActiveProductState() {
                k('userActiveProductState: ', this.userActiveProductState)
            },

            showLoader() {
                k('showLoader: ', this.showLoader)
            }
        },

        created() {
            k('userActiveProductState: ', this.userActiveProductState)
        }
    }
</script>

<style>
</style>
