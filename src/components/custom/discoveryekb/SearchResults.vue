<template>
    <div :style="`padding: .5rem; ${windowWidth <= 500 ? 'padding-top: 3rem' : ''}`">
        <div class="row" :class="{ 'reverse': $locale === 'ar' }">
            <div class="col-xl-2 col-lg-3">
                <div v-if="collection && collection.aggregations && !empty" class="filterMenu">
                    <div class="filterTitle">
                        {{ $t('filter_by') }}
                    </div>
                    <div class="filterCat">
                        {{ $t('grades') }}
                    </div>
                    <div
                        v-for="grade in sortedGrades"
                        class="filterItem"
                        :class="{ 'filterItem--selected': searchFilters.includes('grade_band::' + grade.key) }"
                        @click="filterItemClicked('grade_band::' + grade.key)"
                    >
                        {{ $locale === 'en' ? grade.key : filterTranslations[grade.key] }} ({{ grade.count }})
                    </div>
                    <div class="filterCat">
                        {{ $t('resource_type') }}
                    </div>
                    <div
                        v-for="resourceType in collection.aggregations.types"
                        class="filterItem"
                        :class="{ 'filterItem--selected': searchFilters.includes('type_name::' + resourceType.key) }"
                        @click="filterItemClicked('type_name::' + resourceType.key)"
                    >
                        {{ $locale === 'en' ? resourceType.key : filterTranslations[resourceType.key] }} ({{ resourceType.count }})
                    </div>
                </div>
            </div>

            <div class="col-xl-10 col-lg-9" :class="{ 'col-lg-12': empty }">
                <div class="wrap">
                    <div class="scroller">
                        <div class="main">
                            <div v-if="empty && paging.page !== 0">
                                <p class="text-white">{{ $t('no_results_found_for') }} {{ searchTerm }}</p>
                            </div>

                            <template v-else-if="collection && collection.assets">
                                <div class="row full-width">
                                    <div
                                        v-for="item in cards"
                                        class="col-xs-6 col-sm-4 col-md-3 col-lg-2"
                                        style="color: white; padding: .5rem;"
                                    >
                                        <product-card :componentData="item" />
                                    </div>
                                </div>

                                <button
                                    class="loadmore"
                                    @click="loadMore"
                                    v-if="paging.total_pages > 0 && paging.page < paging.total_pages"
                                    :disabled="loading"
                                >
                                    <q-spinner v-if="loading" size="20px" color="white" />
                                    {{ $t('load_more') }}
                                </button>
                            </template>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="empty && paging.page === 0" class="loader-container">
                <!-- <q-spinner color="white" size="60px" class="absolute-center" /> -->
                <q-inner-loading color="white" visible />
            </div>
        </div>
    </div>

</template>

<script>
import ProductCard from 'components/custom/discoveryekb/ProductCard'
import { EKBTools } from 'components/custom/discoveryekb/EKBTools'

