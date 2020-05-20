<template>

    <div class="bg-grey-2 row relative-position" style="width: 100%;">

        <div class="col-sm-12">
            <div class="bg-white" style="padding: 0; overflow: auto;">
                <table class="q-table bordered striped responsive" style="width: 100%;">
                    <thead>
                        <tr>
                            <th align="left">Date</th>
                            <th align="left">Name</th>
                            <th align="right">Minutes</th>
                        </tr>
                    </thead>
                    <tbody v-if="viewingData && index < 3" v-for="(item, index) in viewingData">
                        <tr v-for="product in item.productsViewed">
                            <td>
                                {{moment(item.date).format('M/DD/YY')}}
                            </td>
                            <td>
                                {{product.productName}}
                            </td>
                            <td align="right">
                                {{(product.secondsViewed / 60).toFixed(1)}} mins
                            </td>
                        </tr>
                        <tr style="background: #999; color: #fff;">
                            <td>
                                <!--{{item.date}}-->
                            </td>
                            <td>
                                <strong>{{moment(item.date).format('M/DD/YY')}} TOTAL</strong>
                            </td>
                            <td align="right">
                                <strong>{{ (productTotal(item.productsViewed) / 60).toFixed(1)}} mins</strong>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>

            <div style="padding: .5rem;" align="center">
                <q-btn outline @click="openModal = true" :style="`background: #fff !important; color: #333;`">
                    <h6 style="font-size: .9rem; letter-spacing: 1px;">Show All</h6>
                </q-btn>
            </div>
        </div>

        <q-modal
            v-model="openModal"
            :content-css="{minWidth: '80vw', minHeight: '80vh'}"
        >
            <q-modal-layout id="fullHistoryModal">

                <q-toolbar class="q-layout-header" :style="`background: ${brand.brandColor} !important; margin-top: 0;`">
                    <q-btn id="closePreviewModal" flat icon="fas fa-chevron-left" @click="openModal = false" />
                    <q-toolbar-title>
                        <h6>Full History</h6>
                    </q-toolbar-title>
                </q-toolbar>

                <table class="q-table bordered striped responsive" style="width: 100%;">
                    <thead>
                        <tr>
                            <th align="left">Date</th>
                            <th align="left">Name</th>
                            <th align="right">Minutes</th>
                        </tr>
                    </thead>
                    <tbody v-if="viewingData && item.productsViewed.length" v-for="(item, index) in viewingData">
                        <tr v-for="product in item.productsViewed">
                            <td>
                                {{moment(item.date).format('M/DD/YY')}}
                            </td>
                            <td>
                                {{product.productName}}
                            </td>
                            <td align="right">
                                {{(product.secondsViewed / 60).toFixed(1)}} mins
                            </td>
                        </tr>
                        <tr style="background: #999; color: #fff;">
                            <td>
                                <!--{{item.date}}-->
                            </td>
                            <td>
                                <strong>{{moment(item.date).format('M/DD/YY')}} TOTAL</strong>
                            </td>
                            <td align="right">
                                <strong>{{ (productTotal(item.productsViewed) / 60).toFixed(1)}} mins</strong>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </q-modal-layout>
        </q-modal>
    </div>

</template>

