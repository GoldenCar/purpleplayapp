<template>
    <div class="relative-position" style="min-height: 3rem;">

        <q-inner-loading :visible="!userHasAccessToProduct || showLoader" />

        <div v-if="!showLoader && userHasAccessToProduct" class="full-width row">
            <div id="programBackground" class="col-12 row">

                <div class="col-12" style="padding: 1rem 0 .5rem 1rem;">
                    <q-btn id="backToLibrary" @click="goBack()" outline style="color: #fff; margin-top: .5rem;">
                        <q-icon name="fas fa-chevron-left" style="margin-right: .5rem;" />
                        <h6>Back</h6>
                    </q-btn>
                </div>

                <div class="row full-width items-center justify-center" style="text-transform: uppercase; margin: 2rem 0;">
                    <div class="vertical-middle" style="padding: .25rem;">
                        <h1 :style="'font-size: ' + linearAdaptiveFontSize(4) + 'rem; color: #fff;'">2 Week</h1>
                    </div>
                    <div class="vertical-middle">
                        <h3 :style="`font-size: ${adaptiveFontSize(1.6)}rem; line-height: ${adaptiveFontSize(1.6)}rem; color: #fff;`">Beginner <br> Program</h3>
                    </div>
                </div>

                <transition appear enter-active-class="animated fadeIn">
                    <div v-if="showPartial === 'chooseDate'" class="full-width row items-center" style="padding: 1rem;">
                        <div class="row full-width justify-center" style="margin-bottom: 2vh; text-align: center;">
                            <h5 class="text-white" style="letter-spacing: 1px;">When do you want to get started?</h5>
                        </div>
                        <div class="row full-width justify-center">
                            <q-datetime-picker v-model="startDate" format="MM/DD" :min="min" :max="max" class="bg-white" color="grey" type="date" />
                        </div>

                        <div v-if="startDate" class="row full-width justify-center" style="margin-top: 2vh;">
                            <q-btn v-if="startDate" @click="dateChosen()" size="lg" class="monty" outline style="background: #fff !important; color: #333;">
                                <h6 style="letter-spacing: 1px;">I want to start on {{ moment(startDate).format('MMMM D, YYYY') }}</h6>
                            </q-btn>
                        </div>
                    </div>
                </transition>

                <transition appear enter-active-class="animated fadeIn">
                    <div v-if="showPartial === 'calendar'" class="col-12 relative-position" style="margin-bottom: 2rem;">

                        <div class="col-12" align="center" style="padding: 1rem 0;">
                            <q-btn v-if="startDate < Date.now() && !hideTodaysWorkoutButton" @click="playTodaysWorkout" outline size="sm" class="monty" style="margin: .25rem 0; color: #333; background: #fff !important;">
                                <h6 style="font-size: .7rem; letter-spacing: 1px;">play today's workout</h6>
                            </q-btn>

                            <q-btn @click="chooseNewDate()" outline size="sm" class="monty" style="margin: .25rem 0; color: #333; background: #fff !important;">
                                <h6 style="font-size: .7rem; letter-spacing: 1px;">change start date</h6>
                            </q-btn>
                        </div>
                    </div>
                </transition>
            </div>

            <transition appear enter-active-class="animated fadeIn">
                <div v-if="showPartial === 'calendar'" class="col-12 row relative-position" style="padding: 1rem;">

                    <!--calendar-->
                    <div id="calendar" class="col-12">
                        <div class="day" v-for="(day, index) in displayCalendar">
                            <div v-if="day.dayNumber" @click="launchWorkout(day)" :style="day.style || ''" class="card">

                                <div :style="`font-size: ${adaptiveFontSize(.8)}rem;`" class="dayDate monty allCaps">
                                    {{day.theMonth }}
                                    <span class="lt-sm"><br /></span> {{ day.theDate }}
                                </div>

                                <div v-if="day.today" :style="`background: ${pvolveMintBG}; font-size: ${adaptiveFontSize()}rem;`" class="dayHeader monty allCaps" align="center">
                                    <span class="gt-xs">today</span>
                                    <span class="lt-sm"><q-icon name="fas fa-calendar" style="margin: .65rem 0;" /></span>
                                </div>

                                <div v-else :style="`font-size: ${adaptiveFontSize()}rem;`" class="dayHeader monty allCaps" align="center">
                                    Day
                                    <span class="lt-sm"><br /></span> {{ day.dayNumber }}
                                </div>
                                <div v-if="day.workouts[0] === 'rd'" style="margin: .25rem 0; font-size: .9rem;" class="row full-width workouts-container rest-day">
                                    <div class="column full-width restDay monty allCaps">
                                        REST DAY
                                    </div>
                                </div>

                                <div v-else class="monty allCaps workouts-container">
                                    <div align="center" v-for="value in day.workouts" :style="`margin: .25rem 0; font-size: .8rem; color: ${workoutColorMap[value]};`" class="monty allCaps">
                                        <span class="gt-sm">{{ workoutNameMap[value] }}</span>
                                        <!--<span class="gt-md">{{ workoutNameMap[value] }}</span>-->
                                        <!--<span class="lt-lg">{{ shortWorkoutNameMap[value] }}</span>-->
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
                    />

                </div>
            </transition>

            <div align="center" class="col-12 bg-grey-3" style="padding: 2rem;">
                <recommendProductToFriend :product="currentProduct" />
            </div>

            <div class="col-12" style="padding: 1rem;">
               <pvolveMiniShop :equipmentUsed="equipmentUsed" />
            </div>

            <div id="commentsDisplay" class="col-12">
                <CommentsDisplay :productID="productID" :previewMode="false" :ratingImageSrc="'https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/PLV010-17_PeachIcon_CMYK.png'" />
            </div>
        </div>
    </div>

