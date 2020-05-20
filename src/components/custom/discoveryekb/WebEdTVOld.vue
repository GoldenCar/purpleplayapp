<template>
    <div class="wrap">
        <sub-nav
            :curriculumSections="curriculumSections"
            :selectedCurriculumSection="selectedCurriculumSection"
            @selected="sectionChanged">
            <!-- <v-select
            v-show="windowWidth > 750"
            class="week-select"
            v-model="selectedWeek"
            :options="weekOptions"
            :multiple="false"
            group-label="weekGroup"
            group-values="weeks"
            :group-select="false"
            track-by="value"
            :clear-on-select="false"
            label="label"
            :show-labels="false"
            :allowEmpty="false"
            :searchable="false" /> -->
        </sub-nav>
        <!-- <v-select
        v-show="windowWidth <= 750"
        class="week-select week-select--small-screen"
        v-model="selectedWeek"
        :options="weekOptions"
        :multiple="false"
        group-label="weekGroup"
        group-values="weeks"
        :group-select="false"
        track-by="value"
        :clear-on-select="false"
        label="label"
        :show-labels="false"
        :allowEmpty="false"
        :searchable="false" /> -->
        <div v-if="windowWidth <= 750" :class="selectedSection" style="z-index: 1000;">
          <div class="tabItem small-screen-top-tab active" :class="'tab' + webEdTabIndex" @click="showTabs = !showTabs">
              <q-icon name="menu" style="margin-right: 10px; margin-left: 10px;" /> {{ content[webEdTabIndex].headline }}
          </div>
        </div>
        <div v-if="content" class="layout" :class="selectedSection">
            <div class="tabs" :class="{ 'tabs--small-screen': windowWidth <=750 }" v-if="windowWidth > 750 || windowWidth <= 750 && showTabs">
                <div
                    v-for="(item, index) in content"
                    class="tabItem tab"
                    :class="['tab' + index, { 'active': webEdTabIndex === index }]"
                    @click="tabChanged(index)"
                >
                    {{ item.headline }}
                </div>
            </div>
            <div v-if="windowWidth > 750 || windowWidth <=750 && !showTabs" class="scroller" :class="['tab' + webEdTabIndex, { 'scroller--small-screen': windowWidth <= 750 }]">
                <GUIDGrid
                    v-if="webEdTabGuid && selectedSection"
                    :guid="webEdTabGuid"
                    :smallScreen="windowWidth <= 750 || windowHeight <= 1000"
                />
            </div>
        </div>

        <div class="layout" v-else>
            <div v-if="retry" style="position: relative; width: 100%; min-height: 100%;">
                <div class="offline absolute-center">
                    {{ $t('loading_issue') }}
                    <br />
                    <button class="tryagain" @click="fetchWebEd(selectedWeek.value)">{{ $t('try_again') }}</button>
                </div>
            </div>
            <template v-else>
                <div v-if="noContentAvailable" style="position: relative; width: 100%; min-height: 100%;">
                    <div class="offline absolute-center">
                        {{ $t('no_results') }}
                        <br />
                        <button class="tryagain" @click="resetView">{{ $t('try_again') }}</button>
                    </div>
                </div>
                <div v-else class="loader-container">
                    <!-- <q-spinner color="white" size="60px" class="absolute-center" /> -->
                    <q-inner-loading color="white" visible />
                </div>
            </template>
        </div>

    </div>
</template>

<script>
import GUIDGrid from 'components/custom/discoveryekb/GUIDGrid'
import moment from 'moment'
import vSelect from 'vue-multiselect'