<script>
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { designTools } from '../../../mixins/designTools'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['componentData'],

        mixins: [userAndProductInfo, designTools, globalComputedData],

        data() {
            return {
                openModal: false,
                showHelp: false,
                displayCalendar: '',
                monthOffset: 1,
                totalCalendarDays: 29,
                viewingData: '',
                viewThresholdInSeconds: 60 * 5,

                productsViewedDisplayLimit: 10,
                productsViewedDisplayCount: 0,

                productTotal(products) {
                    var total = 0
                    products.forEach((product) => {
                        total += product.secondsViewed
                    })
                    return total
                }
            }
        },

        computed: {

            userInfo() {
                return this.$store.state.user.info
            },

            environmentName() {
                return this.$store.state.environment.name
            }

        },

        methods: {
            changeStartDate(offset) {
                // k('changeStartDate: ', offset)
                this.monthOffset += offset

                var daysAgo = (this.totalCalendarDays - 1) * this.monthOffset
                this.startDate = this.moment().subtract(daysAgo, 'days').valueOf()
                this.modifyCalendarBasedOnStartDay()
            },

            modifyCalendarBasedOnStartDay() {
                // k('modifyCalendarBasedOnStartDay: ', this.viewingData)

                this.displayCalendar = []

                for (var i = 0; i < this.totalCalendarDays; i++) {

                    var theDate = this.moment(this.startDate).add( i, 'days')
                    var peach = this.viewingData.filter((day) => {
                        // kw('day: ', theDate.format('MM-DD-YYYY'), this.moment(day.date).format('MM-DD-YYYY'))
                        var totalSeconds = 0
                        if (day.productsViewed.length) day.productsViewed.forEach((product) => {
                            totalSeconds += product.secondsViewed
                        })

                        var viewLengthIsHigherThanThreshold = totalSeconds > this.viewThresholdInSeconds
                        var currentDay = theDate.format('MM-DD-YYYY') === this.moment(day.date).format('MM-DD-YYYY')

                        return currentDay && viewLengthIsHigherThanThreshold
                    })[0]

                    this.displayCalendar[i] = {
                        theMonth: theDate.format('MMM'),
                        theDate: theDate.format('D'),
                        dayNumber: i + 1,
                        peach: peach
                    }

                    if (this.moment(theDate).isSame(Date.now(), 'day')) { // it's today
                        this.displayCalendar[i].today = true
                    }
                }

                // now pad the beginning with an offset
                this.calendarOffset = this.moment(this.startDate).day()

                for (i = 0; i < this.calendarOffset; i++) {
                    this.displayCalendar.unshift({})
                }

                // kw('displayCalendar')
                // k(j(this.displayCalendar))

                this.showPartial = 'showCalendar'
            },

            getUserMediaPlayData() {
                var timezoneOffset = this.moment().format('Z')
                k('timezoneOffset: ', timezoneOffset)

                var req = {
                    filters: {
                        environment: this.environmentName,
                        eventType: 'mediaPlay',
                        userID: this.userInfo.userID
                    },
                    key2agg: 'productID',
                    key2sum: 'elapsed',
                    orderDirection: 'desc',
                    forceProd: false,
                    localTimeZone: this.moment().format('Z')
                    // startMSeconds: 1510531200000,
                    // endMSeconds: 1510617600000
                }

                this.api.post(this.api.ioRoute + 'api/stats/mediaPlay4UserByDate', req, (res) => {
                    // k('viewing data: ', res)
                    if (res) {
                        this.viewingData = res.filter((day) => {
                            return day.productsViewed.length
                        }).sort((a, b) => {
                            // k('viewing data sort: ', this.moment(a.date).valueOf(), this.moment(b.date).valueOf())
                            return this.moment(b.date).valueOf() - this.moment(a.date).valueOf()
                        })

                        k('viewingdata after sort: ', this.viewingData)
                    }
                })
            }

        },

        watch: {
            userInfo() {
                this.getUserMediaPlayData()
            },

            viewingData() {
                this.modifyCalendarBasedOnStartDay()
            }
        },

        mounted() {
            this.startDate = this.moment().subtract(this.totalCalendarDays - 1, 'days').valueOf()
            if (this.userInfo) this.getUserMediaPlayData()
        }
    }
</script>

<style scoped>
    .padded {
      padding: .5rem;
    }

    #calendar {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
    }

    .card {
        position: relative;
        background: #fff;
        height: 100%;
        min-height: 4.5rem;
        border: 1px solid #ddd;
        cursor: pointer;
    }

    .day {
        width: 14.28%;
        display: block;
    }

    .dayDate {
        color: #999;
        background: #fff;
        padding: .3rem;
    }

    .dayHeader {
        background: #999;
        color: #fff;
        padding: .2rem;
    }

    .workouts4day {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .restDay {
        height: 100%;
        text-align: center;
        color: #fff;

    }

    .centerIt {
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    .playButton {
        position: absolute;
        left: 50%;
        bottom: .5rem;
        -webkit-transform: translate(-50%);
        transform: translate(-50%);
    }
</style>
