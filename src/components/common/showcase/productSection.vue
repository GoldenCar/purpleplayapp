<template>

    <div :id="componentData.id" :style="productSectionStyle">

        <div v-if="!useMobileHorizontalScrolling" :class="'row well items-stretch justify-center relative-position' + (showEditor ? ' editStyle' : '')">
<!--
            <div v-if="editMode" class="col-12">
                <q-btn v-if="!showEditor" @click="showEditor = true" class="float-right" size="sm" round color="grey">
                    <q-icon name="fa-edit" />
                    <q-tooltip anchor="center right" self="center left">
                        Edit section
                    </q-tooltip>
                </q-btn>

                <q-btn v-else @click="showEditor = false" class="float-right" size="sm" round color="grey">
                    <q-icon name="fa-times" />
                    <q-tooltip anchor="center right" self="center left">
                        Close editor
                    </q-tooltip>
                </q-btn>
            </div> -->

            <h2 v-if="componentData.heading" class="col-12 dividerHeader" align="center" :style="componentData.headingColor ? 'color: ' + componentData.headingColor + ';' : ''">
                <span :style="'background: ' + (componentData.backgroundColor ? componentData.backgroundColor : '#efefef') + ';'">{{componentData.heading}}</span>
            </h2>

            <p v-if="componentData.description" align="center" class="col-12" :style="componentData.headingColor ? 'color: ' + componentData.headingColor + ';' : ''">{{componentData.description}}</p>

            <div
                :class="`${componentData.columnClass ? componentData.columnClass : componentData.columnsPerRow ? columnsPerRowMap[componentData.columnsPerRow] : columnsPerRowMap['six']} ${componentData.animated ? 'animated-product-card' : ''}`"
                v-if="componentData.products.length && (!componentData.productDisplayLimit || componentData.productDisplayLimit && (!showAllProducts && index < componentData.productDisplayLimit || showAllProducts)) && (!showEditor || (showEditor && currentHomePageSection && currentHomePageSection.content !== 'specificProducts'))"
                v-for="(product, index) in componentData.products"
                :key="index"
                :style="{animationDelay: `${componentData.animated ? (Math.random() * 0.2) + 's' : ''}`, padding: `.5rem`}"
            >
                <div :is="brand.clientProductCard" v-if="!showEditor" class="productCard" :componentData="product" />
                <!-- <div :is="componentData.productCardComponent" v-if="showEditor" class="productCard" :componentData="product" :notSelectable="true" /> -->
            </div>

            <q-inner-loading :visible="componentLoad" />

            <div v-if="componentData.products.length && componentData.seeMore" class="col-12" style="padding-top: 1rem; text-align: center;">

                <q-btn :style="seeMoreStyle" @click="cardTap(componentData.seeMore)">
                    {{componentData.seeMore.title}}
                </q-btn>

            </div>

            <div v-if="componentData.products.length && componentData.seeAllProducts && environmentProducts.length > 6" class="col-12" style="padding-top: 1rem; text-align: center;">

                <q-btn outline id="browseThem" @click="goToSeeAllProducts" :style="seeAllStyle">
                    <h6 style="font-size: .8rem; letter-spacing: 1px;">{{componentData.seeAllText ? componentData.seeAllText : 'Browse all products'}}</h6>
                </q-btn>

            </div>

            <div v-if="componentData.products.length && componentData.productDisplayLimit && componentData.products.length > componentData.productDisplayLimit" class="col-12" style="padding-top: 1rem; text-align: center;">

                <q-btn outline @click="showAllProducts = !showAllProducts" :style="seeAllStyle">
                    <h6>
                        {{ showAllProducts ? 'show less' : 'show all' }}
                        <q-icon :name="showAllProducts ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" style="font-size: .8rem;" />
                    </h6>
                </q-btn>

            </div>

        </div>

        <div v-if="useMobileHorizontalScrolling">

            <div v-if="componentData.heading" class="row" style="padding: 1rem;">
                <h2 class="col-12 dividerHeader" align="center" :style="componentData.headingColor ? 'color: ' + componentData.headingColor + ';' : ''">
                    <span :style="'background: ' + (componentData.backgroundColor ? componentData.backgroundColor : '#efefef') + ';'">{{componentData.heading}}</span>
                </h2>
            </div>

            <div id="mobileCards" class="relative-position">
                <div
                    class="mobileCard"
                    v-if="componentData.products.length"
                    v-for="(product, index) in componentData.products"
                    :key="index"
                    :style="{ padding: `.5rem` }"
                >
                    <div :is="brand.clientProductCard" :componentData="product" />
                </div>
            </div>
            <!--<div align="right" style="padding: 0 .5rem;">-->
            <!--    <h6 class="text-grey-5" style="font-size: .8rem; vertical-align: middle;">scroll <q-icon name="fas fa-chevron-right" style="font-size: .7rem; vertical-align: baseline;" /> <q-icon name="fas fa-chevron-right" style="font-size: .7rem; vertical-align: baseline;" /></h6>-->
            <!--</div>-->
        </div>

    </div>

</template>

