<template>

    <div id="pvolveNinetyDayChallenge" v-if="authenticated && validSubscription && userInChallenge" class="bg-grey-2" style="padding: 1rem;">
        <div class="well bg-white" style="padding: 0;">

            <div class="row">
                <div @click="showChallengeStatus = !showChallengeStatus" class="col-12" align="center" style="cursor: pointer; width: 100%; padding: 1rem;">
                    <h3 class="col-12 text-grey-8 thinHeader" style="margin: 0; line-height: 2rem;">
                        90 Day Challenge <span class="thickHeader">Status</span>
                        <q-icon :name="!showChallengeStatus ? 'fas fa-chevron-right' : 'fas fa-chevron-down'" style="font-size: 1.5rem; vertical-align: unset;" />
                    </h3>
                </div>

                <q-slide-transition>
                    <div class="row" v-if="showChallengeStatus" style="background: url(https://vault.platformpurple.com/static/clients/mypvolve/90DayChallenge_header.jpg); background-position: 80% 20%; background-size: cover; height: 100%; position: relative;">
                        <div class="col-12" style="background: rgba(255, 255, 255, 0.8);">
                            <div align="center" style="margin-bottom: 1rem; padding: 1rem;">

                                <h4 v-if="countdownTimeLeft" class="thickHeader" style="margin: 1rem 0; color: #524F4C; letter-spacing: 1px; line-height: 2rem;">challenge starts in <span :style="`color: ${pvolveMintBG};`">{{daysLeft}}</span> days, <span :style="`color: ${pvolveMintBG};`">{{hoursLeft}}</span> hours, <span :style="`color: ${pvolveMintBG};`">{{minutesLeft}}</span> minutes and <span :style="`color: ${pvolveMintBG};`">{{secondsLeft}}</span> seconds</h4>

                                <q-btn outline @click="openGuidelinesModal = true" class="monty" :style="`margin: .5rem 0; background: #fff !important; color: #545454; padding: .8rem 2rem;`">
                                    <h6 class="thickHeader" style="font-size: .8rem; letter-spacing: 1px;">view challenge info</h6>
                                </q-btn>
                            </div>

                            <q-inner-loading :visible="showLoader" />

                            <div v-if="challengeStatusData">

                                <div v-if="challengeStatusData.data" class="row justify-center" style="margin: -1rem; padding: 1rem;">

                                    <div v-for="(month, index) in contestMonths"  class="col-sm-12 col-md-4" style="padding: 1rem;">
                                        <div style="padding: .5rem; height: 100%; background: rgba(255, 255, 255, .7);">

                                            <div align="center">
                                                <h6 style="margin: .5rem 0; letter-spacing: 1px;">{{month.title}}</h6>
                                                <h6 style="margin: .5rem 0; font-size: .8rem; letter-spacing: 1px;">{{month.dateRangeTitle}}</h6>

                                                <div v-if="(month.data.length || 0) == 16" style="margin: 1rem 0;">
                                                    <q-icon name="fas fa-trophy" :style="`color: ${pvolveMintBG}; font-size: 2.5rem;`" />
                                                    <h5 v-html="month.completedMessage" />
                                                </div>

                                                <p class="monty" style="margin: 0; font-size: .8rem; letter-spacing: 1px;">Your Total Work Out Time: {{totalMinutesForUser(index) || 0}} mins</p>
                                                <p class="monty" style="margin: 0; font-size: .8rem; letter-spacing: 1px;">All Participants Average: {{averageMinutesForAllUsers(index) || 0}} mins</p>
                                            </div>

                                            <div style="padding: 1rem .5rem;" align="center">
                                                <q-progress animate stripe :percentage="(month.data.length / 16) * 100" :style="`height: 15px; color: ${pvolveMintBG};`" />
                                                <h6 style="font-size: .8rem; letter-spacing: 1px; margin: .25rem 0;">{{month.data.length || 0}} / 16 Complete</h6>
                                                <!--<h6 class="text-grey-8" style="font-size: .8rem; text-transform: none; margin: .5rem 0;">*Make sure to let your workout play all the way to the end to get credit! <br /> Day count includes planned rest days.</h6>-->
                                            </div>

                                            <div v-if="month.data.length" class="scroll" style="max-height: 20rem;">
                                                <table class="q-table bordered striped responsive monty" style="width: 100%;">
                                                    <thead>
                                                        <tr>
                                                            <th align="left">Date</th>
                                                            <th align="right">Completed Workout</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-if="item" v-for="(item, index) in month.data">
                                                            <td>
                                                                {{moment(item).format('M/DD/YYYY')}}
                                                            </td>
                                                            <td align="right">
                                                                <img :src="workoutCompleteImageSrc" style="max-width: 1rem;" />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <h6 class="text-grey-8" align="right" style="font-size: .8rem; text-transform: none; margin: .5rem;">*All dates are shown in EDT</h6>
                            </div>

                            <div v-else>
                                <h6 align="center" class="text-grey-8">No data yet.</h6>
                            </div>

                            <ninetyDayChallengeAfterOptIn />

                        </div>
                    </div>
                </q-slide-transition>

            </div>
        </div>

        <q-modal
            v-model="openGuidelinesModal"
            :content-css="{minWidth: '50vw', minHeight: '50vh'}"
        >
            <q-modal-layout>
                <q-toolbar slot="header" class="text-white" :style="`background: ${pvolveMintBG};`">
                    <div class="q-toolbar-title">
                        <h4>90 Day Challenge Info</h4>
                    </div>
                    <q-btn @click="openGuidelinesModal = false" flat round style="padding: .5rem;">
                        <q-icon name="fas fa-times" color="white" />
                    </q-btn>
                </q-toolbar>

                <ninetyDayChallengeGuidelines v-if="openGuidelinesModal" />
            </q-modal-layout>
        </q-modal>

    </div>

