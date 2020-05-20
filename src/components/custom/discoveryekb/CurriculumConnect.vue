<template>

    <div class="curriculum-connect">
        <div v-if="selectedGrade === null">
            <div class="main">
                <div class="cc_wrap">
                    <div class="cc_intro">
                        <div class="cc_intro_title">
                            {{ $t('curriculumConnect.title') }}
                        </div>
                        <div class="cc_intro_main">
                            {{ $t('curriculumConnect.main') }}
                        </div>
                    </div>
                </div>
                <div class="row gutter-md cc_actions">
                    <div
                        class="col-lg-4 col-md-12"
                        v-for="(grade, index) in grades"
                        :key="index"
                        @click="selectGrade(grade)" :style="{ 'backgroundColor': grade.color }"
                    >
                        {{ $t(grade.name) }}
                    </div>
                </div>
            </div>
        </div>

        <div v-else>
            <q-toolbar class="subNav" style="padding-bottom: 0px;">
                <q-btn
                    flat
                    v-for="(grade, index) in grades"
                    :key="index"
                    class="subNavItem"
                    :class="{ 'active': selectedGrade.name === grade.name }"
                    @click="selectGrade(grade)"
                >
                    {{ $t(grade.name) }}
                </q-btn>
            </q-toolbar>

            <div class="cc_wrap" :style="{ 'backgroundColor': selectedGrade.color }">
                <div class="cc_intro">
                    <div class="cc_intro_title">
                        <div>{{ $t('curriculumConnect.title') }}</div>
                        <div>{{ $t(selectedGrade.name) }}</div>
                    </div>
                    <div class="cc_intro_main">
                        {{ $t('curriculumConnect.main') }}
                    </div>
                </div>
            </div>

            <div class="cc_control_wrap">
                <div class="cc_controls">
                    <div :class="{ 'step_done': subjects.length }" class="step">
                        <q-select
                            class="text-black"
                            :disabled="!subjects.length"
                            :options="subjects"
                            :placeholder="$t('select_subject')"
                            v-model="selectedSubject"
                            @input="selectSubject"
                            color="white"
                            style="width: 100%;    min-height: 38px;
    border-radius: 2px;
    padding: 8px;
    -webkit-box-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 1px 1px rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12);
    box-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 1px 1px rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12); background: white;"

                        />
                    </div>

                    <div :class="{ 'step_done': years.length }" class="step">
                        <q-select
                            class="text-black"
                            :disabled="!years.length"
                            :options="years"
                            :placeholder="$t('select_year')"
                            v-model="selectedYear"
                            @input="selectYear"
                            color="white"
                            style="width: 100%;    min-height: 38px;
    border-radius: 2px;
    padding: 8px;
    -webkit-box-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 1px 1px rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12);
    box-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 1px 1px rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12); background: white;"

                        />
                    </div>

                    <div :class="{ 'step_done': terms.length }" class="step">
                        <q-select
                            class="text-black"
                            :disabled="!terms.length"
                            :options="terms"
                            :placeholder="$t('select_term')"
                            v-model="selectedTerm"
                            @input="selectTerm"
                            color="white"
                            style="width: 100%;    min-height: 38px;
    border-radius: 2px;
    padding: 8px;
    -webkit-box-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 1px 1px rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12);
    box-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 1px 1px rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12); background: white;"

                        />
                    </div>

                    <q-inner-loading :visible="menuOptionsLoading" />
                </div>
            </div>

            <div style="max-width: 1024px; margin-left: auto; margin-right: auto; padding-left: 15px; padding-right: 15px;" v-if="products.length">
                <div class="text-white text-center q-my-md">{{unitId}}: {{unitName}}</div>
                <div v-for="(lesson, lessonIndex) in Object.keys(productsByLesson)" :key="lessonIndex" >
                    <p style="color: white; text-align: center;">{{productsByLesson[lesson].lessonId}}: {{ productsByLesson[lesson].lessonName }}</p>
                    <div class="row" style="color: white;">
                        <div
                            v-for="(product, index) in productsByLesson[lesson].products"
                            :key="index"
                            class="col-xs-6 col-sm-4 col-md-3 col-lg-2"
                            style="color: white; padding: .5rem;"
                        >
                            <product-card :componentData="product" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div style="text-align: center;" v-if="selectedGrade && !loading">
            <p style="color: white;" v-if="!products.length && this.selectedTerm === null">{{ $t('select_syt') }}</p>
            <p style="color: white;" v-if="!products.length && this.selectedTerm !== null">{{ $t('no_results') }}</p>
        </div>

        <div v-if="!products.length && loading" class="loader-container">
            <q-inner-loading color="white" visible />
        </div>

    </div>