export default {
    props: ['searchTerm'],

    components: {
        ProductCard
    },

    mixins: [EKBTools],

    data() {
        return {
            collection: null,
            paging: {
                total_pages: 0,
                page: 0
            },
            gradesFilter: null,
            typesFilter: null,
            loading: false,
            searchFilters: [],
            filterTranslations: {
                "Activity": "نشاط",
                "Animation": "رسوم متحركة",
                "Audio": "صوت",
                "Clip Art": "قصاصة فنية",
                "Core Interactive Text": "نص تفاعلي أساسي",
                "Document": "مستند",
                "eBook": "كتاب إلكتروني",
                "Encyclopedia Article": "مقال موسوعي",
                "Full Video": "فيديو كامل",
                "Fun-damental": "أساسيات",
                "Glossary Term": "مصطلح",
                "Image": "صورة",
                "Images": "صور",
                "Interactive Map": "خريطة تفاعلية",
                "Interactive Video": "فيديو تفاعلي",
                "Interactives": "مواد تفاعلية",
                "Interactive": "متفاعل",
                "Investigation": "استكشاف",
                "Math Interactive": "رياضيات تفاعلية",
                "Math Overview": "نظرة عامة على الرياضيات",
                "Math Explanation": "شرح الرياضيات",
                "Article": "المقال",
                "Content Collection": "مجموعة محتوى",
                "Reading Passage": "فقرة للقراءة",
                "Science Sleuth": "تحري العلوم",
                "Science Tool": "أدوات العلوم",
                "Skill Builder": "باني المهارات",
                "Song": "أغنية",
                "Sound Effect": "مؤثرات صوتية",
                "Text": "نص",
                "Video": "فيديو",
                "Video Segment": "مقطع فيديو",
                "Virtual Lab": "مختبر افتراضي",
                "Preparatory": "الإعدادي",
                "Preparatory resources": "مواد المستوى الإعدادي",
                "Primary": "الابتدائي",
                "Primary resources": "مواد المستوى الابتدائي",
                "Secondary": "الثانوي"
            }
        }
    },
    computed: {
        empty() {
            return !this.collection || this.collection.assets.length === 0
        },
        sortedGrades() {
            // the grades come from API in wrong order
            // this function sets the correct order
            if (!this.collection || !this.collection.aggregations || !this.collection.aggregations.grade_bands) {
                return [];
            }
            const grades = this.collection.aggregations.grade_bands;
            const sortedGrades = [
                grades.find(grade => grade.key === 'Primary'),
                grades.find(grade => grade.key === 'Secondary'),
                grades.find(grade => grade.key === 'Preparatory'),
            ].filter(grade => grade)

            // if there are names that are not in list, find them and push to array
            let difference = grades.filter(grade => !sortedGrades.find(g => g.key === grade.key));
            return [...sortedGrades, ...difference];
        },
        cards() {
            let retval = []
            if(this.collection && this.collection.assets) {
                let assets = this.collection.assets
                for(let i in assets) {
                    if(assets[i].type.id === 'bc3e8afe-7fc6-4999-96c7-b441846014a9') { /* Content Collection */
                        for(let j in assets[i].assets) {
                            retval.push(assets[i].assets[j])
                        }
                    } else {
                        retval.push(assets[i])
                    }
                }
            }
            return retval
        },

        windowWidth() {
            return this.$store.state.windowWidth
        },
    },
    watch: {
        searchTerm() {
            this.searchFilters = [];
            this.doSearch()
        },
        $locale() {
            this.searchFilters = [];
            this.doSearch()
        }
    },
    created() {
        if (this.searchTerm) {
            this.doSearch()
        }
    },
    methods: {

        doSearch() {
            let page = this.paging.page || 1
            let searchTerm = this.searchTerm
            let lang = this.$locale === 'en' ? 'eng' : 'ara'

            this.collection = null
            this.loading = true
            this.paging = {
                total_pages: 0,
                page: 0
            }

            this.searchOnline(searchTerm, page, lang, (res) => {
                if (res.success) {
                    this.paging = res.paging
                    this.collection = res
                    this.loading = false
                }
            })
        },
        searchOnline(search_term, page, lang, cb) {
            let filter_params = this.searchFilters.map(filter => {
                return `&${filter.split('::').join('=')}`
            }).join('')

            this.api.get(`${this.api.apiv3Route}discovery/search/${search_term}?page=${page}${filter_params}&language=${lang}`, (res) => {
                if (cb) cb(this.conformSearchResultsRes(res))
            })
        },
        loadMore() {
            let nextPage = this.paging.page + 1
            this.loading = true
            let old = this.collection.assets || []

            let searchTerm = this.searchTerm
            let lang = this.$locale === 'en' ? 'eng' : 'ara'

            this.searchOnline(searchTerm, nextPage, lang, (res) => {
                res.assets = old.concat(res.assets);

                this.paging = res.paging
                this.collection = res
                this.loading = false
            })
        },
        filterItemClicked(key) {
            if (this.searchFilters.includes(key)) {
                this.searchFilters = this.searchFilters.filter(filter => filter !== key);;
            } else {
                const type = key.split('::')[0];
                this.searchFilters = this.searchFilters.filter(filter => !filter.startsWith(type)).concat(key);
            }
            this.doSearch();
        }
    }
}
</script>
<style scoped>
.scroller {
    overflow-y: auto;
    flex-shrink: 1000;
    justify-content: center;
    padding-bottom: 2em;
    display: flex;
    flex-grow: 1;
    -webkit-overflow-scrolling: touch;
}
.main {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 30px;
    align-content: flex-start;
    width: 100%;
}
.wrap {
    display: flex;
    flex-direction: row;
}
.loadmore {
    width: 100%;
    margin: 15px 45%;
    min-width: 120px;
    padding: 10px;
    color: #ddd;
    font-size: 80%;
    text-transform: uppercase;
    text-align: center;
    background-color: rgba(16, 116, 187, 0.30);
    border: none;
    border-radius: 5px;
}
.loadmore:hover {
    background-color: rgba(16, 135, 219, 0.40);
    color: #fff;
    cursor: pointer;
}
.filterMenu {
    position: relative;
    margin-top: 25px;
    margin-left: auto;
    margin-right: auto;
    background: #fff;
    border-radius: 5px;
    color: #222;
    width: calc(100% - 25px);
}
.filterTitle {
    font-size: 100%;
    font-weight: bold;
    background-color: #6d99c0;
    color: #fff;
    padding: 10px;
    border-radius: 5px 5px 0 0;
}
.filterCat {
    font-size: 100%;
    font-weight: bold;
    padding: 5px 10px;
    margin: 10px 0px;
}
.filterItem {
    color: #666;
    padding: 3px 10px;
}
.filterItem--selected {
    color: blue;
    font-weight: bold;
}
.filterItem span {
    margin: 0px 5px;
    color: #999;
}
.filterItem:hover {
    background-color: #EEE;
    cursor: pointer;
}
.cardw {
    display: inline-block;
    float: left;
    margin-left: 15px;
    margin-top: 15px;
}
</style>