</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'

    import ninetyDayChallengeGuidelines from './ninetyDayChallengeGuidelines'
    import ninetyDayChallengeAfterOptIn from './ninetyDayChallengeAfterOptIn'

    export default {
        name: 'ninetyDayChallengeStatus',

        mixins: [pvolveColors, globalComputedData, userAndProductInfo],

        components: {
            ninetyDayChallengeGuidelines,
            ninetyDayChallengeAfterOptIn
        },

        data() {
            return {
                contestName: '90DayChallenge',
                userInChallenge: false,
                showLoader: false,
                showChallengeStatus: false,
                openGuidelinesModal: false,

                daysLeft: null,
                hoursLeft: null,
                minutesLeft: null,
                secondsLeft: null,

                challengeStatusData: '',
                challengeOverviewData: '',
                workoutCompleteImageSrc: 'https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/PLV010-17_PeachIcon_CMYK.png',

                contestMonths: [{
                    title: '30 Days',
                    dateRangeTitle: '(Jan 10 - Feb 8)',
                    displayTableTimestamp: 1547096400000,
                    filterDataTimestampFrom: 0,
                    filterDataTimestampTo: 1549670400000,
                    completedMessage: 'You completed Month 1! <br/> One step closer to your fitness transformation!',
                    data: null
                }, {
                    title: '60 Days',
                    dateRangeTitle: '(Feb 9 - Mar 10)',
                    displayTableTimestamp: 1549688400000,
                    filterDataTimestampFrom: 1549670400000,
                    filterDataTimestampTo: 1552262400000,
                    completedMessage: 'Month 2 complete! <br/> Over half way there! Keep up the great work.',
                    data: null
                }, {
                    title: '90 Days',
                    dateRangeTitle: '(Mar 11 - Apr 9)',
                    displayTableTimestamp: 1552280400000,
                    filterDataTimestampFrom: 1552262400000,
                    filterDataTimestampTo: 1554768000000,
                    completedMessage: 'CONGRATS! <br/> You completed the 90 Day Challenge!',
                    data: null
                }],

                averageMinutesForAllUsers(index) {
                    return this.challengeStatusData &&
                        this.challengeStatusData.totalSecondsPerPhaseForAllUsers &&
                        this.challengeStatusData.totalNumParticipants ? (Number(this.challengeStatusData.totalSecondsPerPhaseForAllUsers[index + 1] / this.challengeStatusData.totalNumParticipants ) / 60).toFixed(2) : ''
                },

                totalMinutesForUser(index) {
                    return this.challengeStatusData &&
                        this.challengeStatusData.data &&
                        this.challengeStatusData.data &&
                        this.challengeStatusData.data.totalSecondsPerPhase &&
                        Object.keys(this.challengeStatusData.data.totalSecondsPerPhase).length > 0 ? (Number(this.challengeStatusData.data.totalSecondsPerPhase[index+1]) / 60).toFixed(2) : ''
                },

                showMonth(month) {
                    let unixTimestamp = Number(this.moment().format('x'))
                    return unixTimestamp >= month.filterDataTimestampFrom
                }
            }
        },

        computed: {
            validSubscription() {
                k('validSubscription: ', this.brand.validSubscriptionProductIDs)
                return this.brand.validSubscriptionProductIDs ? this.userHasAccess(this.brand.validSubscriptionProductIDs) : false
            },

            countdownTimeLeft() {
                return this.daysLeft > -1 &&
                        this.hoursLeft > -1 &&
                        this.minutesLeft > -1 &&
                        this.secondsLeft > -1
            }

            // challengeProgress() {
            //     return (this.challengeStatusData.totalDaysCompletedWRestDays / 21) * 100
            // }
        },

        watch: {
            userInfo() {
                this.getUserPreferences(() => {})
            },

            userPreferences() {
                this.checkContestOptIn()
            },

            userInChallenge() {
                if (this.userInChallenge) {
                    this.getChallengeStatus()
                    // this.getCheekyChallengeOverview()
                }
            }
        },

        methods: {
            checkContestOptIn() {
                let contestOptIn = this.userPreferences.find((pref) => { return pref.contestName === this.contestName })
                k('contestOptIn: ', contestOptIn)

                if (contestOptIn) this.userInChallenge = true
            },

            getChallengeStatus() {
                this.showLoader = true

                this.api.get(`${this.api.apiv4Route}api/client/mypvolve/challengeUserCompletionResults?challengeName=${this.contestName}&userLoginToken=${this.userLoginToken}`, (res) => {
                    k('getChallengeStatus res: ', res)

                    if (res.success) {
                        this.challengeStatusData = res

                        if (this.challengeStatusData && this.challengeStatusData.data) {
                            for (let i = 0; i < this.contestMonths.length; i++) {
                                let month = this.contestMonths[i]
                                month.data = this.challengeStatusData.data.datesCompleted && this.challengeStatusData.data.datesCompleted.length ? this.challengeStatusData.data.datesCompleted.filter(date => {
                                    k('datesCompleted: ', date)
                                    let unixTimestamp = Number(this.moment(date).format('x'))
                                    return unixTimestamp >= month.filterDataTimestampFrom && unixTimestamp < month.filterDataTimestampTo
                                }) : []
                            }
                        }
                    }

                    this.showLoader = false
                })
            }
        },

        created() {
            k('ninetyDayChallengeStatus: ', this.validSubscription)

            this.countdown('01/10/2019 00:00:01 AM', (countdownStats) => {
                this.daysLeft = countdownStats.days
                this.hoursLeft = countdownStats.hours
                this.minutesLeft = countdownStats.minutes
                this.secondsLeft = countdownStats.seconds
            })

            if (this.userPreferences) {
                this.checkContestOptIn()

                k('userPreferences: ', this.userPreferences)
            }
            else {
                if (this.userInfo) this.getUserPreferences(() => {})
            }
        }
    }
</script>

<style scoped>
</style>
