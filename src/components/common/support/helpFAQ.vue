<template>

    <div>
        <div v-if="!hideSearch" class="bg-white" style="padding: 1rem; margin: .5rem; border-radius: .1rem;">
            <!--<h6 style="margin: .5rem 0;">Search the FAQ</h6>-->
            <q-search float-label="Search the FAQ" placeholder=" " v-model="faqSearchText" color="grey" @input="searchFAQ" clearable />
        </div>
        
        <div v-for="(topic, key, index) in faqData" :key="key" style="padding: .5rem;">
            <q-list class="bg-white">
                <q-list-header v-if="Object.keys(faqData).length > 1" style="padding: 1rem;">
                    <h6 style="font-size: 1rem; letter-spacing: 1px;">{{key}}</h6>
                </q-list-header>
                <q-collapsible v-if="!faqSearchText || faqSearchTextIncludes(question)" v-for="question in topic" :key="question.question" class="monty" :group="key">
                    <template slot="header">
                        <q-item-side left>
                            <q-btn flat round size="sm" :style="`background: ${buttonColor};`">
                                <q-icon name="fas fa-question" color="white" />
                            </q-btn>
                        </q-item-side>
                        <q-item-main :label="question.question" style="font-size: 1rem;" />
                    </template>
                    <div style="padding: 1rem; color: #545454; font-size: .9rem; line-height: 1.25rem;">
                        <span v-html="question.answer"></span>
                    </div>
                </q-collapsible>
            </q-list>
        </div>
    </div>
</template>

<script>
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['faqData', 'buttonColor', 'hideSearch'],

        components: {

        },

        data() {
            return {
                faqSearchText: '',
                
                faqSearchTextIncludes(questionObj) {
                    return questionObj.question.includes(this.faqSearchText) || questionObj.answer.includes(this.faqSearchText)
                }
            }
        },

        mixins: [globalComputedData],

        computed: {

        },
        
        methods: {
            searchFAQ() {
                k('searchFAQ: ', this.faqSearchText)
            }
        },

        created() {
            k('helpFAQ: ', this.environmentJSON)
        }
    }
</script>

<style>

</style>
