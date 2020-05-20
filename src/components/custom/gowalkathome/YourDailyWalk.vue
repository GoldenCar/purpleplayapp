<template>
    <div class="calendar">

        <div class="row">
            <div class="col-6" align="right" style="padding: .5rem;">
                <q-btn class="full-width" style="background: #80c830; color: white;" @click="showDayView()">
                    <q-icon name="fas fa-calendar" style="font-size: 1rem; margin-right: .5rem;" />
                    <h6>
                        Day <span class="gt-sm">view</span>
                    </h6>
                </q-btn>
            </div>
            <div class="col-6" style="padding: .5rem;">
                <q-btn class="full-width" style="background: #80c830; color: white;" @click="showMonthView()">
                    <q-icon name="fas fa-calendar-alt" style="font-size: 1rem; margin-right: .5rem;" />
                    <h6>
                        Month <span class="gt-sm">view</span>
                    </h6>
                </q-btn>
            </div>
        </div>

        <div v-if="showCalendar" align="center" style="padding: 1rem;">
            <h5>{{ moment().format('MMMM YYYY') }}</h5>
        </div>

        <div v-if="showCalendar" class="row no-wrap justify-between" style="width: 100%;">
            <span v-for="day in moment.weekdaysShort()" class="col lt-sm" align="center">{{ day }}</span>
            <span v-for="day in moment.weekdays()" class="col gt-xs" align="center">{{ day }}</span>
        </div>

        <div v-if="showCalendar" v-for="(week, weekIndex) in calendarVideos" :key="weekIndex" class="row no-wrap">
            <div v-for="(day, dayIndex) in week" :key="dayIndex" @click="showCalendarDay(day)" class="col dayBox cursor-pointer relative-position">
                <div v-if="day.productName">
                    <span v-if="day.dateTimeSeconds && (todayDate === moment(day.dateTimeSeconds).utc().format('MM DD YYYY'))" class="float-left" style="padding: 0 .5rem; background: #DA3D72; color: #fff;">
                        <h6 v-if="windowWidth > 767" style="font-size: .6rem; margin: .5rem 0; max-width: 100%;">
                            TODAY
                        </h6>
                        <q-icon v-else name="fas fa-calendar" style="font-size: 1rem; margin: .5rem 0;" />
                    </span>
                    <span v-else class="float-left" style="padding: .5rem;">
                        <h6>{{ moment(day.dateTimeSeconds).utc().format('D') }}</h6>
                    </span>
                    <span class="gt-sm float-right" style="font-size: .7rem; padding: .5rem;">
                        {{ day.duration ? secondsToHms(day.duration) : '' }}
                    </span>
                    <img
                        :src="'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + day.productSKU + '/' + day.productSKU + '_ws.jpg'"
                        style="width: 100%;"
                    />
                </div>
                <div v-if="!day.productName && day.content">
                    <div class="float-left" style="padding: 8px;">
                        <h6>{{ moment(day.dateTimeSeconds).format('D') }}</h6>
                    </div>
                    <div :style="`${windowWidth > 767 ? 'padding: .5rem 0;' : ''}clear: both;`">
                        <q-icon name="fas fa-comment" style="color: #80c830; font-size: 1rem;" />
                        <p v-if="windowWidth > 767" :style="'margin: 0; line-height: 1rem; font-size: ' + (windowWidth < 992 ? '.6rem;' : '.8rem;')">Tap for a message!</p>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showDay" class="row relative-position" style="height: 100%;">

            <div class="col-12" align="center" style="padding: 1rem;">
                <q-btn v-if="dayViewIndex != todayIndex" style="background: #DC3872; color: white;" @click="dayViewIndex = todayIndex">
                    <h6>Go to today</h6>
                </q-btn>
            </div>

            <div class="col-2 relative-position" @click="changeDate(-1)">
                <div v-if="monthData[dayViewIndex - 1]">
                    <q-icon name="fas fa-chevron-left" :style="'color: #61980F; cursor: pointer; font-size: ' + (windowWidth > 767 ? '4rem' : '2rem') + '; position: absolute; left: 0; top: 50%; transform: translateY(-50%);'" />
                </div>
            </div>

            <div class="col-8">
                <q-card class="bg-white cursor-pointer" align="center" style="margin: 0 0 2rem 0;">
                    <q-card-title style="background: #80c830; position: relative; color: #fff;">
                        <h4 :style="'margin: 0;' + (windowWidth > 767 ? '' : ' font-size: 1.5rem;')">{{moment(monthData[dayViewIndex].dateTimeSeconds).format('dddd, MMMM DD, YYYY')}}

                            <span v-if="todayDate === moment(monthData[dayViewIndex].dateTimeSeconds).format('MM DD YYYY')" style="padding: .5rem; background: #DA3D72; color: #fff; font-size: .75rem; vertical-align: middle;">
                                TODAY
                            </span>
                        </h4>
                    </q-card-title>

                    <q-card-main>
                        <h5 v-if="monthData[dayViewIndex].contentType === 'text'">
                            It's {{moment(monthData[dayViewIndex].dateTimeSeconds).format('dddd')}}!
                        </h5>

                        <p v-if="monthData[dayViewIndex].contentType === 'text'" v-html="monthData[dayViewIndex].content" />

                        <div v-if="monthData[dayViewIndex].contentType !== 'text'" class="row" style="padding: 1rem 0;" @click="checkTypeLaunchProduct(monthData[dayViewIndex])">

                            <div class="col-md-6" align="center">
                                <img :src="'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + monthData[dayViewIndex].productSKU + '/' + monthData[dayViewIndex].productSKU + '_ws.jpg'" style="width: 100%;" />
                            </div>

                            <div class="col-md-6" style="padding: 0 1rem;">
                                <h5 style="margin: 0;">
                                    {{monthData[dayViewIndex].productName}}

                                </h5>

                                <div class="bg-grey-3" style="margin: .8rem; padding: 2px;">{{(monthData[dayViewIndex].duration / 60).toFixed(0)}}m</div>

                                <div style="line-height: 1.4rem; font-size: 1rem;">
                                    <div style="font-weight: 100;" v-html="monthData[dayViewIndex].productBlurb"></div>
                                </div>
                            </div>
                        </div>

                        <h2 v-if="monthData[dayViewIndex].contentType !== 'text'" style="margin: 0; font-size: 1.5rem;">It's {{moment(monthData[dayViewIndex].dateTimeSeconds).format('dddd')}}! Let's get healthy! <q-icon name="play_circle_filled" style="color: #61980F" /></h2>

                        <div class="row" v-if="monthData[dayViewIndex].productName" style="margin-top: 1rem;">
                            <div class="col-12" v-if="productIsDownloading && currentProductFileDownloadingProgress" style="padding: .5rem 0;">
                                <q-progress
                                    color="green"
                                    height="10px"
                                    :percentage="Number(currentProductFileDownloadingProgress)"
                                />
                            </div>

                            <div class="col-12 relative-position">
                                <q-inner-loading :visible="downloadLoader" />

                                <q-btn v-if="!productIsDownloading && !productIsDownloaded && !productIsQueued" class="full-width" outline color="grey-7" @click.stop="downloadItem(monthData[dayViewIndex])" style="padding: 0 .5rem;">
                                    <q-icon name="fas fa-download" />
                                    Download
                                </q-btn>

                                <q-btn v-if="productIsDownloading" outline class="full-width" @click.stop="cancelProductDownload()" style="padding: 0 .5rem;">
                                    <span v-if="currentProductFileDownloadingIndex && productFileDownloads" style="font-size: 0.59rem;">File: {{currentProductFileDownloadingIndex + 1}}/{{productFileDownloads.length}}</span>
                                    <q-icon color="red" name="fas fa-ban" />
                                    Cancel
                                </q-btn>

                                <q-btn v-if="productIsDownloaded" class="full-width" outline @click.stop="deleteLocalProduct(componentData.productSKU)" style="padding: 0 .5rem;">
                                    <q-icon color="red" name="fas fa-times" />
                                    Delete download
                                </q-btn>

                            </div>
                        </div>
                    </q-card-main>
                </q-card>
            </div>

            <div class="col-2 relative-position" @click="changeDate(1)">
                <div v-if="dayViewIndex !== monthData.length - 1">
                    <q-icon name="fas fa-chevron-right" :style="'color: #61980F; cursor: pointer; font-size: ' + (windowWidth > 767 ? '4rem' : '2rem') + '; position: absolute; right: 0; top: 50%; transform: translateY(-50%);'" />
                </div>
            </div>

        </div>

        <q-modal
            v-model="openRestDayModal"
            :content-css="{minWidth: '80vw', minHeight: '80vh'}"
        >
            <q-modal-layout id="ydwRestDayModal">

                <q-toolbar class="q-layout-header" align="center" :style="'background: ' + brand.brandColor + ' !important;'">
                    <q-toolbar-title>
                        <h5>
                            <q-icon name="fas fa-calendar" style="font-size: 1.2rem;" /> Rest Day
                        </h5>
                    </q-toolbar-title>

                    <q-btn id="closePreviewModal" flat icon="fas fa-times" @click="openRestDayModal = false" style="padding: .5rem;" />
                </q-toolbar>

                <div style="padding: 1rem;" align="center">
                    <p v-html="restDayProductInfo.content"></p>
                </div>

            </q-modal-layout>
        </q-modal>

    </div>
