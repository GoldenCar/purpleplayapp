<template>
    <div class="relative-position" style="min-height: 3rem;">

        <q-inner-loading :visible="!userHasAccessToProduct || showLoader" />

        <div v-if="!showLoader && userHasAccessToProduct" class="full-width row">
            <div class="col-12" style="padding-bottom: .5rem;">
                <q-btn id="backToLibrary" @click="goBack()" flat :style="'color: ' + pvolveSalmon + '; margin-top: .5rem;'">
                    <q-icon name="fas fa-chevron-left" style="margin-right: .5rem;" />
                    <h6>Back</h6>
                </q-btn>
            </div>

            <div class="row full-width items-center justify-center xs-gutter">
                <div class="vertical-middle" style="padding: .25rem;">
                    <h1 :style="'font-size: ' + linearAdaptiveFontSize(4) + 'rem; color: ' + pvolveMintBG + ';'">21 day</h1>
                </div>
                <div class="vertical-middle">
                    <h3 :style="`font-size: ${adaptiveFontSize(1.6)}rem; line-height: ${adaptiveFontSize(1.6)}rem; color: ${pvolveMintBG};`">Butt Lift <br> Calendar</h3>
                </div>
            </div>

            <transition appear enter-active-class="animated fadeIn">
                <div v-if="showPartial === 'chooseDate'" class="col-12" align="center" style="padding: 1rem;">
                    <h5 style="letter-spacing: 1px;">When do you want to get started?</h5>

                    <q-datetime-picker v-model="startDate" format="MM/DD" :min="min" :max="max" color="grey" type="date" />

                    <q-btn v-if="startDate" @click="dateChosen()" size="lg" class="monty" outline style="background: #fff !important; color: #333;">
                        <h6 style="letter-spacing: 1px;">I want to start on {{ moment(startDate).format('MMMM D, YYYY') }}</h6>
                    </q-btn>
                </div>
            </transition>

            <transition appear enter-active-class="animated fadeIn">
                <div v-if="showPartial === 'calendar'" class="row relative-position" style="margin-bottom: 4rem;">

                    <div class="col-12" align="center" style="padding: 1rem 0;">
                        <q-btn v-if="startDate < Date.now() && !hideTodaysWorkoutButton" @click="playTodaysWorkout" outline size="sm" class="monty" style="margin: .25rem 0; color: #333; background: #fff !important;">
                            <h6 style="font-size: .7rem; letter-spacing: 1px; margin: 0;">play today's workout</h6>
                        </q-btn>

                        <q-btn @click="goToMakeMyOwnWorkout()" outline size="sm" class="monty" style="margin: .25rem 0; color: #333; background: #fff !important;">
                            <h6 style="font-size: .7rem; letter-spacing: 1px; margin: 0;">Make my own workout</h6>
                        </q-btn>

                        <q-btn @click="chooseNewDate()" outline size="sm" class="monty" style="margin: .25rem 0; color: #333; background: #fff !important;">
                            <h6 style="font-size: .7rem; letter-spacing: 1px; margin: 0;">change start date</h6>
                        </q-btn>
                    </div>

                    <div class="col-12" :align="`${windowWidth > 767 ? 'right' : 'center'}`" style="padding: 1rem 2rem;">
                        <q-toggle v-model="advancedMode" label="Advanced Mode" @input="toggleAdvancedMode" color="teal-8" />
                        <q-btn flat class="q-pa-sm">
                            <q-tooltip anchor="center middle" self="bottom right">
                                If you want a more challenging workout schedule, turn on "advanced mode!"
                            </q-tooltip>
                            <q-icon name="fas fa-info-circle" style="color: #524F4C; margin: 0;" />
                        </q-btn>
                    </div>

                    <!--calendar-->
                    <div id="calendar" class="col-12" :style="`padding: ${windowWidth > 768 ? '0px 2rem 0rem 2rem' : '1rem'};`">
                        <div class="day" v-for="(day, index) in displayCalendar">
                            <div v-if="day.dayNumber" @click="launchWorkout(day)" :style="day.style || ''" class="card">

                                <div :style="'font-size: ' + adaptiveFontSize(.8) + 'rem;'" class="dayDate monty allCaps">
                                    {{day.theMonth }}
                                    <span class="lt-sm"><br /></span> {{ day.theDate }}
                                </div>

                                <div v-if="day.today" :style="'background: ' + pvolveSalmon + '; font-size: ' + adaptiveFontSize() + 'rem;'" class="dayHeader monty allCaps" align="center">
                                    <span class="gt-xs">today</span>
                                    <span class="lt-sm"><q-icon name="fas fa-calendar" style="margin: .65rem 0;" /></span>
                                </div>

                                <div v-else :style="'font-size: ' + adaptiveFontSize() + 'rem;'" class="dayHeader monty allCaps" align="center">
                                    Day
                                    <span class="lt-sm"><br /></span> {{ day.dayNumber }}
                                </div>
                                <div v-if="day.workouts[0] === 'rd'" style="margin: .25rem 0; font-size: .9rem;" class="row full-width workouts-container rest-day">
                                    <div class="column full-width restDay monty allCaps">
                                        REST DAY
                                    </div>
                                </div>

                                <div v-else class="monty allCaps workouts-container">
                                    <div align="center" v-for="value in day.workouts" :style="'margin: .25rem 0; font-size: .9rem; color: ' + workoutColorMap[value] + ';'" class="monty allCaps">
                                        <span class="gt-md">{{ workoutNameMap[value] }}</span>
                                        <span class="lt-lg">{{ shortWorkoutNameMap[value] }}</span>
                                    </div>
                                    <div class="row justify-center playButton">
                                        <q-icon class="text-grey-5" style="font-size: 25px;" name="fas fa-play-circle" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row full-width monty justify-center" :style="`margin-bottom: 1rem; padding: 0 ${windowWidth > 767 ? '2rem' : '1rem'}; font-size: .8rem;`">
                        <div v-for="(workout, key, index) in workoutNameMap" v-if="workoutInfoMap[key] && workoutInfoMap[key].heading" class="col-xs-6 col-sm-4 col-md" style="padding: .5rem;">
                            <div class="q-subheading q-mb-sm" :style="`color: ${workoutColorMap[key]};`">{{workoutInfoMap[key].heading}}</div>
                            <div :style="'color: ' + pvolveGreyText + ';'">
                                <div>Recommended equipment:</div>
                                <ul class="recommended-equipment-list">
                                    <li v-for="item in workoutInfoMap[key].equipment">{{item}}</li>
                                </ul>
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

            <transition appear enter-active-class="animated fadeIn">
                <div v-if="showPartial === 'makeMyOwnWorkout'" class="full-width bg-grey-3">

                    <div class="row well">
                        <div class="col-md-6 q-pa-md" :style="`background: ${pvolveMintBG};`">
                            <h5 class="text-white">All Segments</h5>

                            <q-card v-for="(key, index) in Object.keys(workoutNameMap)" v-if="workoutInfoMap[key].heading" :key="index" class="bg-white" style="margin: 1rem 0;">
                                <q-card-main class="row">
                                    <div class="col-xs-12 col-sm-3">
                                        <img v-if="workoutInfoMap[key]" :src="`https://vault.platformpurple.com/static/clients/mypvolve/${workoutInfoMap[key].imageFileName}`" :style="`max-width: 100%; ${windowWidth < 575 ? 'margin-bottom: .5rem;' : ''}`" />
                                    </div>
                                    <div class="col-xs-12 col-sm-8" :align="`${windowWidth < 575 ? 'center' : ''}`" style="padding: 0 .5rem;">
                                        <h6 :style="`color: ${pvolveMintTitle};`">{{workoutInfoMap[key].heading}} <span :style="`font-size: .7rem; color: ${pvolveSalmon};`">({{workoutInfoMap[key].duration}})</span></h6>
                                        <div v-if="workoutInfoMap[key]" v-html="workoutInfoMap[key].description" />
                                    </div>
                                    <div class="col-xs-12 col-sm-1" align="center" style="display: inline-flex;">
                                        <q-btn @click.stop="addWorkoutToList(key)" v-if="!selectedCustomWorkouts.includes(key)" align="center" outline :class="`${windowWidth < 768 ? 'full-width' : ''} no-border q-pa-xs`" :style="`color: ${pvolveMintBG}; vertical-align: middle; ${windowWidth < 575 ? 'margin-top: .5rem;' : ''}`">
                                            <q-icon name="fas fa-plus" />
                                        </q-btn>
                                    </div>
                                </q-card-main>
                            </q-card>
                        </div>

                        <div id="myCustomizedWorkout" class="col-md-6 q-pa-md" :style="`background: ${pvolveSalmon};`">
                            <h5 class="text-white">My Customized Workout</h5>

                            <q-card v-if="selectedCustomWorkouts.length" class="bg-white" style="margin: 1rem 0;">
                                <q-card-main class="row" style="padding: .5rem 1rem;">
                                    <div class="col-1" style="display: inline-flex;"></div>
                                    <div class="col-10" style="padding-left: .5rem;">
                                        <h6 :style="`color: ${pvolveSalmon}; margin: .6rem 0;`">Warmup <span :style="`font-size: .7rem; color: ${pvolveSalmon};`">({{workoutInfoMap['warmup'].duration}})</span></h6>
                                    </div>
                                    <div class="col-1" style="display: inline-flex;"></div>
                                </q-card-main>
                            </q-card>

                            <draggable v-model="selectedCustomWorkouts" @start="drag=true" @end="drag=false">
                                <q-card v-for="(key, index) in selectedCustomWorkouts" :key="index" class="bg-white" style="margin: 1rem 0;">
                                    <q-card-main class="row" style="padding: .5rem 1rem;">
                                        <div class="col-1" style="display: inline-flex;">
                                            <q-icon name="fas fa-bars" style="color: #524F4C;" />
                                        </div>
                                        <div class="col-10" style="padding-left: .5rem;">
                                            <h6 :style="`color: ${pvolveSalmon}; margin: .6rem 0;`">{{workoutNameMap[key]}} <span :style="`font-size: .7rem; color: ${pvolveSalmon};`">({{workoutInfoMap[key].duration}})</span></h6>
                                        </div>
                                        <div class="col-1" style="display: inline-flex;">
                                            <q-btn @click.stop="removeWorkoutFromList(index)" outline class="no-border q-pa-xs" :style="`color: ${pvolveSalmon}; vertical-align: middle;`">
                                                <q-icon name="fas fa-times" />
                                            </q-btn>
                                        </div>
                                    </q-card-main>
                                </q-card>
                            </draggable>

                            <q-card v-if="selectedCustomWorkouts.length" class="bg-white" style="margin: 1rem 0;">
                                <q-card-main class="row" style="padding: .5rem 1rem;">
                                    <div class="col-1" style="display: inline-flex;"></div>
                                    <div class="col-10" style="padding-left: .5rem;">
                                        <h6 :style="`color: ${pvolveSalmon}; margin: .6rem 0;`">Cooldown <span :style="`font-size: .7rem; color: ${pvolveSalmon};`">({{workoutInfoMap['cooldown'].duration}})</span></h6>
                                    </div>
                                    <div class="col-1" style="display: inline-flex;"></div>
                                </q-card-main>
                            </q-card>

                            <div v-if="!selectedCustomWorkouts.length" class="col-12 q-pb-md">
                                <p class="monty text-white" style="margin-top: 1rem;">Click the + buttons on the workout segments to add them to your custom workout. Warmup and cooldown will be added automatically.</p>
                            </div>

                            <div v-else class="col-12 q-pb-md" align="center" style="margin: 1rem 0 0 0; padding: .5rem 0; border-top: 1px solid #efefef;">
                                <p style="font-size: .9rem; color: #fff;">Reorder your playlist by dragging the workout segments.</p>
                                <q-btn @click="launchWorkout({ workouts: selectedCustomWorkouts })" class="full-width" :style="`background: white; color: ${pvolveSalmon};`">
                                    <h5 class="thickHeader">Play your workout</h5>
                                    <q-icon name="fas fa-caret-right" style="font-size: 1.3rem; margin-left: .5rem;" />
                                </q-btn>
                            </div>
                        </div>
                    </div>
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
import draggable from 'vuedraggable'
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
            advancedMode: false,
            hideTodaysWorkoutButton: false,
            showPartial: '',

            startDate: Date.now(),
            min: '',
            max: '',
            // min: this.moment().format(),
            // max: this.moment().add(90, 'days').format(),

            productID: 155386,
            productSKU: 'bodi4453_21daybutt-626',

            // productID: 148884,
            // productSKU: 'bodi4453_30dayevolu-168',

            calendarOffset: 0,
            selectedCustomWorkouts: [],
            displayCalendar: [],

            regularScheduleData: [
                ['sl'],
                ['tt'],
                ['sf'],
                ['rd'],
                ['sl', 'sf'],
                ['bt'],
                ['ll'],
                ['rd'],
                ['sf', 'sl'],
                ['ll'],
                ['rd'],
                ['tt'],
                ['ll'],
                ['rd'],
                ['ll', 'tt'],
                ['bt', 'sl'],
                ['sf', 'tt'],
                ['rd'],
                ['ll', 'tt'],
                ['sf', 'sl'],
                ['bt', 'sf'],
            ],

            advancedScheduleData: [
                ['ll', 'tt', 'sl'],
                ['sf'],
                ['bt', 'sf'],
                ['rd'],
                ['sl', 'll', 'tt'],
                ['sf'],
                ['bt', 'tt'],
                ['rd'],
                ['ll', 'sf', 'sl'],
                ['tt'],
                ['sf', 'tt', 'sl'],
                ['rd'],
                ['bt'],
                ['sf', 'sl'],
                ['ll', 'tt'],
                ['rd'],
                ['rd'],
                ['ll', 'tt', 'sl'],
                ['sf', 'tt'],
                ['ll', 'tt', 'sl'],
                ['sf', 'tt', 'bt'],
            ],

            workoutNameMap: {
                warmup: 'Warmup',
                ll: 'Long & Lean',
                bt: 'Balance & Tone',
                sl: 'Squeeze & Lift',
                tt: 'Tight & Tone',
                sf: 'Sculpt & Firm',
                cooldown: 'Cooldown',
            },

            shortWorkoutNameMap: {
                warmup: 'Warmup',
                ll: 'L&L',
                bt: 'B&T',
                sl: 'S&L',
                tt: 'T&T',
                sf: 'S&F',
                cooldown: 'Cooldown',
            },

            workoutInfoMap: {
                warmup: {
                    imageFileName: '21daybuttlift-warmup.jpg',
                    duration: '4:00',
                },

                ll: {
                    heading: 'LONG & LEAN (L&L)',
                    equipment: ['Heavy Ankle Band', 'Gliders'],
                    description:
                        '<span style="font-size: .8rem; color: #524F4C;">This all-standing workout pumps up the entire glute, feeling the burn from top to bottom, inside to outside. <br /> Equipment: Heavy Ankle Band, Gliders</span>',
                    imageFileName: '21daybuttlift-ll.jpg',
                    duration: '30:00',
                },

                bt: {
                    heading: 'BALANCE & TONE (B&T)',
                    equipment: ['Heavy Ankle Weights', 'P.mat', 'Gliders'],
                    description:
                        '<span style="font-size: .8rem; color: #524F4C;">Work within a lower range of motion to target the glutes while challenging your balance. <br /> Equipment: Heavy Ankle Weights, P.mat, Gliders</span>',
                    imageFileName: '21daybuttlift-bt.jpg',
                    duration: '31:00',
                },

                sl: {
                    heading: 'SQUEEZE & LIFT (S&L)',
                    equipment: ['P.ball', 'P.mat', 'Gliders'],
                    description:
                        '<span style="font-size: .8rem; color: #524F4C;">You’ll watch your booty perk up, lift up, and tone up right in front of your eyes with this P.ball workout. <br /> Equipment: P.ball, P.mat, Glider</span>',
                    imageFileName: '21daybuttlift-sl.jpg',
                    duration: '30:00',
                },

                tt: {
                    heading: 'TIGHT & TONE (T&T)',
                    equipment: ['Light Ankle Weights', 'Gliders'],
                    description:
                        '<span style="font-size: .8rem; color: #524F4C;">Light ankle weights will have you working in a higher range of motion to tighten and tone from all angles. <br /> Equipment: Light Ankle Weights, Gliders</span>',
                    imageFileName: '21daybuttlift-tt.jpg',
                    duration: '38:00',
                },

                sf: {
                    heading: 'SCULPT & FIRM (S&F)',
                    equipment: ['Light Ankle Band', 'Gliders', 'P.mat'],
                    description:
                        '<span style="font-size: .8rem; color: #524F4C;">From standing to the mat, you’ll fire up the hard-to-reach muscles of the inner and outer glutes to bring out that desired definition. <br /> Equipment: Light Ankle Band, Gliders, P.mat</span>',
                    imageFileName: '21daybuttlift-sf.jpg',
                    duration: '31:00',
                },

                cooldown: {
                    imageFileName: '21daybuttlift-cooldown.jpg',
                    duration: '2:00',
                },
            },

            workoutFileNameMap: {
                warmup: 'bodi4453_21daybutt-626_957.mp4',
                ll: 'bodi4453_21daybutt-626_532.mp4',
                bt: 'bodi4453_21daybutt-626_700.mp4',
                sl: 'bodi4453_21daybutt-626_350.mp4',
                tt: 'bodi4453_21daybutt-626_803.mp4',
                sf: 'bodi4453_21daybutt-626_521.mp4',
                cooldown: 'bodi4453_21daybutt-626_244.mp4',
            },
        }
    },

    computed: {
        buttLiftData() {
            return this.userPreferences ? this.userPreferences.find(preference => preference.type === '21DayButtLift') : ''
        },

        buttLiftDataPreferenceID() {
            return this.buttLiftData && this.buttLiftData.id ? this.buttLiftData.id : ''
        },

        workoutColorMap() {
            return {
                sl: this.pvolveMintTitle,
                tt: this.pvolveBrown,
                sf: this.pvolvePink,
                bt: this.pvolveSalmon,
                ll: this.pvolveBlueGrey,
            }
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
        chooseNewDate() {
            this.showPartial = 'chooseDate'
        },

        goToMakeMyOwnWorkout() {
            this.showPartial = 'makeMyOwnWorkout'
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

        addWorkoutToList(workoutKey) {
            k('selectedCustomWorkouts: ', this.selectedCustomWorkouts)
            if (this.selectedCustomWorkouts.find(key => key === workoutKey)) {
                return
            }
            this.selectedCustomWorkouts.push(workoutKey)

            this.scrollIt('myCustomizedWorkout', false, 50)
        },

        removeWorkoutFromList(index) {
            this.selectedCustomWorkouts.splice(index, 1)
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
                userID: this.userInfo.userID,
                userLoginToken: this.userLoginToken,
                type: '21DayButtLift',
                environment: this.environment.name,
                advancedMode: this.advancedMode,
                startDate: this.moment(this.startDate).valueOf(), // set to what they chose in datepicker
            }
            k('saveStartDate req: ', req)

            this.saveUserPreferenceToAPI(this.buttLiftDataPreferenceID, req, () => {})
        },

        generateCalendarByStartDate() {
            k('generateCalendarByStartDate')

            this.displayCalendar = []

            let scheduleData = this.advancedMode ? this.advancedScheduleData : this.regularScheduleData
            let theDate

            for (let i = 0; i < 21; i++) {
                theDate = this.moment(this.startDate).add(i, 'days')

                this.displayCalendar[i] = {
                    theMonth: theDate.format('MMM'),
                    theDate: theDate.format('D'),
                    dayNumber: i + 1,
                    workouts: scheduleData[i],
                }

                if (this.displayCalendar[i].workouts[0] === 'rd') {
                    this.displayCalendar[i].style = 'background: #bdc2c9; color: #fff;'
                }

                // labels today's day in calendar
                if (this.moment(theDate).isSame(Date.now(), 'day')) {
                    // it's today
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

            if (!dayPlaylist.workouts.includes('warmup')) dayPlaylist.workouts.unshift('warmup')
            if (!dayPlaylist.workouts.includes('cooldown')) dayPlaylist.workouts.push('cooldown')

            let playlistJson = []

            dayPlaylist.workouts.forEach(workout => {
                k('workout code: ', workout)
                let workoutObj = {
                    chapterStartSeconds: 0,
                    chapterStartTimecode: '00:00:00',
                    displayName: this.workoutNameMap[workout],
                    fileName: this.workoutFileNameMap[workout],
                    originalFileName: this.workoutFileNameMap[workout],
                    remotePath: '/bodi4453_21daybutt-895/media/' + this.workoutFileNameMap[workout],
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
            k('setupCalendar: ', this.buttLiftData)

            if (this.buttLiftData && this.buttLiftData.startDate) {
                this.startDate = this.buttLiftData.startDate
                this.advancedMode = Boolean(this.buttLiftData.advancedMode)

                this.generateCalendarByStartDate()
            } else {
                // show date picker
                this.showPartial = 'chooseDate'
                this.showLoader = false
            }
        },

        toggleAdvancedMode() {
            // this.generateCalendarByStartDate();
            this.saveStartDate()
        },

        checkUserAccessToProduct() {
            let productInfo = this.environmentProducts.find(product => product.productID === this.productID)
            k('21 day productInfo: ', productInfo)
            this.$store.commit('setCurrentProduct', productInfo)

            // if user does not have access or product is not available, reroute
            if (!this.userHasAccess(this.brand.validSubscriptionProductIDs.concat([this.productID])) || !productInfo.webplayer) {
                this.route('/')
            } else {
                this.userHasAccessToProduct = true
                this.getShopifyProductDataIfNeeded();
            }
        },
    },

    created() {
        k('21 day butt lift data? ', this.userPreferences, this.buttLiftData)
        k('environmnetProducts? ', this.environmentProducts)

        if (this.environmentProducts) {
            this.checkUserAccessToProduct()
        }

        if (this.userPreferences) {
            // if they navigated here
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
            if (this.userPreferences) {
                // if they navigated here
                this.setUpCalendar()
            }
        },

        startDate() {
            kw('startDate chosen', this.moment(this.startDate).format('MMM DD'))
        },
    },

    beforeDestroy() {
        this.$store.commit('setCurrentChapter', '')
        this.$store.commit('setCurrentChapterIndex', '')
        this.sendCurrentMediaPlayEventIfExists() // send any remaining mediaplay event
    },
}
</script>

<style scoped>
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
    cursor: pointer;
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
    padding: 0.3rem;
}

.dayHeader {
    background: #8c909a;
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
