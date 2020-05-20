<template>

    <q-list id="tagSidebar" class="bg-white shadow-1" v-if="tagHeadingsObj4Scope" style="border-radius: .2rem; padding-top: 0px; padding-bottom: 8px;">
        <q-list-header>
            <h5 class="float-left" style="font-size: 1rem; margin-bottom: 0.5rem; margin-top: 0.5rem;">
                Tags
                <q-icon name="fas fa-tags" style="margin-left: 0px'" />
            </h5>
            <div v-if="userSelectedTags.length" class="float-right" style="padding: 0 .5rem;">
                <a @click="deselectAll()" style="cursor: pointer;">Clear tags</a>
            </div>
        </q-list-header>

        <!--<q-item class="row" :style="'background: ' + brandColor + ';'">-->
        <!--    <div class="col" style="padding: 0 .5rem;">-->
        <!--        <q-btn size="sm" outline class="full-width" color="white" @click="collapseAll()">collapse all</q-btn>-->
        <!--    </div>-->
        <!--    <div class="col" style="padding: 0 .5rem;">-->
        <!--        <q-btn size="sm" outline class="full-width" color="white" @click="deselectAll()">deselect all</q-btn>-->
        <!--    </div>-->
        <!--</q-item>-->

        <q-item-separator style="clear: both;" />

        <div v-for="(heading, key, index) in tagHeadingsObj4Scope" :key="key">

            <q-collapsible class="tagHeading" v-model="heading.opened" v-if="showHeading(heading)" @show="heading.opened = true" @hide="heading.opened = false">
                <template slot="header">
                    <q-item-main v-html="headingLabel(heading, key)" />
                </template>

                <q-list class="full-width bg-white" highlight style="border-right: none; border-left: none; padding: 0px;">
                    <div v-if="showTag(tag)" v-for="tag in heading.tags" :key="tag.id" @click="userClickedTag(tag.id)">
                        <q-item class="child-category" :class="(userSelectedTags.includes(String(tag.id)) ? 'selected ' : '') + 'cursor-pointer tagButton'" :style="tagStyle(userSelectedTags.includes(String(tag.id)))">
                            <q-item-main>
                                <q-item-tile label>
                                    <span class="tagName" :style="'color: ' + (userSelectedTags.includes(String(tag.id)) ? 'white' : '#333') + '!important; margin-left: 1rem;'">{{tag.tagName}}</span>
                                </q-item-tile>
                            </q-item-main>

                            <q-item-side right>
                                <span class="pchip gt-lg" :style="tagPchipStyle(userSelectedTags.includes(String(tag.id)))">{{numberOfProductsForTagName(tag.id)}}</span>
                                <span class="pchip lt-lg" :style="tagPchipStyle(userSelectedTags.includes(String(tag.id)))">{{numberOfProductsForTagName(tag.id)}}</span>
                                <q-item-tile icon="fas fa-tag" :color="userSelectedTags.includes(String(tag.id)) ? 'white' : 'grey'" />
                            </q-item-side>
                        </q-item>
                    </div>
                </q-list>
            </q-collapsible>

            <div v-for="tag in heading.tags" :key="tag.id" @click="userClickedTag(tag.id)" v-if="userSelectedTags.includes(String(tag.id)) && !heading.opened">
                <q-item class="cursor-pointer selected" style="border-top: 1px solid #fff; border-bottom: 1px solid #fff; font-size: .8rem;" :style="tagStyle(true)">
                    <q-item-main>
                        <q-item-tile label>{{tag.tagName}}</q-item-tile>
                    </q-item-main>

                    <q-item-side right>
                        <q-item-tile icon="fas fa-tag" :color="userSelectedTags.includes(String(tag.id)) ? 'white' : 'grey'" />
                    </q-item-side>
                </q-item>
            </div>
        </div>

    </q-list>

</template>