</template>

<script>
import moment from 'moment'
import { productCardTools } from '../../../mixins/productCardTools'
import { productCardDownloadTools } from '../../../mixins/productCardDownloadTools'

export default {
    mixins: [productCardTools, productCardDownloadTools],

    data() {
        return {
            calendarVideos: [],
            monthData: '',
            restDayProductInfo: '',
            openRestDayModal: false,

            moment: moment,
            secondsToHms(t) {
                let y = this.j_.secondsToHms(t).split(':')
                return (y[0] != 0 ? y[0] + 'h' : '') + y[1] + 'm'
            },
            showCalendar: false,
            showDay: false,
            todayCalendarIndex: 0,
            dayViewIndex: 0,
            todayIndex: 0,
            todayDate: '',
            // scheduledContent: []
        }
    },

    mounted() {
        this.todayDate = this.moment().format('MM DD YYYY')
        k('todayDate: ', this.todayDate)

        this.getThisMonthsVideos()
    },

    computed: {
        windowWidth() {
            return this.$root.$store.state.windowWidth
        },
        componentData() {
            return {
                ...this.monthData[this.dayViewIndex],
                downloadAllowed: true
            }
        }
    },

    watch: {
        dayViewIndex() {
            k('dayViewIndex: ', this.dayViewIndex)
        },

        todayIndex() {
            k('todayIndex: ', this.todayIndex)
        },

        calendarVideos() {
            this.initYDWView()
        },

        monthData() {
            this.initYDWView()
        },
    },

    methods: {
        initYDWView() {
            var viewStart = this.localStorage.get('YDWView')
            k('viewStart: ', viewStart)

            if (this.calendarVideos && this.calendarVideos.length && this.monthData && this.monthData.length) {
                if (viewStart) {
                    if (viewStart === 'month') {
                        this.showMonthView()
                    }
                    if (viewStart === 'day') {
                        this.showDayView()
                    }
                } else {
                    if (this.windowWidth > 767) {
                        this.showCalendar = true
                    } else {
                        this.showDay = true
                    }
                }
            }
        },

        getThisMonthsVideos() {
            let apiRoute =
                this.api.apiv4Route +
                'api/scheduledContent/query?projectName=dailyWalkApp&startMSeconds=' +
                this.moment()
                    .startOf('month')
                    .valueOf() +
                '&endMSeconds=' +
                this.moment()
                    .endOf('month')
                    .valueOf()

            this.api.get(apiRoute, res => {
                kw('res from getThisMonthsVideos')
                k(res)

                // this.scheduledContent = res.scheduledContent

                // this.structureCalendar()

                this.structureDay(res.scheduledContent)
                this.structureWeeks(res.scheduledContent)
            })
        },

        // structureCalendar() {

        //     let firstOfThisMonth = this.moment(this.moment().startOf('month')).utc().format('d')

        //     // get the day of the week
        //     k(firstOfThisMonth)

        //     for (let x = 0; x < firstOfThisMonth; x++) {
        //         this.scheduledContent.unshift({})
        //     }
        // },

        structureDay(scheduledContent) {
            k('scheduledContent: ', scheduledContent)
            this.monthData = JSON.parse(JSON.stringify(scheduledContent))

            for (var i = 0; i < this.monthData.length; i++) {
                var day = this.monthData[i]
                var dayDateFormatted = this.moment(day.dateTimeSeconds)
                    .utc()
                    .format('MM DD YYYY')
                // k('todayDate: ', this.todayDate)
                // k('day: ', day.dateTimeSeconds)
                if (this.todayDate === dayDateFormatted) {
                    this.dayViewIndex = i
                    this.todayIndex = i
                }
            }
        },

        structureWeeks(thisMonthsVideos) {
            k('thisMonthsVideos: ', thisMonthsVideos)
            thisMonthsVideos = JSON.parse(JSON.stringify(thisMonthsVideos))

            // adds blanks at beginning
            let firstOfThisMonth = this.moment(this.moment().startOf('month')).format('d')
            for (let x = 0; x < firstOfThisMonth; x++) {
                thisMonthsVideos.unshift({})
            }

            // adds blanks at end
            let lastOfThisMonth = this.moment(this.moment().endOf('month')).format('d')
            for (let x = 0; x < 7 - lastOfThisMonth; x++) {
                thisMonthsVideos.push({})
            }

            let x = 0
            let week = 0
            while (x < this.moment().daysInMonth() + firstOfThisMonth) {
                this.calendarVideos[week] = thisMonthsVideos.slice(x, x + 7)
                x += 7
                week += 1
            }

            k('calendarVideos: ', this.calendarVideos)
        },

        changeDate(delta) {
            if (delta > 0 && this.dayViewIndex === this.monthData.length - 1) return false
            if (delta < 0 && this.dayViewIndex < 1) return false

            // once you are on the last day where there is data, just jump back to today
            this.dayViewIndex = this.dayViewIndex + delta
        },

        launchRestDay(product) {
            k('launchRestDay: ', product)
            if (!product.date && !product.dateTimeSeconds) return false

            this.restDayProductInfo = product
            this.openRestDayModal = true
        },

        showCalendarDay(day) {
            if (day.contentType) {
                this.showCalendar = false;
                this.showDay = true
                this.dayViewIndex = moment(day.dateTimeSeconds).utc().format('D') - 1
            }
        },

        checkTypeLaunchProduct(product) {
            k('checkTypeLaunchProduct: ', product)

            if (product.contentType && product.contentType === 'text') {
                this.launchRestDay(product)
            } else {
                this.launchProduct(product)
            }
        },

        showDayView() {
            k('showDayView')

            this.showCalendar = false
            this.showDay = true
            this.localStorage.set('YDWView', 'day')
        },

        showMonthView() {
            k('showMonthView')

            this.showCalendar = true
            this.showDay = false
            this.localStorage.set('YDWView', 'month')
        },
    },
}
</script>

<style scoped>
h6 {
    margin: 0;
}
.calendar {
    background: #efefef;
    min-height: calc(100vh - 70px);
}
.dayBox {
    background: #fff;
    border: 1px solid #ddd;
    margin: 0.25rem;
    text-align: center;
}
</style>