<script>

    export default {
        props: ['componentData', 'sectionIndex'],

        mixins: [],

        components: {

        },

        data() {
            return {
                showEditor: false,
                showAllProducts: false,
                loadit: false
            }
        },

        computed: {

            componentLoad() {
                return !this.componentData.products.length && !this.editMode
            },

            environmentProducts() {
                return this.$store.state.environmentProducts
            },

            environmentJson() {
                return this.$store.state.environment.json
            },

            productSectionStyle() {
                return 'background: ' + (this.componentData.backgroundImageURL ? 'url(https://f3r6v6t8.ssl.hwcdn.net/static/clients/' + this.componentData.backgroundImageURL + ')' : this.componentData.backgroundColor ? this.componentData.backgroundColor : '#efefef') + '; position: relative; padding-bottom: 1.5rem;'
            },

            seeMoreStyle() {
                return 'color: ' + (this.componentData.seeMore.textColor || '#fff') + ';' + 'background: ' + (this.componentData.seeMore.backgroundColor || this.environmentJson.e.brandColor) + ';'
            },

            seeAllStyle() {
                // return this.environmentJson.e.brandColor ? `background-color: ${this.environmentJson.e.brandColor} !important; color: #333;` : 'background-color: #fff !important;'
                return 'background-color: #fff !important;'
            },

            navBarData() {
                return this.$store.state.navBarData
            },

            columnsPerRowMap() {
                return this.$store.state.columnsPerRowMap
            },

            // editMode() {
            //     return this.$store.state.editMode
            // },

            homePageSections() {
                return this.$store.state.environment.json.homePageSections
            },

            currentSectionEditIndex() {
                return this.$store.state.currentSectionEditIndex
            },

            currentHomePageSection() {
                return this.homePageSections && this.sectionIndex > -1 ? this.homePageSections[this.sectionIndex] : ''
            },

            useMobileHorizontalScrolling() {
                k('useMobileHorizontalScrolling: ', this.$q.platform.is.mobile && this.componentData.useHorizontalScrolling ? true : false)
                return this.$q.platform.is.mobile && this.componentData.useHorizontalScrolling ? true : false
            }
        },

        watch: {
            editMode() {
                this.showEditor = false
            }
        },

        methods: {

            cardTap(card) {
                var tags = card.tags
                var link = card.link

                if (tags && tags.length) {
                    this.route('/tagFilter/' + tags)
                    // window.location.hash = 'topOfShowcase'
                }
                else if (link) {
                    if (link.indexOf('http') > -1) {
                        window.open(link, '_blank')
                    }
                    else {
                        this.route(link)
                        // window.location.hash = 'topOfShowcase'
                    }
                }
            },

            goToSeeAllProducts() {
                k('navData: ', this.navBarData)

                var shopNavItem = this.navBarData.filter((item) => {
                    return item.navItemSKU === 'shop'
                })[0]

                // k('shopNavItem: ', shopNavItem)

                this.route(this.componentData.seeAllRoute ? this.componentData.seeAllRoute : (shopNavItem.hide ? '/' : '/shop'))
                this.$nextTick(() => {
                    window.scrollTo(0, 0)
                })
            },

            removeProduct(index) {
                k('remove product: ', index)
                k('products for section: ', this.homePageSections, this.sectionIndex)

                this.homePageSections[this.sectionIndex].products.splice(index, 1)
                this.homePageSections[this.sectionIndex].productIDs.splice(index, 1)

                this.selectedSearchItems = this.homePageSections[this.sectionIndex].products
                this.$store.commit('homePageSections', this.homePageSections)
            },

            updateProductIDArray() {
                k('updateProductIDArray: ', this.homePageSections[this.sectionIndex].products)
                this.homePageSections[this.sectionIndex].productIDs = this.homePageSections[this.sectionIndex].products.map((item) => {
                    return item.productID
                })
                k('updateProductIDArray ids: ', this.homePageSections[this.sectionIndex].productIDs)
                this.$store.commit('homePageSections', this.homePageSections)
            },

        },

        mounted() {
            k('product section componentData: ', this.componentData)

            this.loadit = true

            // if this is mounted while edit mode is on
            if (this.editMode && this.sectionIndex === this.currentSectionEditIndex) {
                k('EDIT THIS')
                this.showEditor = true
                this.scrollIt(this.componentData.id, null, 110)
            }
        }
    }
</script>

<style scoped>
    .editStyle {
        border: 5px dashed #999;
    }

    .animated-product-card {
        opacity: 0;
        position: relative;
        transform: scale(.6);
        animation: fadein 0.3s;
        animation-fill-mode: forwards;
    }

    @keyframes fadein {
        from {
            opacity: 0;
            transform: scale(.5);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    #mobileCards {
        min-width: 100%;
        min-height: 200px;
        display: flex;
        overflow-x: scroll;
        overflow: -moz-scrollbars-none;
        -webkit-overflow-scrolling: touch;
        -ms-overflow-style: none;
    }

    .mobileCard {
        min-width: 20rem;
        max-width: 20rem;
    }

    #mobileCards::-webkit-scrollbar {
        display: none;
    }
</style>