</template>

<script>
import ProductCard from 'components/custom/discoveryekb/ProductCard'
import { EKBTools } from './EKBTools'

export default {

    components: {
        ProductCard,
    },

    mixins: [EKBTools],

    data() {
        return {
            grades: [
                {
                    name: 'primary',
                    color: '#7783bc'
                },
                {
                    name: 'preparatory',
                    color: '#46bcb6'
                },
                {
                    name: 'secondary',
                    color: '#568abc'
                }
            ],
            menuOptionsLoading: false,
            loading: false,
            selectedGrade: null,
            selectedSubject: null,
            selectedYear: null,
            selectedTerm: null,
            subjects: [],
            years: [],
            terms: [],
            products: [],
            unitId: null,
            unitName: null,
        }
    },
    computed: {
        productsByLesson() {
            let productsByLesson = {}

            this.products.forEach(product => {
                this.unitId = product.unit.id;
                this.unitName = product.unit.name;

                if (!productsByLesson[product.lesson.id]) {
                    productsByLesson[product.lesson.id] = { lessonId: product.lesson.id, lessonName: product.lesson.name, products: [] }
                }
                productsByLesson[product.lesson.id].products.push(product)
            })

            return productsByLesson
        },

        localeLong() {
            return this.$locale === 'en' ? 'eng' : 'ara';
        }
    },

    watch: {
        $locale() {
            k('locale changed! ', this.$locale)
            this.resetSubject();
            this.resetYear();
            this.resetTerm();
            this.resetProducts();
            this.loadSubjectsForSection();
        }
    },

    methods: {
        selectGrade(newGrade) {
            this.selectedGrade = newGrade;
            this.resetSubject();
            this.resetYear();
            this.resetTerm();
            this.resetProducts();
            this.loadSubjectsForSection();
        },

        selectSubject(newSubject) {
            this.selectedSubject = newSubject;
            this.resetYear();
            this.resetTerm();
            this.resetProducts();
            this.loadYearsForSubject();
        },

        selectYear(newYear) {
            this.selectedYear = newYear;
            this.resetTerm();
            this.resetProducts();
            this.loadTermsForYear();
        },

        selectTerm(newTerm) {
            this.selectedTerm = newTerm;
            this.resetProducts();
            this.loadProducts();
        },

        resetSubject() {
            this.selectedSubject = null;
            this.subjects = [];
        },

        resetYear() {
            this.selectedYear = null;
            this.years = [];
        },

        resetTerm() {
            this.selectedTerm = null;
            this.terms = [];
        },

        resetProducts() {
            this.products = [];
        },

        loadSubjectsForSection() {
            this.menuOptionsLoading = true
            this.api.get(`${this.api.apiv3Route}discovery/curriculumConnect/menu?grade=${this.selectedGrade.name}&language=${this.localeLong}`, (res) => {
                if(res.success) {
                    this.menuOptionsLoading = false
                    this.subjects = res.nextMenuOptions.map(option => ({
                        label: option.name,
                        value: option.key,
                    }))
                }
            })
        },
        loadYearsForSubject(year) {
            this.menuOptionsLoading = true
            this.api.get(`${this.api.apiv3Route}discovery/curriculumConnect/menu?grade=${this.selectedGrade.name}&subject=${this.selectedSubject}&year=&language=${this.localeLong}`, (res) => {
                if(res.success) {
                    this.years = res.nextMenuOptions.map(option => ({
                        label: option.name,
                        value: option.key,
                    }))
                    this.menuOptionsLoading = false
                }
            })
        },
        loadTermsForYear() {
            this.menuOptionsLoading = true
            this.api.get(`${this.api.apiv3Route}discovery/curriculumConnect/menu?grade=${this.selectedGrade.name}&subject=${this.selectedSubject}&year=${this.selectedYear}&language=${this.localeLong}`, (res) => {
                k('terms res: ', res)
                if (res.success) {
                    this.terms = res.nextMenuOptions.map(option => ({
                        label: option.name,
                        value: option.key,
                    }))
                    this.menuOptionsLoading = false
                }
            })
        },
        loadProducts() {
            this.loading = true
            this.api.get(`${this.api.apiv3Route}discovery/curriculumConnect/content?grade=${this.selectedGrade.name}&subject=${this.selectedSubject}&year=${this.selectedYear}&term=${this.selectedTerm}&language=${this.localeLong}`, (res) => {
                this.loading = false
                if (res.success) {
                    this.products = res.results.map(asset => this.conformEKBAsset(asset));
                }
            })
        }
    },
}
</script>

