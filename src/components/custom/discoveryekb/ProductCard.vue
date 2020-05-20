<template>
    <!-- <div> -->
        <div class="card">
            <img :src="productIsDownloaded ? downloadedImageURL : coverImageURL" class="theme ext_card_img card-thumbnail" :class="{ 'type_thumbnail': !productThumbnail }" />

            <div class="topRightHeader">
                <div v-if="(productIsQueued && !productIsDownloading) || productIsDownloaded" class="pchip">
                    <h6 style="margin: 0; font-size: .7rem;" v-if="productIsQueued && !productIsDownloading">{{$t('queued')}}</h6>
                    <!-- <h6 style="margin: 0; font-size: .7rem;" v-if="productIsDownloading">DOWNLOADING</h6> -->
                    <h6 style="margin: 0; font-size: .7rem;" v-if="productIsDownloaded">{{$t('downloaded')}}</h6>
                </div>
            </div>

            <div v-if="productThumbnail" class="type_icon">
                <img :src="'statics/ekb/type-icons/' + productType + '.png'" alt="">
            </div>

            <q-progress
                color="green"
                height="10px"
                v-if="productIsDownloading"
                :percentage="Number(currentProductFileDownloadingProgress)"
                />

            <div class="bg-white text-center" v-if="productIsDownloading">
                <span style="color: #999; font-size: 0.85rem; padding-top: 10px;">{{ $t('DOWNLOADING') + ' ' + (currentProductFileDownloadingIndex + 1) + '/' + (productFileDownloads.length) }}</span>
            </div>
            <div class="card_meta">
                <q-inner-loading :visible="downloadAboutToStart"  style="color: black !important;" />

                <div class="card_title">
                    <span v-html="componentData.name || componentData.title"></span>
                </div>

                <div style="position: relative;">
                    <div class="row actions">
                        <div class="col-6">
                            <q-btn class="full-width" flat style="padding: 0 .5rem;" @click="playResource()">
                                <q-icon color="grey-5" name="fas fa-play-circle" style="color: #5bace8 !important;" />
                            </q-btn>
                        </div>
                        <div class="col-6 relative-position" v-if="productType !== 'interactive' || $q.platform.is.electron">
                            <q-btn v-if="!downloadAboutToStart && !productIsDownloading && !productIsDownloaded && !productIsQueued" class="full-width" flat @click.stop="downloadItem" style="padding: 0 .5rem;">
                                <q-icon color="grey-8" name="fas fa-download" />
                            </q-btn>
                            <q-btn v-if="productIsDownloading" class="full-width" flat @click.stop="cancelProductDownload" style="padding: 0 .5rem;">
                                <q-icon color="red" name="fas fa-ban" />
                            </q-btn>
                            <q-btn v-if="productIsDownloaded" class="full-width" flat @click.stop="deleteProduct(productID)" style="padding: 0 .5rem;">
                                <q-icon color="red" name="fas fa-times" />
                            </q-btn>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <!-- </div> -->
</template>