export default {
    components: {
        GUIDGrid,
        vSelect
    },
    data() {
        return {
            curriculumSections: [
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
            selectedCurriculumSection: 0,
            selectedWeek: null,
            webEdTabIndex: 0,
            webEdTabGuid: null,
            noContentAvailable: false,
            retry: false,
            showTabs: false
        }
    },
    computed: {
        localeLong() {
            return this.$locale === 'en' ? 'eng' : 'ara'
        },
        selectedSection() {
            return this.curriculumSections[this.selectedCurriculumSection].name
        },
        content() {
            if (this.$store.state.webEd && this.$store.state.webEd[this.localeLong]) {
                return Object.values(this.$store.state.webEd[this.localeLong])
            } else {
                return null
            }
        },
        weekOptions() {
            return this.groupWeekOptions(this.getWeeksList())
        },
        windowWidth() {
            return this.$store.state.windowWidth
        },
        windowHeight() {
            return this.$store.state.windowHeight
        }
    },
    watch: {
        selectedWeek(newVal, prevVal) {
            kw('selected week changed')
            if (prevVal !== null) this.fetchWebEd(this.selectedWeek.value)
        },
        $locale() {
            // Reload content for new language
            this.loadContent()

            // Reselect already selected week to translate label to new language
            if (this.weekOptions) {
                let weeks = []
                if (this.selectedWeek.value < 0) {
                    weeks = this.weekOptions[0].weeks
                }
                if (this.selectedWeek.value == 0) {
                    weeks = this.weekOptions[1].weeks
                }
                if (this.selectedWeek.value > 0) {
                    weeks = this.weekOptions[2].weeks
                }
                this.selectedWeek = weeks[weeks.findIndex(week => week.value === this.selectedWeek.value)]
            }
        }
    },
    mounted() {
        this.selectedWeek = this.weekOptions[1].weeks[0] // select current week
        this.fetchWebEd(this.selectedWeek.value)
    },
    methods: {
        getLastSunday() {
            let t = new Date()
            t.setUTCDate(t.getUTCDate() - t.getUTCDay() + 1)
            t.setUTCHours(0, 0, 0, 0)
            return t
        },

        getWeeksList() {
            moment.locale(this.$locale)
            let day_in_ms = 24 * 60 * 60 * 1000
            let week_in_ms = day_in_ms * 7
            let week_start = this.getLastSunday().valueOf() - day_in_ms
            let week_end = week_start + day_in_ms * 6

            let result = [
                { value: '-4', label: moment(week_start - week_in_ms * 4).format("MMMM Do") + ' - ' + moment(week_end - week_in_ms * 4).format("MMMM Do")},
                { value: '-3', label: moment(week_start - week_in_ms * 3).format("MMMM Do") + ' - ' + moment(week_end - week_in_ms * 3).format("MMMM Do")},
                { value: '-2', label: moment(week_start - week_in_ms * 2).format("MMMM Do") + ' - ' + moment(week_end - week_in_ms * 2).format("MMMM Do") },
                { value: '-1', label: moment(week_start - week_in_ms * 1).format("MMMM Do") + ' - ' + moment(week_end - week_in_ms * 1).format("MMMM Do") },
                { value: '0', label: moment(week_start).format("MMMM Do") + ' - ' + moment(week_end).format("MMMM Do") },
                { value: '1', label: moment(week_start + week_in_ms * 1).format("MMMM Do") + ' - ' + moment(week_end + week_in_ms * 1).format("MMMM Do") },
                { value: '2', label: moment(week_start + week_in_ms * 2).format("MMMM Do") + ' - ' + moment(week_end + week_in_ms * 2).format("MMMM Do") },
                { value: '3', label: moment(week_start + week_in_ms * 3).format("MMMM Do") + ' - ' + moment(week_end + week_in_ms * 3).format("MMMM Do") }
            ]

            return result
        },

        groupWeekOptions(options) {
            let groupedOptions = [{
                weekGroup: this.$t('previous_weeks'),
                weeks: []
            }, {
                weekGroup: this.$t('current_week'),
                weeks: []
            }, {
                weekGroup: this.$t('upcoming_weeks'),
                weeks: []
            }]

            options.forEach((option, optionIndex) => {
                if (optionIndex < 4) groupedOptions[0].weeks.push(option)
                if (optionIndex === 4) groupedOptions[1].weeks.push(option)
                if (optionIndex >= 5) groupedOptions[2].weeks.push(option)
            })

            return groupedOptions
        },
        fetchWebEd(weekOffset) {
            this.loadWebEd(weekOffset, (r) => {
                k('fetchWebEd: ', r)
                this.$store.commit('webEd', r.news)
                this.loadContent()
            })
        },
        loadWebEd(weekOffset, cb) {
            let day_in_ms = 24 * 60 * 60 * 1000
            let week_in_ms = day_in_ms * 7
            let start = this.getLastSunday().valueOf() - day_in_ms
            let end = start + day_in_ms * 6
            this.retry = false

            this.api.get(`${this.api.apiv3Route}discovery/webEdTV/${start + (weekOffset * week_in_ms)}/${end + (weekOffset * week_in_ms)}`, (res) => {
                if(res.success) {
                    if (cb) cb(res)
                } else {
                    this.retry = true
                }
            })
        },
        loadContent() {
            let content = this.content

            if(content) {
                let d = new Date()
                let i = d.toISOString().split('T')[0]
                let t = i.split('-')
                let mm = [t[0],t[1]].join('-')
                let dd = [t[0],t[1],t[2]].join('-')
                let selected = null

                content.forEach((a, i)=>{
                    if(a.link === dd || a.link === mm) {
                        selected = i
                    }
                })

                kw('content is', content)
                kw('selected is', selected)
                if (selected) {
                    this.webEdTabIndex = selected
                }

                this.webEdTabGuid = content[this.webEdTabIndex].asset_guids[0]
            } else {
                this.noContentAvailable = true
            }
        },
        sectionChanged(newSectionIndex) {
            this.selectedCurriculumSection = newSectionIndex
            this.webEdTabGuid = this.content[this.webEdTabIndex].asset_guids[this.selectedCurriculumSection]
        },
        tabChanged(newTabIndex) {
            if (this.showTabs) this.showTabs = false

            this.webEdTabIndex = newTabIndex
            this.webEdTabGuid = this.content[this.webEdTabIndex].asset_guids[this.selectedCurriculumSection]
        },
        resetView() {
            this.noContentAvailable = false
            this.fetchWebEd(0)
        }
    }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.q-item-stamp {
    float: left;
    margin-top: -25px;
    margin-left: -175px;
}

.q-list .q-item {
    padding-top: 25px;
    padding-bottom: 25px;
}

.q-list .q-item-link:hover, .q-list .q-select-highlight, .q-list .q-item.active {
    background: transparent !important;
    color: #1087db !important;
}

.scroller {
    flex-shrink: 1000;
    justify-content: center;
    display: flex;
    flex-grow: 1;
    margin: 20px 0px 20px 20px;
    box-shadow: 0px 0px 30px rgba(0,0,0,0.5);
    border-radius: 10px 0px 0px 10px;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    overflow-x: hidden;
}
:global(.rtl) .scroller {
    margin: 20px 20px 20px 0px;
    border-radius: 0px 10px 10px 0px;
}
.main {
    display: flex;
    justify-content: center;
    align-content: flex-start;
    width: 100%;
    height: 100%;
}
.subNav {
    display: flex;
    background-color: rgba(255,255,255,0.8);
    color: #000;
    min-height: 42px;
}
.subNavItem {
    padding: 10px 10px 8px 10px;
    margin: 0px 10px;
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
.wrap {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-x: hidden;
}
.layout {
    flex-direction: row-reverse;
    display: flex;
    flex: 1;
}
.tabs {
    display: flex;
    flex-direction: column;
    padding: 15px 0px 15px 0px;
}
.tabItem {
    flex: 1;
    display: inline-flex;
    align-items: center;
    padding: 15px;
    margin: 5px 15px 0px 0px;
    color: #ddd;
    text-shadow: 0px 1px 2px rgba(0,0,0,0.2);
    font-size: 16px;
    border-radius: 0px 15px 15px 0px;
    -webkit-user-select:none;
    user-select: none;
    width: 220px;
}
:global(.rtl) .tabItem {
    border-radius: 15px 0px 0px 15px;
    margin: 5px 0px 0px 15px;
}
.tabItem:global(.tab0) {
    background-color: #e4424a;
    border-bottom: 5px solid #a73036;
}
.tabItem:global(.tab1) {
    background-color: #09b6ed;
    border-bottom: 5px solid #0a87b3;
}
.tabItem:global(.tab2) {
    background-color: #5161a4;
    border-bottom: 5px solid #404d86;
}
.tabItem:global(.tab3) {
    background-color: #fe7802;
    border-bottom: 5px solid #c16616;
}
.tabItem:global(.tab4) {
    background-color: #00a84a;
    border-bottom: 5px solid #087d3c;
}
.scroller:global(.tab0) {
    border: 25px solid #e4424a;
    background-color: #e4424a;
}
.scroller:global(.tab1) {
    border: 25px solid #09b6ed;
    background-color: #09b6ed;
}
.scroller:global(.tab2) {
    border: 25px solid #5161a4;
    background-color: #5161a4;
}
.scroller:global(.tab3) {
    border: 25px solid #fe7803;
    background-color: #fe7803;
}
.scroller:global(.tab4) {
    border: 25px solid #00a84a;
    background-color: #00a84a;
}
:global(.preparatory) .tabItem, :global(.secondary) .tabItem {
    border: 25px solid #83509d;
    background-color: #83509d;
}
:global(.preparatory) .tabItem:global(.active) {
    border: 25px solid #01ada1;
    background-color: #01ada1;
}
:global(.preparatory) .scroller {
    border: 25px solid #01ada1;
    background-color: #01ada1;
}
:global(.secondary) .tabItem:global(.active) {
    border: 25px solid #2e6aa8;
    background-color: #2e6aa8;
}
:global(.secondary) .scroller {
    border: 25px solid #2e6aa8;
    background-color: #2e6aa8;
}
.tabItem:hover {
    cursor: pointer;
    color: #fff;
}
.tabItem:last-of-type {
    border-bottom: none;
    margin-bottom: 5px;
}
.tabItem:global(.active) {
    z-index: 10;
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
    margin: 15px;
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
.tryagain:hover {
    background-color: rgba(16, 135, 219, 0.40);
    color: #fff;
    cursor: pointer;
}

.week-select {
    align-self: center;
    margin-left: auto;
    margin-right: 15px;
    max-width: 245px;
    font-size: 85%;
    z-index: 1000;
}

.week-select.week-select--small-screen {
    max-width: 100%;
}

.week-select--small-screen .multiselect__tags {
    border-radius: 0px;
}

:global(.rtl) .week-select {
    margin-left: 15px;
    margin-right: auto;
}

.scroller.scroller--small-screen {
    margin: 0px;
    border-radius: 0px;
    border: none;

}

:global(.rtl) .scroller.scroller--small-screen {
    margin: 0px;
    border-radius: 0px;
    border: none;
}

.tabItem.small-screen-top-tab {
    flex: none;
    width: 100%;
    margin-bottom: 0px;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    box-shadow: none;
    text-align: left;
    z-index: 10;
    border-bottom: 0px;
    border: 0px !important;
}

.tabs.tabs--small-screen {
    display: block;
    margin-right: auto;
    margin-left: 0px;
    max-height: 100%;
    overflow-y: scroll;
    width: 100%;
}

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

:global(.rtl) .tabs.tabs--small-screen {
    margin-left: auto;
    margin-right: 0px;
}

.tabs.tabs--small-screen .tabItem {
    display: block;
    margin-right: auto;
    max-width: 320px;
    width: 100%;
}

:global(.rtl) .tabs.tabs--small-screen .tabItem {
    margin-right: 0px;
}
</style>