</template>

<script>
    import DefaultVideoLayout from '../../common/player/DefaultVideoLayout'
    import draggable from 'vuedraggable'
    import pvolveMiniShop from './pvolveMiniShop'
    import CommentsDisplay from '../../common/comments/CommentsDisplay.vue'
    import recommendProductToFriend from './recommendProductToFriend.vue'

    import { QDatetimePicker } from 'quasar'
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
            QDatetimePicker,
            DefaultVideoLayout,
            draggable,
            pvolveMiniShop,
            CommentsDisplay,
            recommendProductToFriend
        },

        mixins: [pvolveColors, userAndProductInfo, mediaTimeTracking, designTools, videoTools, globalComputedData, pvolveShopifyData],

        data() {
            return {
                showLoader: true,
                userHasAccessToProduct: false,
                // advancedMode: false,
                hideTodaysWorkoutButton: false,
                showPartial: '',

                startDate: Date.now(),
                min: '',
                max: '',

                productID: 155882,
                productSKU: 'bodi4453_15daybegin-897',

                calendarOffset: 0,
                selectedCustomWorkouts: [],
                displayCalendar: [],

                regularScheduleData: [
                    [1],
                    [2],
                    ['rd'],
                    [3],
                    [4],
                    ['rd'],
                    ['rd'],
                    [5],
                    [6],
                    ['rd'],
                    [7],
                    [8],
                    ['rd'],
                    ['rd']
                ],

                workoutNameMap: {
                    1: 'Workout 1',
                    2: 'Workout 2',
                    3: 'Workout 3',
                    4: 'Workout 4',
                    5: 'Workout 5',
                    6: 'Workout 6',
                    7: 'Workout 7',
                    8: 'Workout 8'
                },

                workoutFileNameMap: {
                    1: 'bodi4453_15daybegin-897_472.mp4',
                    2: 'bodi4453_15daybegin-897_114.mp4',
                    3: 'bodi4453_15daybegin-897_330.mp4',
                    4: 'bodi4453_15daybegin-897_857.mp4',
                    5: 'bodi4453_15daybegin-897_191.mp4',
                    6: 'bodi4453_15daybegin-897_945.mp4',
                    7: 'bodi4453_15daybegin-897_693.mp4',
                    8: 'bodi4453_15daybegin-897_683.mp4'
                }

            }
        },

        computed: {
            twoWeekBeginnerData() {
                return this.userPreferences ? this.userPreferences.find(preference => preference.type === 'twoWeekBeginner') : ''
            },

            twoWeekBeginnerDataPreferenceID() {
                return this.twoWeekBeginnerData && this.twoWeekBeginnerData.id ? this.twoWeekBeginnerData.id : ''
            },

            workoutColorMap() {
                return {
                    sl: this.pvolveMintTitle,
                    tt: this.pvolveBrown,
                    sf: this.pvolvePink,
                    bt: this.pvolveSalmon,
                    ll: this.pvolveBlueGrey,
                }
            }
        },

        methods: {

            chooseNewDate() {
                this.showPartial = 'chooseDate'
            },

            goToMakeMyOwnWorkout() {
                this.showPartial = 'makeMyOwnWorkout'
            },

            goBack() {
                if (this.showPartial === 'makeMyOwnWorkout' || this.showPartial === 'workoutVideo') {
                    this.goBackToCalendar()
                }
                else {
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

            addWorkoutToList(workoutKey) {
                k('selectedCustomWorkouts: ', this.selectedCustomWorkouts)
                if (this.selectedCustomWorkouts.find(key => key === workoutKey)) {
                    return;
                }
                this.selectedCustomWorkouts.push(workoutKey)

                this.scrollIt('myCustomizedWorkout', false, 50)
            },

            removeWorkoutFromList(index) {
                this.selectedCustomWorkouts.splice(index, 1);
            },

            dateChosen() {
                k('dateChosen!')

                this.saveStartDate()
                this.generateCalendarByStartDate()
            },

            playerEnded() {
                this.showPartial = 'calendar'
            },

            saveStartDate() {
                const req = {
                    userID: this.$store.state.user.info.userID,
                    userLoginToken: this.$store.state.user.userLoginToken,
                    type: 'twoWeekBeginner',
                    environment: this.$store.state.environment.name,
                    // advancedMode: this.advancedMode,
                    startDate: this.moment(this.startDate).valueOf() // set to what they chose in datepicker
                }
                k('saveStartDate req: ', req)

                this.saveUserPreferenceToAPI(this.twoWeekBeginnerDataPreferenceID, req, () => {})
            },

            generateCalendarByStartDate() {
                k('generateCalendarByStartDate')

                this.displayCalendar = []

                let scheduleData = this.regularScheduleData
                let theDate

                for (let i = 0; i < 14; i++) {

                    theDate = this.moment(this.startDate).add(i, 'days')

                    this.displayCalendar[i] = {
                        theMonth: theDate.format('MMM'),
                        theDate: theDate.format('D'),
                        dayNumber: i + 1,
                        workouts: scheduleData[i]
                    }

                    if (this.displayCalendar[i].workouts[0] === 'rd') {
                        this.displayCalendar[i].style = 'background: #bdc2c9; color: #fff;'
                    } else {
                        this.displayCalendar[i].style = 'cursor: pointer;'
                    }

                    // labels today's day in calendar
                    if (this.moment(theDate).isSame(Date.now(), 'day')) { // it's today
                        this.displayCalendar[i].today = true
                    }
                }

                // now pad the beginning of calendar with an offset
                this.calendarOffset = this.moment(this.startDate).day()

                for (let i = 0; i < this.calendarOffset; i++) {
                    this.displayCalendar.unshift({})
                }

                kw('displayCalendar')
                k(this.displayCalendar)

                if (this.showLoader) this.showLoader = false
                if (this.showPartial !== 'calendar') this.showPartial = 'calendar'
            },

            launchWorkout(day) {
                k('launchWorkout: ', day)

                if (day.workouts[0] === 'rd') {
                    return false
                }

                let currentProduct = this.j_.cloneObject(this.currentProduct)
                    currentProduct.productJSON = {}
                    currentProduct.productJSON.video = this.videoJsonFromDayPlaylist(this.j_.cloneObject(day))

                this.$store.commit('currentMediaType', 'html5')
                this.$store.commit('setCurrentProduct', currentProduct)
                this.$store.commit('setCurrentChapterIndex', '')
                k('currentProduct: ', this.currentProduct)

                // this.generateNestedChapters()

                this.showPartial = 'workoutVideo'
                this.scrollIt('programBackground', false, -225)
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
                }
                else {
                    this.goBackToCalendar()
                    window.scrollTo(0, 0)
                }
            },

            videoJsonFromDayPlaylist(dayPlaylist) {
                k('dayPlaylist', dayPlaylist)

                let playlistJson = []

                dayPlaylist.workouts.forEach((workout) => {
                    k('workout code: ', workout)
                    let workoutObj = {
                        chapterStartSeconds: 0,
                        chapterStartTimecode: "00:00:00",
                        displayName: this.workoutNameMap[workout],
                        fileName: this.workoutFileNameMap[workout],
                        originalFileName: this.workoutFileNameMap[workout],
                        remotePath: `/${this.productSKU}/media/${this.workoutFileNameMap[workout]}`
                    }
                    k('workoutObj: ', workoutObj)

                    playlistJson.push(workoutObj)
                })

                return playlistJson
            },

            playTodaysWorkout() {

                // figure out which element in dayData is today, grab it and send it to launchWorkout
                let today = this.j_.queryArrayFirstMatch(this.displayCalendar, 'today', true)
                kw('today', today)

                this.launchWorkout(today)
            },

            setUpCalendar() {
                k('setupCalendar: ', this.twoWeekBeginnerData)

                if (this.twoWeekBeginnerData && this.twoWeekBeginnerData.startDate) {
                    this.startDate = this.twoWeekBeginnerData.startDate
                    // this.advancedMode = Boolean(this.twoWeekBeginnerData.advancedMode)

                    this.generateCalendarByStartDate()
                }
                else {
                    // show date picker
                    this.showPartial = 'chooseDate'
                    this.showLoader = false
                }
            },

            checkUserAccessToProduct() {
                let productInfo = this.environmentProducts.find(product => product.productID === this.productID)
                k('two week productInfo: ', productInfo)
                this.$store.commit('setCurrentProduct', productInfo)

                k('user access two week? ', this.userHasAccess(this.brand.validSubscriptionProductIDs.concat([this.productID])))

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
            k('two week data? ', this.userPreferences, this.twoWeekBeginnerData)
            k('environmnetProducts? ', this.environmentProducts)

            if (this.environmentProducts) {
                this.checkUserAccessToProduct()
            }

            if (this.userPreferences) { // if they navigated here
                this.setUpCalendar()
            }
            else if (this.userInfo) {
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

            userHasAccessToProduct() {
                k('userHasAccessToProduct: ', this.userHasAccessToProduct)
            },

            showLoader() {
                k('showLoader: ', this.showLoader)
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
    #programBackground {
        background: url(https://vault.platformpurple.com/static/clients/mypvolve/two-week-beginner-program-image-web.jpg);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 30% 0%;
    }

    /*@media screen and (min-width: 1000px) {*/
    /*    .programBackground {*/
    /*        background-position: 25% 75%;*/
    /*    }*/
    /*}*/

    #calendar {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        margin-bottom: 2rem;
    }

    .card {
        position: relative;
        background: #fff;
        height: 100%;
        border: 1px solid #ddd;
        margin-bottom: 2rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
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
        background: #8C909A;
        color: #fff;
        padding: .3rem;
    }

    .workouts4day {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .restDay {
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

    .workouts-container {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding-bottom: 1rem;
    }

    .recommended-equipment-list {
        padding: 3px 0px 0px 15px;
        margin: 0px;
    }

    .q-option {
        color: rgb(140, 144, 154) !important;
    }

    .q-list {
        border: none;
        color: rgb(140, 144, 154);
    }

    .q-list .q-collapsible,
    .q-list .q-item {
        border: 1px solid #ddd;
        margin-bottom: 10px;
    }
</style>