<script>
    import { productCardTools } from '../../../mixins/productCardTools'
    import { productCardDownloadTools } from '../../../mixins/productCardDownloadTools'
    import { EKBTools } from './EKBTools'
    import moment from 'moment'

    export default {

        mixins: [productCardTools, productCardDownloadTools, EKBTools],

        data () {
            return {
                downloadLoader: false,
                downloadAboutToStart: false,
            }
        },

        computed: {
            downloadedImageURL() {
                return this.productThumbnailFileNameFromRemoteURL ? this.getLocalURL(this.componentData.productSKU, this.componentData.productSKU + '.png').signedURL : `statics/ekb/type-icons/${this.productType}.png`
            },

            coverImageURL() {
                return this.productThumbnail ? this.productThumbnail : `statics/ekb/type-icons/${this.productType}.png`
            },

            productThumbnail() {
                let productThumbnail = false

                // if a regular thumbnail, return thumbnail
                if (this.componentData.thumbnail) {
                    if (this.componentData.thumbnail.startsWith('http')) productThumbnail = this.componentData.thumbnail
                }

                // else return thumbnail of player size
                if (this.componentData.thumbnails && this.componentData.thumbnails.length > 0) {
                    productThumbnail = this.componentData.thumbnails.find(thumbnail => thumbnail.size === 'player').url
                }

                // k('productThumbnail: ', productThumbnail)

                return productThumbnail
            },

            productThumbnailFileNameFromRemoteURL() {
                return this.productThumbnail ? this.productThumbnail.split('/').pop() : false
            },

            productType() {
                return this.getEKBProductTypeIcon(this.componentData)
            },

            productID() {
                return this.componentData.id || this.componentData.guid
            },

            appOnline() {
                return !this.$store.state.appOffline
            },
        },

        methods: {
            playResource() {
                let userCanViewProduct = this.userCanViewProductOffline();

                if (!userCanViewProduct) {
                    this.$q.notify({
                        message: "Please go back online to see this product",
                        type: "negative",
                        icon: "fas fa-exclamation-circle",
                        position: "bottom-left"
                    });
                    return;
                }

                this.checkAccess(this.productID, (res) => {
                    if (res.access) {
                        this.$store.commit('addKeyPathInStore', {
                            keyPath: 'selectedProductModal',
                            value: this.productID,
                        })
                    } else {
                        this.$q.notify({
                            message: 'This content is not available in your country',
                            type: 'negative',
                            icon: 'fas fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            },
            
            checkAccess(id, cb) {
                let password = localStorage.getItem('admin-password');
                k('checkAccess password: ', password)

                if (this.appOnline) {
                    let accessRoute = `${this.api.apiv3Route}discovery/verifyAccess/${id}${password ? `?password=${password}`: '' }`
                    k('accessRoute: ', accessRoute)
                    this.api.get(accessRoute, (res) => {
                        k('accessRoute res: ', res)

                        if (res.success) {
                            if (res.data && res.data.access && this.productIsDownloaded) {
                                this.setLastTimeViewed();
                            }
                            return cb(res.data)
                        } else {
                            return cb({
                                access: true
                            })
                        }
                    })
                } else {
                    return cb({
                        access: true
                    })
                }
            },

            downloadItem() {
                this.downloadAboutToStart = true
                kw('downloadItem ran')

                this.setLastTimeViewed();

                let productName = this.componentData.name || this.componentData.title;

                this.api.sendEvent({
                    eventType: 'userTapped2DownloadProduct',
                    productName: productName,
                    productSKU: this.componentData.productSKU,
                    sceneContext: this.sceneContext(this.$route.fullPath),
                    eventDesc: `user tapped to download ${productName}`,
                    contentType: this.productType,
                })

                this.checkAccess(this.productID, r => {
                    if (r.access) {
                        this.getDiscoveryProductInfo(this.productID, (res) => {
                            this.downloadAboutToStart = false

                            if (!res.asset) {
                                this.$q.notify({
                                    message: 'Problem accessing product.',
                                    type: 'negative',
                                    icon: 'fas fa-exclamation-circle',
                                    position: 'bottom-left'
                                });
                                return;
                            }

                            if (res.success) {
                                let product = this.conformEKBAsset(res.asset)

                                if (this.productThumbnail) {
                                    product.remoteCoverImageURL = this.productThumbnail
                                } else {
                                    product.noCoverImage = true
                                }
                                this.$store.commit('addProductToDownloadQueue', product)
                                kw('product added to download queue', product)
                                this.startDownloadQueue()

                                var logEventObj = {
                                    eventType: 'downloadingProduct',
                                    eventDesc: 'user has queued a product for download: ' + product.productName,
                                    productName: product.productName,
                                    productSKU: product.productSKU,
                                    productID: product.productID,
                                    userID: this.$store.state.user.info.userID,
                                    os: this.$store.state.userAgentInfo.os.name,
                                    contentType: product.group,
                                }
                                this.api.sendEvent(logEventObj)
                            }
                        })
                    } else {
                        this.$q.notify({
                            message: 'This content is not available in your country',
                            type: 'negative',
                            icon: 'fas fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                        this.downloadAboutToStart = false
                    }
                })
            },

            setLastTimeViewed() {
                localStorage.setItem(
                    `${this.productID}.lastTimeViewedOnline`,
                    moment().toISOString()
                );
            },

            userCanViewProductOffline() {
                if (this.productIsDownloaded && !this.appOnline) {
                    let lastTimeViewedOnline = localStorage.getItem(`${this.productID}.lastTimeViewedOnline`);

                    if (!lastTimeViewedOnline) {
                        return true;
                    }

                    let daysDifference = moment().diff(moment(lastTimeViewedOnline), "days");

                    if (daysDifference > 60) {
                        return false;
                    }
                }
                return true;
            },

            deleteProduct(productID) {
                this.$q.dialog({
                    message: this.$t('Are you sure you want to remove this item?'),
                    ok: this.$t('Yes'),
                    cancel: this.$t('Cancel'),
                    color: 'tertiary'
                }).then(() => {
                    this.deleteLocalProduct(productID)
                }).catch(() => {
                    // cancel clicked
                })
            }
        },

        created() {
            // k('productCard: ', this.componentData)
            // k('productThumbnailFileNameFromRemoteURL: ', this.productThumbnailFileNameFromRemoteURL)
        }
    }
</script>

<style scoped>
    .actions {
    width: 100%;
    bottom: 0;
    position: absolute;
    }

    .card {
    height: 245px;
    width: 100%;
    max-width: 265px;
    border-radius: 13px;
    overflow: hidden;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 2px 25px rgba(0,0,0,0.4);
    border: 3px solid #fff;
    position: relative;
    background-color: #EEE;
    }
    /* .card:hover {
    border: 3px solid yellow;
    opacity: 1;
    } */
    .card img {
    width: 100%;
    position: relative;
    max-height: 100px;
    display: block;
    border-radius: 12px 12px 0 0;
    }

    .card img.type_thumbnail {
    height: 80px;
    width: 80px;
    margin: 10px auto;
    }

    .card_meta {
    padding: .5rem;
    border-radius: 0 0 10px 10px;
    background-color: #fff;
    flex-grow: 1;
    text-align: center;
    display: flex;
    flex-direction: column;
    font-size: 85%;
    }
    .card_title {
    flex-grow: 3;
    margin-bottom: 30px;
    color: #999;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    }
    .card_actions {
    transition: opacity .15s ease-out;
    opacity: 0.0001;
    display: flex;
    padding: 0px 10px;
    list-style: none;
    z-index: 2;
    -webkit-user-select:none;
    user-select: none;
    height: 25px;
    min-height: 25px;
    bottom: 0;
    position: absolute;
    left: 0;
    right: 0;
    }
    .card_actions li {
    flex-grow: 1;
    transition: color .15s ease-out;
    color: #666;
    }
    .card_actions li:hover {
    color: #333;
    }
    .card:hover .card_actions {
    opacity: 1;
    }
    .nomatch {
    transform: scale(0.5);
    opacity: 0.5;
    display: none;
    }
    .badges {
    position: relative;
    z-index: 1;
    }
    .badges span {
    background-color: #999;
    color: #fff;
    border-radius: 3px;
    font-size: 65%;
    padding: 3px 5px;
    text-transform: uppercase;
    position: absolute;
    display: block;
    bottom: 10px;
    right: 10px;
    }

    .badges :global(.new) {
    background-color: #3f1d94;
    }
    .badges :global(.pending) {
    background-color: #ed8e00;
    }
    .badges :global(.queued) {
    background-color: #ed8e00;
    }
    .badges :global(.downloading) {
    background-color: #0085ff;
    }
    .badges :global(.cached) {
    background-color: #35941d;
    }
    .card:hover .badges {
    opacity: 0.4;
    }
    .available {
    opacity: 0.4;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    }
    .sync {
    left: 10px;
    right: auto !important;
    background-color: transparent !important;
    padding: 0px !important;
    color: #35941d !important;
    display: flex !important;
    align-items: center;
    }
    .sync i {
    font-size: 15px;
    margin-right: 3px;
    color: #35941d;
    }

    .type_icon {
    height: 0px;
    z-index: 10;
    }

    .type_icon img {
    width: 100%;
    position: relative;
    max-height: 100px;
    display: block;
    border-radius: 12px 12px 0 0;
    top: -20px;
    left: 10px;
    max-width: 32px;
    }

    :global(.rtl) .type_icon img {
    left: 0px;
    right: 10px;
    }

    .badges :global(.downloading::after) {
    content: '';
    opacity: 0;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #fff;
    border-radius: 3px;
    animation: animate-shine 2s ease-out infinite;
    }
    .card-thumbnail {
    height: 100px;
    object-fit: cover;
    }
    @keyframes animate-shine {
    0% {opacity: 0; width: 0;}
    50% {opacity: .5;}
    100% {opacity: 0; width: 95%;}
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
        background: #333;
        color: #fff;
        padding: .25rem .5rem;
        margin: 0;
    }
</style>
