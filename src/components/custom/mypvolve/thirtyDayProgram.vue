<template>

    <div class="relative-position" style="min-height: 3rem;">

        <q-inner-loading :visible="!userHasAccessToProduct || showLoader" />

        <div v-if="!showLoader && userHasAccessToProduct" class="full-width row">
            <div class="col-12" style="padding-bottom: .5rem;">
                <q-btn id="backToLibrary" @click="goBack()" flat :style="`color: ${pvolveSalmon}; margin-top: .5rem;`">
                    <q-icon name="fas fa-chevron-left" style="margin-right: .5rem;" />
                    <h6>Back</h6>
                </q-btn>
            </div>

            <div class="row full-width items-center justify-center xs-gutter">
                <div class="vertical-middle" style="padding: .25rem;">
                    <h3 :style="`font-size: ${adaptiveFontSize(1.6)}rem; color: ${pvolveSalmon};`">YOUR</h3>
                </div>
                <div class="vertical-middle" style="padding: .25rem;">
                    <h1 :style="`font-size: ${linearAdaptiveFontSize(4)}rem; color: ${pvolveSalmon};`">30 DAY</h1>
                </div>
                <div class="vertical-middle" style="padding: .25rem;">
                    <h3 :style="`font-size: ${adaptiveFontSize(1.6)}rem; color: ${pvolveMintBG};`">EVOLUTION</h3>
                </div>
            </div>

            <transition appear enter-active-class="animated fadeIn">
                <div v-if="showPartial === 'chooseDate'" class="col-12" align="center" style="padding: 0;">

                    <h5 style="letter-spacing: 1px;">When do you want to get started?</h5>

                    <q-datetime-picker v-model="startDate" format="MM/DD" :min="min" :max="max" color="grey" />

                    <q-btn v-if="startDate" @click="dateChosen" size="lg" class="monty" outline style="background: #fff !important; color: #333;">
                        <h6 style="letter-spacing: 1px;">I want to start my evolution on {{ moment(startDate).format('MMMM D, YYYY') }}</h6>
                    </q-btn>

                    <div align="left" style="margin: 2rem; padding: 2rem; background: #efefef; border: 1px solid #999;">
                        <h5 style="letter-spacing: 1px;">How does this program work?</h5>
                        <ol style="padding-left: 1rem;">
                            <li class="monty" style="font-size: .9rem; margin-bottom: 1rem;">To get started, choose the date you want to start your P.volve 30 Day Program on the small calendar above, then tap or click the button and we'll build a custom 30 Day Evolution calendar just for you!</li>
                            <li class="monty" style="font-size: .9rem; margin-bottom: 1rem;">Bookmark this page, then come back here every day and select the date in the calendar to do a specially planned sequence of workouts with P.</li>
                            <li class="monty" style="font-size: .9rem; margin-bottom: 1rem;">Remember to track your progress in '/me' so you can see the results after your 30 day evolution!</li>
                        </ol>
                    </div>

                </div>
            </transition>

            <transition appear enter-active-class="animated fadeIn">
                <div v-if="showPartial === 'calendar'" class="row relative-position">

                    <div class="col-12" align="center" style="padding: 1rem 0;">
                        <q-btn v-if="startDate < Date.now() && !hideTodaysWorkoutButton" @click="playTodaysWorkout" outline size="sm" class="monty" style="margin: .25rem 0; color: #333; background: #fff !important;">
                            <h6 style="font-size: .7rem; letter-spacing: 1px; margin: 0;">play today's workout</h6>
                        </q-btn>

                        <q-btn @click="showPartial = 'chooseDate'" outline size="sm" class="monty" style="margin: .25rem 0; color: #333; background: #fff !important;">
                            <h6 style="font-size: .7rem; letter-spacing: 1px; margin: 0;">change start date</h6>
                        </q-btn>
                    </div>

                    <div class="row full-width lt-lg monty" style="margin-bottom: 1rem; padding: 0 2rem; font-size: .8rem;">
                        <div class="col-xs-6 col-sm-3" align="center">
                            <div :style="'color: ${pvolveGreyText};'">CE = Complete Evolution</div>
                        </div>
                        <div class="col-xs-6 col-sm-3" align="center">
                            <div :style="`color: ${pvolveSalmon};`">MT = MicroTone</div>
                        </div>
                        <div class="col-xs-6 col-sm-3" align="center">
                            <div :style="`color: ${pvolveMintTitle};`">L&F = Lift & Firm</div>
                        </div>
                        <div class="col-xs-6 col-sm-3" align="center">
                            <div :style="`color: ${pvolveGreyText};`">SS = Standing Sculpt</div>
                        </div>
                    </div>

                    <!--calendar-->
                    <div id="calendar" class="col-12" :style="`padding: ${windowWidth > 768 ? '0 2rem 2rem' : '0'};`">

                        <div class="day" v-for="(day, index) in displayCalendar">
                            <div v-if="day.dayNumber" @click="launchWorkout(day)" :style="day.style || ''" class="card">

                                <div :style="`font-size: ${adaptiveFontSize(.8)}rem;`" class="dayDate monty allCaps">
                                    {{day.theMonth }}
                                    <span class="lt-sm"><br /></span>
                                    {{ day.theDate }}
                                </div>

                                <div v-if="day.today" :style="`background: ${pvolveSalmon}; font-size: ${adaptiveFontSize()}rem;`" class="dayHeader monty allCaps" align="center">
                                    <span class="gt-xs">today</span>
                                    <span class="lt-sm"><q-icon name="fas fa-calendar" style="margin: .65rem 0;" /></span>
                                </div>

                                <div v-else :style="`font-size: ${adaptiveFontSize()}rem;`" class="dayHeader monty allCaps" align="center">
                                    Day
                                    <span class="lt-sm"><br /></span>
                                    {{ day.dayNumber }}
                                </div>
                                <div v-if="day.workouts[0] === 'rd'" style="margin: .25rem 0; font-size: .9rem;" class="row full-width">
                                    <div class="column full-width restDay monty allCaps">
                                        REST DAY
                                    </div>
                                </div>

                                <div v-else class="monty allCaps">
                                    <div align="center" v-for="value in day.workouts" :style="`margin: .25rem 0; font-size: .9rem; color: ${workoutColorMap[value]};`" class="monty allCaps">
                                        <span class="gt-md">{{ workoutNameMap[value] }}</span>
                                        <span class="lt-lg">{{ value }}</span>
                                    </div>
                                    <div class="row justify-center playButton">
                                        <q-icon class="text-grey-5" style="font-size: 25px;" name="fas fa-play-circle" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>

            <transition appear enter-active-class="animated fadeIn">
                <div v-if="showPartial === 'workoutVideo'" class="col-12">

                    <DefaultVideoLayout
                        ref="videoLayout"
                        :currentChapter="currentChapter"
                        :playerOptions="playerOptions"
                        :hideAdvancedControls="true"

                        @setVideoID="setVideoID"
                        @playerReady="playerReady"
                        @togglePlay="togglePlay"
                        @nextChapter="nextChapter"
                        @prevChapter="prevChapter"
                        @selectChapter="selectChapter"
                        @selectChapterHeading="selectChapterHeading"
                        @reInitLocalFile="reInitLocalFile"
                    />

                </div>
            </transition>

            <div align="center" class="col-12 bg-grey-3" style="padding: 2rem; margin-top: 1rem;">
                <recommendProductToFriend :product="currentProduct" />
            </div>

            <div class="col-12" style="padding: 1rem;">
                <pvolveMiniShop :equipmentUsed="equipmentUsed" />
            </div>

            <div id="commentsDisplay" class="col-12">
                <CommentsDisplay :previewMode="false" :ratingImageSrc="'https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/PLV010-17_PeachIcon_CMYK.png'" />
            </div>
        </div>
    </div>