<script>

    export default {

        props: ['productScope', 'tagScope', 'tagHeadingsObj4Scope'],

        data() {
            return {
                tagHeading: false,
                currentTagObjCount: '',

                anyTagsSelected4Heading(key) {
                    var selectedTags = false
                    var tags4heading = this.tagHeadingsObj4Scope[key].tags
                    // k('key: ', key, tags4heading)

                    Object.keys(tags4heading).forEach((tagKey) => {
                        var tag = tags4heading[tagKey]
                        if (tag.selected) selectedTags = true
                    })
                    return selectedTags
                },

                numberOfProductsForTagName(tagID) {
                    var numberOfProducts = this.currentTagObjCount.productCountPerTag[tagID]
                    // k('numberOfProducts: ', tagID, numberOfProducts)
                    return numberOfProducts
                },

                headingLabel(heading, key) {
                    // k('headingLabel: ', heading.tags)
                    // return key.charAt(0).toUpperCase() + key.slice(1) + ' <span class="pchip">' + this.filteredHeadingTags(heading).length + '</span>'
                    return `<span style="font-size: .9rem; color: #000;">${key.charAt(0).toUpperCase() + key.slice(1)} <span class="pchip gt-lg" style="background-color: #E8E8E8; padding: .25rem .5rem; border-radius: .2rem; color: #000; font-size: .8rem; float: right;"> ${this.filteredHeadingTags(heading).length}</span><span class="pchip lt-lg" style="background-color: #E8E8E8; padding: .25rem .5rem; border-radius: .2rem; color: #000; font-size: .8rem; float: right;"> ${this.filteredHeadingTags(heading).length}</span></span>`
                },

                filteredHeadingTags(heading) {
                    var filteredHeadingTags = Object.keys(heading.tags).filter((key) => {
                        var tag = heading.tags[key]
                        // k('tag: ', tag)
                        return tag
                    })

                    // k('filteredHeadingTags: ', filteredHeadingTags)
                    return filteredHeadingTags
                },

                showTag(tag) {
                    return tag.userActiveProductTag && tag.webplayer
                },

                showHeading(heading) {
                    // k('showHeading: ', this.filteredHeadingTags(heading).length)
                    return this.filteredHeadingTags(heading).length
                }
            }
        },

        computed: {

            brandColor() {
                return this.brand.brandColor
            },

            userSelectedTags() {
                return this.$store.state.userSelectedTags
            },
        },

        watch: {
            productScope() {
                this.generateCurrentTagObjCount()
            }
        },

        created() {
            this.generateCurrentTagObjCount()
        },

        methods: {

            tagPchipStyle(selected) {
            //   if (selected) {
                  return "background-color: white"
            //   } else {
            //       return "background-color: #E8E8E8"
            //   }
            },

            tagStyle(selected) {
                if (selected) {
                    return `background-color: ${this.brandColor}; color: #fff;`
                } else {
                    return "";
                }
            },

            userClickedTag(id) {
                k('userClickedTag: ', id)
                this.$emit('selectTag', id)
            },

            generateCurrentTagObjCount() {
                var tagObj = {}
                var tagHeadingObj = {}
                var usedProducts = []
                var products = this.productScope
                var allTags = this.tagScope
                k('currentTagObjCount products: ', products, allTags)

                products.forEach((product) => {
                    // k('product: ', product.tags, product.productName, product)

                    var tags = product.tags
                    if (tags && tags.includes(',')) {
                        tags = tags.split(',')
                    } else {
                        tags = [tags]
                    }

                    if (tags) tags.forEach((tagID) => {
                        var tag = allTags[tagID]

                        if (tag) {
                            // k('tag: ', tag)
                            if (!tagHeadingObj[tag.tagHeadingID]) {
                                tagHeadingObj[tag.tagHeadingID] = 0
                            }
                            tagHeadingObj[tag.tagHeadingID]++

                            if (!tagObj[tag.id]) {
                                tagObj[tag.id] = 0
                            }
                            tagObj[tag.id]++
                        }
                    })
                })

                this.currentTagObjCount = { productCountPerTag: tagObj, productCountPerHeading: tagHeadingObj }
                k('currentTagObjCount: ', this.currentTagObjCount)
            },

            collapseAll() {
                this.tagHeading = false
            },

            deselectAll() {
                // k('userSelectedTags: ', this.userSelectedTags)
                if (!this.userSelectedTags.length) return false

                // this.markSelectedTags()
                this.$store.commit('setUserSelectedTags', '')
            }
        }
    }
</script>

<style scoped>
    .pchip {
        font-size: .8rem;
        background: #fff;
        color: #000;
        padding: .25rem .5rem;
        /*margin: .25rem;*/
        border-radius: .2rem;
        /*float: right;*/
    }

    .q-icon {
        font-size: 1rem !important;
    }

    .tagButton {
        background: #efefef;
    }
</style>

<style>
    .q-collapsible-sub-item {
        padding: 0;
        border-width: 0;
    }
    .q-item {
        border-top: 1px solid white;
        border-bottom: 1px solid white;
    }
    .q-item.child-category:hover {
        background-color: rgba(189,189,189,0.5);
    }
    .tagName {
        font-size: .9rem;
    }
</style>
