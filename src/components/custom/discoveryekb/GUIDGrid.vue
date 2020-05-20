<template>
    <div v-if="collection" class="main">
        <div style="padding: 0px 15px 15px 15px;">
            <div style="color: white; font-size: 1.5em; margin: .5rem 0;">
                {{ collection.title }}
            </div>
            <div style="color: white; font-size: 1em;">
                {{ collection.description }}
            </div>
        </div>
        <ProductCardGrid :products="metaCards" customProductCardPath="custom/discoveryekb/ProductCard"  />

        <div style="padding: 15px 15px 15px 15px;color: white; font-size: 1.5em; margin: .5rem 0;">
            {{ collection.title }}
        </div>
        <ProductCardGrid :products="contentCards" customProductCardPath="custom/discoveryekb/ProductCard"  />

    </div>
    <div v-else>
        <div v-if="retry" style="position: relative; width: 100%; height: 100%;">
            <div class="offline absolute-center" style="min-width: 30vw;">
                {{ $t('loading_issue') }}
                <br />
                <button class="tryagain" @click="getParseAndSetCardData">{{ $t('try_again') }}</button>
            </div>
        </div>
        <div v-else class="loader-container">
            <q-inner-loading color="white" visible />
        </div>
    </div>

</template>

<script>
import ProductCardGrid from 'components/common/ProductCardGrid'
import ProductCard from 'components/custom/discoveryekb/ProductCard'
import { EKBTools } from './EKBTools'

export default {
    props: ['guid'],
    name: 'GUIDGrid',
    components: {
        ProductCard,
        ProductCardGrid
    },

    mixins: [EKBTools],

    data() {
        return {
            retry: false,
            collection: null,
            learningGuide: null,
            metaCards: null,
            contentCards: null
        }
    },

    computed: {
        contentCollectionTitle() {
            let assets = this.collection.assets
            for (let i in assets) {
                if(assets[i].type.id === 'bc3e8afe-7fc6-4999-96c7-b441846014a9') { /* Content Collection */
                    return assets[i].title
                }
            }

            return null
        },
        downloadedProducts() {
            return this.$store.state.downloadedProducts;
        },
        productDownloadQueue() {
            return this.$store.state.productDownloadQueue;
        }
    },
    watch: {
        guid() {
            this.getParseAndSetCardData()
        }
    },
    mounted() {
        this.getParseAndSetCardData()
    },
    methods: {
        loadMetaForGUID(guid, cb) {
            this.api.get(`${this.api.apiv3Route}discovery/guid/${guid}`, (res) => {
                if(res.success) {
                    if (cb) cb(res)
                } else {
                    kw('retry got set to true in loadmetaforguid', res)
                    this.retry = true
                }
            })
        },
        loadMetaForAsset(guid, cb) {
            this.getDiscoveryProductInfo(guid, (res) => {
                if (res.success) {
                    if (cb) cb(res)
                } else {
                    this.retry = true
                }
            })
        },

        getMetaCards() {
            let assets = this.collection.assets
            let retval = []
            let en_intro = 'Introduction'
            let ar_intro = 'المقدمة'

            for(let i in assets) {
                if(assets[i].title.includes(en_intro) || assets[i].title.includes(ar_intro)) {
                    retval.push(assets[i])
                }
            }

            retval.push(this.collection)

            return retval
        },

        getContentCards() {
            let assets = this.collection.assets
            let retval = []
            let en_intro = 'Introduction'
            let ar_intro = 'المقدمة'
            
            for(let i in assets) {
                if(assets[i].type.id === 'bc3e8afe-7fc6-4999-96c7-b441846014a9') { /* Content Collection */
                    for(let j in assets[i].assets) {
                        retval.push(assets[i].assets[j])
                    }
                } else {
                    if(!assets[i].title.includes(en_intro) && !assets[i].title.includes(ar_intro)) {
                        retval.push(assets[i])
                    }
                }
            }
            
            return retval
        },


        getParseAndSetCardData() {
            this.collection = null
            this.retry = false

            this.loadMetaForGUID(this.guid, (res) => {
                if (!res.collection) {
                    return;
                }

                this.loadMetaForAsset(res.collection.id, (meta) => {
                    this.learningGuide = meta.asset
                    this.collection = res.collection
                    this.collection = this.conformEKBAsset(this.collection)
                    this.collection.assets.forEach((assetSet, assetSetIndex) => {
                        this.collection.assets[assetSetIndex] = this.conformEKBAsset(assetSet)
                        if (assetSet.assets) {
                        assetSet.assets.forEach((asset, assetIndex) => {
                            this.collection.assets[assetSetIndex].assets[assetIndex] = this.conformEKBAsset(asset)
                        })
                        }
                    })

                    this.prepareCards();
                })
            })
        },

        prepareCards() {
            this.retry = false
            this.metaCards = this.getMetaCards()
            this.contentCards = this.getContentCards()
        },

        downloadAll () {
          kw('download all ran: ', this.$children)
          const downloadedProductsIds = this.downloadedProducts.map(product => product.id);
          const queuedProductsIds = this.productDownloadQueue.map(product => product.id);
          this.$children.forEach(child => {
            child.$children.forEach(child => {
                const productId = child.componentData.id;
                if (!downloadedProductsIds.includes(productId) && !queuedProductsIds.includes(productId) && !child.downloadAboutToStart) {
                    child.downloadItem && child.downloadItem()
                } 
            });
          })
        }
    }
}
</script>