</template>

<script>
    import DefaultVideoLayout from '../../common/player/DefaultVideoLayout'
    import pvolveMiniShop from './pvolveMiniShop'
    import CommentsDisplay from '../../common/comments/CommentsDisplay.vue'
    import recommendProductToFriend from './recommendProductToFriend.vue'

    import { pvolveColors } from './pvolveColors'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { mediaTimeTracking } from '../../../mixins/mediaTimeTracking'
    import { designTools } from '../../../mixins/designTools'
    import { videoTools } from '../../../mixins/videoTools'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { pvolveShopifyData } from './pvolveShopifyData'

    export default {
        props: [],

        components: {
            DefaultVideoLayout,
            pvolveMiniShop,
            CommentsDisplay,
            recommendProductToFriend
        },

        mixins: [pvolveColors, userAndProductInfo, mediaTimeTracking, designTools, videoTools, globalComputedData, pvolveShopifyData],

        data() {
            return {
                showLoader: true,
                userHasAccessToProduct: false,
                showPartial: '',

                startDate: '',
                min: '',
                max: '',
                // min: this.moment().format(),
                // max: this.moment().add(90, 'days').format(),
                productID: 148884,

                calendarOffset: 0,
                displayCalendar: [],

                dayData: [
                    [ 'ce' ],
                    [ 'ss', 'mt' ],
                    [ 'ce' ],
                    [ 'ss', 'lf' ],
                    [ 'rd' ],
                    [ 'mt' ],
                    [ 'ce' ],
                    [ 'ss', 'lf' ],
                    [ 'ss', 'mt' ],
                    [ 'ce' ],
                    [ 'mt', 'lf' ],
                    [ 'rd' ],
                    [ 'ce' ],
                    [ 'mt' ],
                    [ 'ce' ],
                    [ 'lf' ],
                    [ 'rd' ],
                    [ 'ce' ],
                    [ 'rd' ],
                    [ 'rd' ],
                    [ 'ce' ],
                    [ 'ss', 'lf' ],
                    [ 'mt' ],
                    [ 'rd' ],
                    [ 'ce' ],
                    [ 'ss', 'lf' ],
                    [ 'ce' ],
                    [ 'ss', 'mt' ],
                    [ 'ce' ],
                    [ 'mt', 'lf' ]
                ],

                workoutNameMap: {
                    warmup: 'Warmup',
                    ce: 'Complete Evolution',
                    ss: 'Standing Sculpt',
                    mt: 'MicroTone',
                    lf: 'Lift & Firm',
                    rd: 'Rest Day',
                    cooldown: 'Cooldown'
                },

                workoutFileNameMap: {
                    warmup: 'bodi4453_30dayevolu-168_698.mp4',
                    ss: 'bodi4453_30dayevolu-168_236.mp4',
                    mt: 'bodi4453_30dayevolu-168_410.mp4',
                    lf: 'bodi4453_30dayevolu-168_929.mp4',
                    cooldown: 'bodi4453_30dayevolu-168_456.mp4'
                }
            }
        },

        computed: {
            workoutColorMap() {
                return {
                    ce: this.pvolveBlueGrey,
                    ss: this.pvolveGreyText,
                    mt: this.pvolveSalmon,
                    lf: this.pvolveMintTitle,
                    rd: '#fff'
                }
            },

            evolutionData() {
                return this.userPreferences ? this.userPreferences.find(preference => preference.userInfoType === '30DayStartDate') : ''
            },

            evolutionDataPreferenceID() {
                return this.evolutionData && this.evolutionData.id ? this.evolutionData.id : ''
            },

            hideTodaysWorkoutButton() {
                let today = this.j_.queryArrayFirstMatch(this.displayCalendar, 'today', true)
                kw('today', today)
                return today ? today.workouts.indexOf('rd') > -1 : ''
            },

            // downloadedProducts() {
            //     return this.$store.state.downloadedProducts;
            // },
            //
            // productIsDownloaded() {
            //     return this.downloadedProducts.length
            //       ? this.downloadedProducts.filter(item => {
            //           // k('productIsDownloaded: ', item.productID, this.componentData.productID)
            //           return item.productID === this.productID;
            //         })[0]
            //       : false;
            // },
        },

        methods: {

            dateChosen() {
                this.saveStartDate()
                this.modifyCalendarBasedOnStartDay()
            },

            goBack() {
                if (this.showPartial === 'makeMyOwnWorkout' || this.showPartial === 'workoutVideo') {
                    this.goBackToCalendar()
                } else {
                    this.goBackToLibrary()
                }
            },

            goBackToCalendar() {
                this.sendCurrentMediaPlayEventIfExists()
                this.showPartial = 'calendar'
            },

            goBackToLibrary() {
                this.sendCurrentMediaPlayEventIfExists()
                this.route(this.$store.state.comingFrom)
            },

            saveStartDate() {
                const req = {
                    userID: this.userInfo.userID,
                    userLoginToken: this.userLoginToken,
                    userInfoType: '30DayStartDate',
                    environment: this.environment.name,
                    startDate: this.moment(this.startDate).valueOf() // set to what they chose in datepicker
                }
                k('saveStartDate req: ', req)

                this.saveUserPreferenceToAPI(this.evolutionDataPreferenceID, req, () => {})
            },

            modifyCalendarBasedOnStartDay() {
                k('modifyCalendarBasedOnStartDay')

                this.displayCalendar = []

                let theDate

                for (var i = 0; i < 30; i++) {

                    theDate = this.moment(this.startDate).add( i, 'days')

                    this.displayCalendar[i] = {
                        theMonth: theDate.format('MMM'),
                        theDate: theDate.format('D'),
                        dayNumber: i + 1,
                        workouts: this.dayData[ i ]
                    }

                    if (this.displayCalendar[i].workouts[0] === 'rd') {
                        this.displayCalendar[i].style = 'background: #bbb; color: #fff;'
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

                kw('displayCalendar')
                k(this.displayCalendar)

                if (this.showLoader) this.showLoader = false
                if (this.showPartial !== 'calendar') this.showPartial = 'calendar'
            },

            launchWorkout(day) {

                if (day.workouts[0] === 'rd') {
                    return false
                }

                this.currentProduct.productJSON = {}
                this.currentProduct.productJSON.video = this.videoJsonFromDayPlaylist(this.j_.cloneObject(day))

                this.$store.commit('currentMediaType', 'html5')
                this.$store.commit('setCurrentProduct', this.currentProduct)
                k('currentProduct: ', this.currentProduct)

                this.generateNestedChapters()

                this.showPartial = 'workoutVideo'
                window.scrollTo(0, 0)

                this.playChapter(0)
            },

            nextChapter() {
                if (this.videoID && document.getElementById(this.videoID) && !document.getElementById(this.videoID).paused) {
                    k('pause playing video before continuing')
                    this.togglePlay(true)
                }

                var nextChapterIndex = this.currentChapterIndex + 1
                k('nextChapterIndex: ', this.currentChapterIndex, nextChapterIndex)

                if (this.chapters[nextChapterIndex]) {
                    this.playChapter(nextChapterIndex)
                } else {
                    this.goBackToCalendar()
                    window.scrollTo(0, 0)
                }
            },

            videoJsonFromDayPlaylist(dayPlaylist) {
                k('dayPlaylist', dayPlaylist)
                if (dayPlaylist.workouts.includes('ce')) dayPlaylist.workouts = ['ss', 'mt', 'lf']
                dayPlaylist.workouts.unshift('warmup')
                dayPlaylist.workouts.push('cooldown')

                let playlistJson = []

                dayPlaylist.workouts.forEach((workout) => {
                    k(workout)
                    playlistJson.push({
                        chapterStartSeconds:0,
                        chapterStartTimecode: "00:00:00",
                        displayName: this.workoutNameMap[workout],
                        fileName: this.workoutFileNameMap[workout],
                        originalFileName: this.workoutFileNameMap[workout],
                        remotePath: `bodi4453_30dayevolu-168/media/${this.workoutFileNameMap[workout]}`
                    })
                })

                return playlistJson
            },

            playTodaysWorkout() {
                // figure out which element in dayData is today, grab it and send it to launchWorkout
                //

                let today = this.j_.queryArrayFirstMatch(this.displayCalendar, 'today', true)
                kw('today', today)
                this.launchWorkout(today)

            },

            playerEnded() {
                this.showPartial = 'calendar'
            },

            setUpCalendar() {
                k('evolutionData: ', this.evolutionData)

                if (this.evolutionData && this.evolutionData.startDate) {
                    this.startDate = this.evolutionData.startDate
                    this.modifyCalendarBasedOnStartDay()
                } else {
                    this.showPartial = 'chooseDate'
                    this.showLoader = false
                }
            },

            checkUserAccessToProduct() {
                let productInfo = this.environmentProducts.find(product => product.productID === this.productID)
                k('30 day productInfo: ', productInfo)
                this.$store.commit('setCurrentProduct', productInfo)



                // if user does not have access or product is not available, reroute
                if (!this.userHasAccess(this.brand.validSubscriptionProductIDs.concat([this.productID])) || !productInfo.webplayer) {
                    this.route('/')
                } else {
                    this.userHasAccessToProduct = true
                    this.getShopifyProductDataIfNeeded()
                }
            }
        },

        created() {

            if (this.environmentProducts) {
                this.checkUserAccessToProduct()
            }

            if (this.userPreferences) { // if they navigated here
                this.setUpCalendar()
            } else if (this.userInfo) {
                this.getUserPreferences(() => {})
            }
        },

        watch: {
            environmentProducts() {
                if (this.environmentProducts) {
                    this.checkUserAccessToProduct()
                }
            },

            userInfo() {
                this.getUserPreferences(() => {})
            },

            userPreferences() {
                kw('userPreferences watcher triggered')
                if (this.userPreferences) { // if they navigated here
                    this.setUpCalendar()
                }
            },

            startDate() {
                kw('startDate chosen', this.moment(this.startDate).format('MMM DD'))
            },

            showPartial() {
                this.sendCurrentMediaPlayEventIfExists()
            }
        },

        beforeDestroy() {
            this.$store.commit('setCurrentChapter', '')
            this.$store.commit('setCurrentChapterIndex', '')
            this.sendCurrentMediaPlayEventIfExists() // send any remaining mediaplay event
        }

    }

</script>

<style scoped>
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
  border: 1px solid #ddd;
  cursor: pointer;
  margin-bottom: 2rem;
  text-align: center;
}

.day {
  width: 14.28%;
  display: block;
}

.dayDate {
  color: #999;
  background: #fff;
  padding: 0.3rem;
}

.dayHeader {
  background: #999;
  color: #fff;
  padding: 0.3rem;
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
  bottom: 0.5rem;
  -webkit-transform: translate(-50%);
  transform: translate(-50%);
}
</style>
