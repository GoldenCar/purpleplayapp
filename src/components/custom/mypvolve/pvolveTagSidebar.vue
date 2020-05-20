<template>

    <div v-if="tagHeadingsObj4Scope && Object.keys(tagHeadingsObj4Scope).length">
        <!--<div style="padding: 0 .5rem;">-->
        <!--    <q-btn @click="showSidebarMobile = !showSidebarMobile" v-if="windowWidth < 768" class="full-width" style="background: #93d6bd; color: white;">-->
        <!--        <h6>Filter workouts</h6>-->
        <!--    </q-btn>-->
        <!--</div>-->

        <q-card class="row bg-white no-shadow" style="margin: 0;">
            <q-card-main class="col-12" style="padding-bottom: 0;">
                <h6>Filter workouts</h6>
                <hr />
            </q-card-main>

            <q-card-main class="col-md-4" style="padding-top: 0;">
                <q-select
                    v-if="tagHeadingsObj4Scope && tagHeadingsObj4Scope['duration'] && tagHeadingsObj4Scope['type']"
                    multiple
                    @input="multipleSelectTag"
                    color="grey"
                    float-label="Filter by types"
                    v-model="selectedTypeOptions"
                    :options="typeOptions"
                />
            </q-card-main>

            <q-card-main class="col-md-4" style="padding-top: 0;">
                <q-select
                    v-if="tagHeadingsObj4Scope && tagHeadingsObj4Scope['body focus']"
                    multiple
                    @input="multipleSelectTag"
                    color="grey"
                    float-label="Filter by body focus"
                    v-model="selectedBodyFocusOptions"
                    :options="multipleSelectOptionsFromTagHeading('body focus')"
                />
            </q-card-main>

            <q-card-main class="col-md-4" style="padding-top: 0;">
                <q-select
                    v-if="tagHeadingsObj4Scope && tagHeadingsObj4Scope['equipment']"
                    multiple
                    @input="multipleSelectTag"
                    color="grey"
                    float-label="Filter by equipment owned"
                    v-model="selectedEquipmentOptions"
                    :options="multipleSelectOptionsFromTagHeading('equipment')"
                />
            </q-card-main>

            <q-card-main v-if="userSelectedTags.length" align="center" class="col-12" style="padding: .5rem;">
                <q-btn size="sm" class="bg-grey-2" flat @click="clearFilters()">
                    <h6 style="font-size: .8rem;">Clear Filters</h6>
                    <q-icon name="fas fa-caret-right" />
                </q-btn>
            </q-card-main>

            <q-card-main class="col-12" :align="windowWidth < 768 ? 'left' : 'center'" style="padding: .5rem;">
                <q-btn v-if="favoritedProductIDs && favoritedProductIDs.length" outline size="xs" @click="sortLibrary('favorites')" style="background: #fff !important; color: #333; margin: .25rem;">
                    <q-icon :name="showFavoritesOnly ? 'fas fa-check-circle' : 'far fa-circle'" :style="`color: ${pvolveMintTitle}; font-size: .8rem; margin-left: 0;`" />
                    <h6 style="font-size: .8rem; letter-spacing: 1px; margin: 0;">
                        Favorites
                    </h6>
                </q-btn>

                <q-btn v-if="exclusiveProducts && exclusiveProducts.length" outline size="xs" @click="sortLibrary('exclusiveContent')" style="background: #fff !important; color: #333; margin: .25rem;">
                    <q-icon :name="showExclusiveContentOnly ? 'fas fa-check-circle' : 'far fa-circle'" :style="`color: ${pvolveMintTitle}; font-size: .8rem; margin-left: 0;`" />
                    <h6 style="font-size: .8rem; letter-spacing: 1px; margin: 0;">
                        Exclusive Content
                    </h6>
                </q-btn>

                <q-btn outline size="xs" @click="sortLibrary('topRated')" style="background: #fff !important; color: #333; margin: .25rem;">
                    <q-icon :name="sortLibraryTopRated ? 'fas fa-check-circle' : 'far fa-circle'" :style="`color: ${pvolveMintTitle}; font-size: .8rem; margin-left: 0;`" />
                    <h6 style="font-size: .8rem; letter-spacing: 1px; margin: 0;">
                        Top Rated
                    </h6>
                </q-btn>

                <q-btn outline size="xs" @click="sortLibrary('mostRecent')" style="background: #fff !important; color: #333; margin: .25rem;">
                    <q-icon :name="sortLibraryMostRecent ? 'fas fa-check-circle' : 'far fa-circle'" :style="`color: ${pvolveMintTitle}; font-size: .8rem; margin-left: 0;`" />
                    <h6 style="font-size: .8rem; letter-spacing: 1px; margin: 0;">
                        Most Recent
                    </h6>
                </q-btn>
            </q-card-main>

        </q-card>


    </div>

</template>

<script>
import { pvolveColors } from './pvolveColors'
import { pvolveLibrarySortTools } from './pvolveLibrarySortTools'
import { designTools } from '../../../mixins/designTools'

