<template>

    <div v-if="collection" class="main">
        <div v-if="!smallScreen" class="meta">
            <div class="title">
                {{ collection.title }}
            </div>
            <div class="description">
                {{ collection.description }}
            </div>
        </div>

        <div class="cards" :class="{ 'cards--small-screen': smallScreen}">
            <div class="meta">
                <div v-if="smallScreen" class="title" style="margin-left: 15px; margin-top: 15px;">
                    {{ collection.title }}
                </div>
                <div v-if="smallScreen" class="description" style="margin-left: 15px;">
                    {{ collection.description }}
                </div>
            </div>

            <div v-if="smallScreen" class="cta">
                <button @click="downloadAll" class="download_cta" style="display:block; width: calc(100% - 30px); margin-left: 15px; margin-right: 15px;">{{ $t('download_all') }}</button>
            </div>

            <div class="row" :style="{ marginTop: smallScreen ? '45px' : '0px' }">
                <div
                    v-for="item in cardsWithIntro"
                    class="col-xs-6 col-sm-4 col-md-3 col-lg-2"
                    style="padding: 0.5rem;"
                >
                    <product-card :componentData="item" />
                </div>

                <div
                    v-if="smallScreen"
                    v-for="item in cardsWithoutIntro"
                    class="col-xs-6 col-sm-4 col-md-3 col-lg-2"
                    style="padding: 0.5rem;"
                >
                    <product-card :componentData="item" />
                </div>
            </div>
        </div>

        <div class="coltitle" v-if="!smallScreen">
            {{ contentCollectionTitle }}
        </div>

        <div v-if="!smallScreen" class="cards">
            <div class="row">
                <div
                    v-for="item in cardsWithoutIntro"
                    class="col-xs-6 col-sm-4 col-md-3 col-lg-2"
                    style="padding: 0.5rem;"
                >
                    <product-card :componentData="item" />
                </div>
            </div>
        </div>

        <div v-if="!smallScreen" class="cta">
            <button class="download_cta" @click="downloadAll">{{ $t('download_all') }}</button>
        </div>

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
            <!-- <q-spinner color="white" size="60px" class="absolute-center" /> -->
            <q-inner-loading color="white" visible />
        </div>
    </div>

</template>

<script>
import ProductCard from 'components/custom/discoveryekb/ProductCard'
import { EKBTools } from './EKBTools'

export default {
    props: ['guid', 'smallScreen'],

    components: {
        ProductCard
    },

    mixins: [EKBTools],

    data() {
        return {
            retry: false,
            collection: null,
            learningGuide: null,
            cardsWithIntro: null,
            cardsWithoutIntro: null
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
        cards(intro) {
            let assets = this.collection.assets
            let retval = []
            let col = this.collection
            let en_intro = 'Introduction'
            let ar_intro = 'المقدمة'

            for(let i in assets) {
                if(assets[i].title.indexOf(en_intro) != -1 || assets[i].title.indexOf(ar_intro) != -1) {
                    if(intro) {
                        retval.push(assets[i])
                    }
                }
            }

            for(let i in assets) {
                if(assets[i].type.id === 'bc3e8afe-7fc6-4999-96c7-b441846014a9') { /* Content Collection */
                    if(intro === false) {
                        for(let j in assets[i].assets) {
                            retval.push(assets[i].assets[j])
                        }
                    }
                } else {
                    if(intro) {
                        if(assets[i].title.indexOf(en_intro) == -1 && assets[i].title.indexOf(ar_intro) == -1) {
                            retval.push(assets[i])
                        }
                    }
                }
            }

            if(intro) {
                retval.push(col)
            }

            return retval
        },
        getParseAndSetCardData() {
            this.collection = null
            this.retry = false

            this.loadMetaForGUID(this.guid, (res) => {
                if (res.collection) {
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

                        this.retry = false

                        this.cardsWithIntro = this.cards(true)
                        this.cardsWithoutIntro = this.cards(false)
                    })
                }
            })

            kw('guidgrid children after getParseAndSetCardData', this.$children)
        },
        downloadAll () {
          kw('download all ran')
          this.$children.forEach((child, childIndex) => {
            kw('download all child', child)
            if (child.downloadItem) child.downloadItem()
          })
        }
    }
}
</script>

<style scoped>

    ::-webkit-scrollbar {
        width:12px;
    }
    ::-webkit-scrollbar * {
        background:transparent;
    }
    ::-webkit-scrollbar-thumb {
        background:rgba(150,150,150,0.30) !important;
        border-radius: 10px;
    }
    :global(.scrollarea .scrollbar-container.vertical .scrollbar) {
        background-color: #ffffff !important;
    }
    .main {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .meta {
        color: #fff;
        padding: 0px 0px 15px 0px;
    }
    :global(.rtl) .meta {
      padding-right: 15px;
    }
    .title {
        font-size: 135%;
        margin-bottom: 15px;
    }
    .cards {
        overflow-y: auto;
        overflow-x: hidden !important;
        height: 100%;
        box-shadow: inset 0px 0px 15px rgba(0,0,0,0.2);
        border-radius: 5px;
        padding-right: 1em;
    }
    :global(.rtl) .cards {
      padding-right: 0px;
      /* padding-left: 1.5em; */
    }
    .cardw {
        float: left;
        display: inline-block;
        margin-left: 15px;
        margin-top: 15px;
    }
    :global(.rtl) .cardw {
        float: right;
    }
    .thumb {
        float: left;
        max-width: 25%;
        margin-right: 15px;
    }
    .introtitle {
        margin-bottom: 5px;
        font-weight: bold;
    }
    .coltitle {
        background-color: rgba(0,0,0,0.2);
        padding: 5px 10px;
        color: #fff;
        margin: 5px 0px;
        border-radius: 5px;
    }
    .download_cta {
        background-color: #fff;
        color: #222;
        padding: 4px 10px;
        float: left;
        display: block;
        border-radius: 5px;
        cursor: pointer;
        opacity: 0.9;
    }
    :global(.rtl) .download_cta {
        float: right;
    }

    .offline {
        align-items: center;
        color: #fff;
        font-size: 120%;
        text-align: center;
        margin-top: auto;
        margin-bottom: auto;
    }
    .tryagain {
        margin: 15px 0;
        min-width: 120px;
        padding: 10px;
        color: #ddd;
        font-size: 80%;
        text-transform: uppercase;
        text-align: center;
        background-color: rgba(16, 116, 187, 0.60);
        border: none;
        border-radius: 5px;
    }
    .tryagain:hover {
        background-color: rgba(16, 135, 219, 0.80);
        color: #fff;
        cursor: pointer;
    }

    .loader-container {
        position: relative;
        min-height: 100%;
        width: 100%;
    }

    @media screen and (max-width: 1000px) {
      :global(.rtl) .cards.cards--small-screen .row {
        max-width: 90%;
      }
    }

</style>
