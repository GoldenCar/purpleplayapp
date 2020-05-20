<template>

    <div class="wrap" :style="{ backgroundColor: backgroundColor }" style="height: 100vh;">
        <div v-if="selectedDate !== null" style="padding-bottom: 45px;">
            <q-toolbar class="subNav" style="padding-bottom: 0px;">
                <q-btn
                    flat
                    v-for="(grade, index) in grades"
                    v-model="selectedGrade"
                    class="subNavItem"
                    :key="grade.name"
                    :class="{ 'active': selectedGrade === index }"
                    @click="selectGrade(index)"
                >
                    {{ $t(grade.name) }}
                </q-btn>
            </q-toolbar>

            <div style="padding: 15px;">
                <div class="row gutter-sm">
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <q-btn
                            color="white"
                            text-color="black"
                            :label="$t('download_all')"
                            style="width: 100%; padding: .6rem;"
                            @click="downloadAllProducts"
                        />
                    </div>
                </div>
            </div>

            <GUIDGrid v-if="selectedDate !== null" :guid="selectedDateGUID" :style="{ backgroundColor: backgroundColor }"/>
        </div>

        <div class="layout" v-else>
            <div v-if="retry" style="position: relative; width: 100%; min-height: 100%;">
                <div class="offline absolute-center">
                    {{ $t('loading_issue') }}
                    <br />
                    <button class="tryagain" @click="loadDates()">{{ $t('try_again') }}</button>
                </div>
            </div>
            <template v-else>
                <div v-if="noContentAvailable" style="position: relative; width: 100%; min-height: 100%;">
                    <div class="offline absolute-center">
                        {{ $t('no_results') }}
                        <br />
                        <button class="tryagain" @click="loadDates()">{{ $t('try_again') }}</button>
                    </div>
                </div>
                <div v-else class="loader-container">
                    <!-- <q-spinner color="white" size="60px" class="absolute-center" /> -->
                    <q-inner-loading color="white" visible />
                </div>
            </template>
        </div>

        <q-layout-footer v-if="Boolean(dates)">
            <q-tabs v-model="selectedDate" @select="dateTabChange" color="transparent" align="justify">
                <q-tab v-for="(date, index) in dates" :style="{ backgroundColor: getMonthBackgroundColor(index) }" :key="index" slot="title" :name="date.value" :label="getTabText(date.label)" />
            </q-tabs>
        </q-layout-footer>
    </div>

</template>

<script>
import GUIDGrid from 'components/custom/discoveryekb/GUIDGrid'
import moment from 'moment'
import vSelect from 'vue-multiselect'
import { throws } from 'assert';

export default {
    components: {
        GUIDGrid,
        vSelect
    },
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
            backgroundColors: [
                '#e4424a',
                '#0cb7eb',
                '#5461a5',
                '#ff7c00',
                '#087d3c',
            ],
            noContentAvailable: false,
            retry: false,
            selectedGrade: 0,
            selectedDate: null,
            webEdDates: null
        }
    },
    computed: {
        localeLong() {
            return this.$locale === 'en' ? 'eng' : 'ara'
        },
        webEdDatesValues() {
            return this.webEdDates ? Object.values(this.webEdDates[this.localeLong]) : null;
        },
        selectedDateGUID() {
            return this.webEdDatesValues ? this.webEdDatesValues[this.selectedDate].asset_guids[this.selectedGrade] : null;
        },
        dates() {
            if (!this.webEdDates) {
                return;
            }
            return this.webEdDatesValues.map((tab, index) => ({
                label: tab.headline,
                value: index.toString()
            }));
        },
        backgroundColor() {
            switch (this.selectedGrade) {
                case 0:
                    return this.backgroundColors[this.selectedDate || (this.backgroundColors.length - 1)]
                    break;
                case 1:
                    return '#009688'
                    break;
                case 2:
                    return '#2e6aa6'
            }
        },
    },
    watch: {
        $locale() {
            // Reload content for new language
            this.loadDates()
        }
    },
    created() {
        this.selectedGrade = 0;
        this.loadDates()
    },
    methods: {
        getWeekStart() {
            return moment().zone("+0000").startOf('week');
        },
        getWeekEnd() {
            return moment().zone("+0000").endOf('week');
        },
        loadDates() {
            let start = moment(this.getWeekStart()).valueOf();
            let end = moment(this.getWeekEnd()).valueOf();
            this.noContentAvailable = false;
            this.retry = false;

            this.api.get(`${this.api.apiv3Route}discovery/webEdTV/${start}/${end}`, (res) => {
                if(res.success) {
                    this.webEdDates = res.news;
                    if(!this.webEdDates) {
                        this.noContentAvailable = true;
                    }
                    this.setDefaultDate();
                } else {
                    this.retry = true;
                }
            });
        },
        setDefaultDate() {
            if (this.dates && this.dates.length) {
                let firstDate = moment(this.dates[0])
                let currentDate = moment()
                if (currentDate.isBefore(firstDate)) {
                    this.selectedDate = '0'
                } else {
                    this.selectedDate = (this.dates.length - 1).toString();
                }
            }

            
        },
        selectGrade(newGrade) {
            this.selectedGrade = newGrade;
        },
        downloadAllProducts() {
            let GUIDGridChild = this.$children.find(child => child.$options.name === 'GUIDGrid')

            if (GUIDGridChild) {
                GUIDGridChild.downloadAll()
            }
        },

        getMonthBackgroundColor(monthIndex) {
            switch (this.selectedGrade) {
                case 0:
                    return this.backgroundColors[monthIndex]
                case 1:
                    return monthIndex == this.selectedDate ? '#6c4691' : '#009688';
                case 2:
                    return monthIndex == this.selectedDate ? '#6c4691' : '#2e6aa6';
            }
        },

        dateTabChange(index) {
            this.selectedDate = this.dates.find(date => date.value === index).value;
        },

        getTabText(text) {
            return text.split(':')[0];
        }
    }
}
</script>

<style scoped>
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
.q-tabs >>> .q-tabs-head {
    background-color: transparent !important;
    padding: 0px !important;
}
.q-layout-footer {
	box-shadow: none;
	-webkit-box-shadow: none;
	border-top: 1px solid #ccc;
}
.q-tab {
	border-left: 1px solid #ccc;
}
.q-tab:first-child {
    border-left: none;
}
</style>