export default {
    props: ['productScope', 'tagScope', 'tagHeadingsObj4Scope'],

    mixins: [pvolveColors, pvolveLibrarySortTools, designTools],

    data() {
        return {
            showSidebarMobile: false,

            anyTagsSelected4Heading(key) {
                var selectedTags = false
                var tags4heading = this.tagHeadingsObj4Scope[key].tags
                // k('key: ', key, tags4heading)

                Object.keys(tags4heading).forEach(tagKey => {
                    var tag = tags4heading[tagKey]
                    if (tag.selected) selectedTags = true
                })
                return selectedTags
            },

            numberOfProductsForTagName(tagName) {
                var tagObj = this.currentTagObjCount
                // k('tagObj: ', tagObj)
                return tagObj.productCountPerTag[tagName]
            },

            multipleSelectOptionsFromTagHeading(headingName) {
                return Object.keys(this.tagHeadingsObj4Scope[headingName].tags).map(tagKey => {
                    let tag = this.tagHeadingsObj4Scope[headingName].tags[tagKey]
                    return {
                        label: tag.tagName,
                        value: tag.id,
                    }
                })
            },

            selectedTypeOptions: [],
            selectedBodyFocusOptions: [],
            selectedEquipmentOptions: [],
        }
    },

    computed: {
        typeOptions() {
            var durationOptions = this.multipleSelectOptionsFromTagHeading('duration')
            k('durationOptions: ', durationOptions)

            let typesToInlcude = [5494, 5769]
            var typeOptions = Object.keys(this.tagHeadingsObj4Scope['type'].tags)
                .filter(tagKey => {
                    let tag = this.tagHeadingsObj4Scope['type'].tags[tagKey]
                    return typesToInlcude.includes(tag.id) ? true : false
                })
                .map(tagKey => {
                    let tag = this.tagHeadingsObj4Scope['type'].tags[tagKey]
                    return {
                        label: tag.tagName,
                        value: tag.id,
                    }
                })
            k('typeOptions: ', typeOptions)

            return durationOptions.concat(typeOptions)
            // return []
        },

        textStyle() {
            // var size = this.adaptiveFontSize(.7) + 'rem'
            var size = '.8rem'
            // k('text size: ', size)
            return 'font-size: ' + size + '; margin: .5rem;'
        },

        windowWidth() {
            return this.$store.state.windowWidth
        },

        userSelectedTags() {
            return this.$store.state.userSelectedTags
        },

        environmentTags() {
            return this.$store.state.environmentTags
        },

        currentTagObjCount() {
            var tagObj = {}
            var tagHeadingObj = {}
            var usedProducts = []
            var products = this.productScope
            var allTags = this.tagScope
            // k('currentTagObjCount products: ', products, allTags)

            products.forEach(product => {
                // k('product: ', product.productID)

                var tags = product.tags
                if (tags && tags.includes(',')) tags = tags.split(',')

                if (tags)
                    tags.forEach(tagID => {
                        var tag = allTags[tagID]

                        if (tag) {
                            if (!tagHeadingObj[tag.tagHeadingName]) {
                                tagHeadingObj[tag.tagHeadingName] = 0
                            }
                            tagHeadingObj[tag.tagHeadingName]++

                            if (!tagObj[tag.tagName]) {
                                tagObj[tag.tagName] = 0
                            }
                            tagObj[tag.tagName]++
                        }
                    })
            })

            // k('currentTagObjCount: ', tagObj)
            return {
                productCountPerTag: tagObj,
                productCountPerHeading: tagHeadingObj,
            }
        },
    },

    methods: {
        multipleSelectTag(event) {
            k('multipleSelectTag: ', event)

            k('selectedTypeOptions: ', this.selectedTypeOptions)
            k('selectedBodyFocusOptions: ', this.selectedBodyFocusOptions)
            k('selectedEquipmentOptions: ', this.selectedEquipmentOptions)

            var allSelectedTags = this.selectedTypeOptions.concat(this.selectedBodyFocusOptions).concat(this.selectedEquipmentOptions)
            allSelectedTags = allSelectedTags.join(',')

            k('allSelectedTags: ', allSelectedTags)
            this.$store.commit('setUserSelectedTags', allSelectedTags)
        },

        preselectTags() {
            // select these tags
            this.userSelectedTags.forEach(tagID => {
                let tag = this.environmentTags[tagID]
                k('tag: ', tag)

                switch (tag.tagHeadingName) {
                    case 'body focus':
                        this.selectedBodyFocusOptions.push(Number(tagID))
                        break

                    case 'equipment':
                        this.selectedEquipmentOptions.push(Number(tagID))
                        break

                    case 'type':
                    case 'duration':
                        this.selectedTypeOptions.push(Number(tagID))
                        break

                    default:
                        // code
                        k('tag selected that does not match: ', Number(tagID), tag)
                }
            })
        },

        clearFilters() {
            this.$store.commit('setUserSelectedTags', '')
            this.selectedTypeOptions = []
            this.selectedBodyFocusOptions = []
            this.selectedEquipmentOptions = []
        },
    },

    created() {
        if (this.userSelectedTags) {
            this.preselectTags()
        }
    },
}
</script>

<style scoped>
.q-collapsible-sub-item {
    padding: 0;
}

.pvolveFilterButton {
    border: 2px solid #efefef;
    margin: 5px;
    /*padding: 5px;*/
    cursor: pointer;
    height: calc(100% - 0.5rem);
}

/*.q-if-label {*/
/*    font-family: 'Montserrat', 'Helvetiva-Neue', 'Helvetica', 'Arial', sans-serif;*/
/*    text-transform: uppercase;*/
/*}*/
</style>
