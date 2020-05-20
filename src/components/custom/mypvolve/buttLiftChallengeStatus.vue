<template>

    <div v-if="authenticated && validSubscription && userInChallenge" class="bg-grey-2" style="padding: 1rem 1rem 0 1rem;">

        <div class="row well" style="background: url(https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/PLV078-18-Cheeky-Challenge_Topbanner.png) 50% center / cover no-repeat; height: 100%; padding: 0;">
            <div class="col-12" style="background: rgba(255, 255, 255, 0.85); padding: 2rem;">
                <h2 align="center" class="col-12 text-grey-8 thinHeader" style="margin-bottom: 1rem;">21 Day Butt Lift Challenge <span class="thickHeader">Status</span></h2>

                <q-inner-loading :visible="showLoader" />

                <div v-if="challengeStatusData" style="max-width: 40rem; margin: 0 auto;">

                    <h6 class="text-grey-8" align="center" style="margin: .5rem 0;">Total Challenge Participants: <span :style="`color: ${pvolveSalmon}; font-size: 1.5rem;`">{{challengeStatusData.totalNumParticipants}}</span></h6>

                    <h6 class="text-grey-8" align="center" style="margin: .5rem 0;">Average Days Completed For Participants: <span :style="`color: ${pvolveSalmon}; font-size: 1.5rem;`">{{(challengeStatusData.totalDaysCompletedForAllUsers / challengeStatusData.totalNumParticipants).toFixed(0)}}</span></h6>

                    <h6 class="text-grey-8" align="center" style="margin-top: 1rem;">You have completed <span :style="`color: ${pvolveSalmon}; font-size: 1.5rem;`">{{challengeStatusData.data.length}} / 21</span> workouts!</h6>

                    <div style="padding: 1rem .5rem;" align="center">
                        <q-progress animate stripe :percentage="challengeProgress" :style="`height: 15px; color: ${pvolveMintTitle};`" />
                        <h6 class="text-grey-8" style="font-size: .8rem; text-transform: none; margin: .5rem 0;">*Make sure to let your workout play all the way to the end to get credit!</h6>
                    </div>

                    <div style="border-bottom: 1px solid #ccc; margin: .5rem;"></div>

                    <div class="scroll" style="max-height: 20rem;">
                        <table class="q-table bordered striped responsive monty" style="width: 100%;">
                            <thead>
                                <tr>
                                    <th align="left">Date</th>
                                    <th align="right">Completed Workout</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="item" v-for="(item, index) in challengeStatusData.data">
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

                    <h6 class="text-grey-8" align="right" style="font-size: .8rem; text-transform: none; margin: .5rem 0;">*All dates are shown in EDT</h6>
                </div>

                <div v-else>
                    <h6 align="center" class="text-grey-8">No data yet.</h6>
                </div>
            </div>
        </div>

    </div>

</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'

    export default {
        name: 'cheekyChallengeAd',

        mixins: [ pvolveColors, globalComputedData, userAndProductInfo ],

        components: {

        },

        data () {
            return {
                contestName: '21DayButtLift',
                userInChallenge: false,
                showLoader: false,
                challengeStatusData: '',
                challengeOverviewData: '',
                workoutCompleteImageSrc: 'https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/PLV010-17_PeachIcon_CMYK.png'
            }
        },

        computed: {
            validSubscription() {
                k('validSubscription: ', this.brand.validSubscriptionProductIDs)
                return this.brand.validSubscriptionProductIDs ? this.userHasAccess(this.brand.validSubscriptionProductIDs) : false
            },

            challengeProgress() {
                return (this.challengeStatusData.data.length / 21) * 100
            }
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
                let contestOptIn = this.userPreferences ? this.userPreferences.find((pref) => { return pref.contestName === this.contestName }) : ''
                k('contestOptIn: ', contestOptIn)

                if (contestOptIn) this.userInChallenge = true
            },

            getChallengeStatus() {
                this.showLoader = true
                
                this.api.get(`${this.api.apiv4Route}api/client/mypvolve/challengeUserCompletionResults?challengeName=${this.contestName}&userLoginToken=${this.userLoginToken}`, (res) => {
                    k('getChallengeStatus res: ', res)

                    if (res.success) {
                        this.challengeStatusData = res
                    }

                    this.showLoader = false
                })
            },

            getCheekyChallengeOverview() {
                this.api.get(`${this.api.apiv4Route}api/client/mypvolve/cheekyChallengeOverviewAvg`, (res) => {
                    k('getCheekyChallengeOverview res: ', res)

                    if (res.success) {
                        this.challengeOverviewData = res
                    }
                })
            }
        },

        created() {
            k('buttLiftChallengeStatus: ', this.validSubscription)

            if (this.userPreferences) {
                this.checkContestOptIn()
            } else {
                if (this.userInfo) this.getUserPreferences(() => {})
            }
        }
    }
</script>

<style scoped>

</style>