<style lang="css" scoped>
.main {
    display: flex;
    justify-content: center;
    align-content: flex-start;
    width: 100%;
    height: 100%;
    flex-direction: column;
}

.separator {
    width: 100%;
    text-align: center;
    margin-top: 15px;
    margin-bottom: 5px;
}
.cc_wrap {
    background-color: #05638e;
    flex: 1;
}
.cc_actions {
    max-width: 1024px;
    padding: 45px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
}
.cc_actions > div {
    display: block;
    padding: 30px;
    text-align: center;
    font-size: 24px;
    color: #fff;
    opacity: 0.9;
    border-radius: 5px;
    max-width: 32% !important;
    margin-left: auto;
    margin-right: auto;
}

.cc_actions > div:hover {
    opacity: 1;
    cursor: pointer;
}
.cc_intro {
    max-width: 1024px;
    margin: 0px auto;
    padding: 10px 45px 30px 45px;
}
.cc_intro_title {
    margin: 15px 0;
    font-size: 32px;
    color: #fff;
}
.cc_intro_main {
    font-size: 16px;
    color: #ddd;
}
.cc_control_wrap {
    max-width: 1024px;
    margin: 0px auto;
    padding: 0px 45px;
    width: 100%;
}
.cc_controls {
    position: relative;
    top: -15px;
    margin: 0px auto;
    width: 100%;
    background-color: #999;
    border-radius: 5px;
    color: #ccc;
    display: flex;
}
.cc_results {

}
.step {
    position: relative;
    background: transparent;
    height: 60px;
    flex: 1;
    display: flex;
    align-items: center;
    padding-left: 40px;
    padding-right: 15px;
}
:global(.rtl) .step {
    padding-right: 40px;
    padding-left: 15px;
}
.step select {
    height: 30px;
    flex: 1;
    font-size: 16px;
}
.step option:first {
    color: #999;
}
.step select:disabled {
    opacity: 0.7;
}
.step:first-child {
    border-radius: 5px 0px 0px 5px;
    padding-left: 15px;
}
:global(.rtl) .step:first-child {
    border-radius: 0px 5px 5px 0px;
    padding-left: 0px;
    padding-right: 15px
}
.step.step_done:last-child:after {
    display: none;
}
.step.step_done:last-child {
    border-radius: 0px 5px 5px 0px;
}
:global(.rtl) .step.step_done:last-child {
    border-radius: 5px 0px 0px 5px;
}
.step.step_done {
    background-color: #DDD;
    z-index: 10;
}
.step:after {
    left: 100%;
    top: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(221, 221, 221, 0);
    border-left-color: transparent;
    border-width: 30px;
    margin-top: -30px;
}
:global(.rtl) .step:after {
    left: 0%;
    right: 100%;
    top: 50%;
    border-color: rgba(221, 221, 221, 0);
    border-right-color: transparent;
}
.step.step_done:after {
    z-index: 10;
    border-left-color: #ddd;
}

:global(.rtl) .step.step_done:after {
    border-left-color: transparent;
    border-right-color: #ddd;
}

.scroller {
    overflow-y: auto;
    flex-shrink: 1000;
    justify-content: center;
    padding-bottom: 2em;
    display: flex;
    flex-grow: 1;
}
.cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 30px;
    align-content: flex-start;
    width: 100%;
}
.offline {
    align-items: center;
    color: #fff;
    font-size: 120%;
    text-align: center;
    margin-top: auto;
    margin-bottom: auto;
}

@media screen and (max-width: 768px) {
    .cc_controls {
        display: block;
    }

    .cc_controls .step {
        flex: none;
        width: 100%;
        padding-left: 15px;
        padding-right: 15px;
    }

    .cc_controls .step:first-child {
        border-bottom-left-radius: 0px;
        border-top-right-radius: 5px;
    }

    .cc_controls .step:last-child {
        border-bottom-left-radius: 5px;
        border-top-right-radius: 0px;
    }

    .cc_controls .step:after {
        display: none;
    }

    .cc_actions > div {
        max-width: 100% !important;
        margin-top: 15px;
    }

    :global(.rtl) .step:first-child {
        padding-left: 15px;
    }
}

.subNav {
    background-color: rgba(255,255,255,0.8) !important;
    color: #000;
    min-height: 38px;
}

.subNavItem {
    padding: 10px 10px 8px 10px;
    margin: 0px 10px;
    color: #444;
    border-bottom: 3px solid transparent;
}

.subNavItem:hover {
    cursor: pointer;
    color: #777;
}

.subNavItem:global(.active) {
    color: #1087db;
    border-bottom: 3px solid #1087db;
}
</style>
