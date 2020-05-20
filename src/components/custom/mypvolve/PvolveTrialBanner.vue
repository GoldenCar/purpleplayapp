<template>
    <div id="trialBanner" align="center" v-if="showUserStatusBanner" :style="`background: ${pvolveBlueGrey}; position: relative; padding: .5rem; overflow: hidden;`">
        <h6 v-if="userIsOnTrial" style="font-size: .75rem; color: white; padding: 0 1rem; margin: 0; letter-spacing: 1px;">
            <template v-if="trialDaysLeft > -1">
                You have {{trialDaysLeft}} days left in your trial.
            </template>
            <template v-else>
                Your trial has ended :(. Hope you have enjoyed the P.volve experience and choose to become a subscriber!
            </template>
        </h6>

        <q-btn @click="hideTrialBanner" flat style="max-height: 25px; padding: 0 .5rem; position: absolute; top: -.2rem; right: 0;">
            <q-icon name="fas fa-times" color="white" style="font-size: .8rem; margin: 0;"/>
        </q-btn>
    </div>
</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'

    export default {
        mixins: [ pvolveColors, userAndProductInfo ],

        data() {
            return {
                userHidTrialBanner: false
            }
        },

        computed: {
            authenticated() {
                return this.$store.state.user.authenticated
            },

            appOffline() {
                return this.$store.state.appOffline
            },

            showUserStatusBanner() {
                return this.mostRecentUserSubscriptionProductStatusHistory && this.userIsOnTrial && !this.userHidTrialBanner
            },

            userSubscriptionProductStatusHistory() {
                return this.$store.state.userSubscriptionProductStatusHistory
            },

            mostRecentUserSubscriptionProductStatusHistory() {
                return this.userSubscriptionProductStatusHistory && this.userSubscriptionProductStatusHistory.length ? this.userSubscriptionProductStatusHistory[0] : ''
            },

            // specialAccessUser() {
            //     return this.mostRecentUserSubscriptionProductStatusHistory &&
            //     (this.mostRecentUserSubscriptionProductStatusHistory.freeAccess || this.mostRecentUserSubscriptionProductStatusHistory.accessType === 'freeAccess') &&
            //     this.mostRecentUserSubscriptionProductStatusHistory.accessStatus === 'ownedAccess'
            // },

            userIsOnTrial() {
                return this.mostRecentUserSubscriptionProductStatusHistory && this.mostRecentUserSubscriptionProductStatusHistory.accessType === 'freeTrialAccess'
            },

            // userIsSubscribed() {
            //     return this.mostRecentUserSubscriptionProductStatusHistory &&
            //     !this.mostRecentUserSubscriptionProductStatusHistory.freeAccess &&
            //     this.mostRecentUserSubscriptionProductStatusHistory.accessStatus === 'subscriptionAccess'
            // },
            //
            // userSubscriptionHasExpired() {
            //     return this.mostRecentUserSubscriptionProductStatusHistory &&
            //     this.mostRecentUserSubscriptionProductStatusHistory.accessStatus === 'inactive'
            // },

            trialDaysLeft() {
                let daysLeft = 0
                if (this.mostRecentUserSubscriptionProductStatusHistory) {

                    let endDateUnix = null
                    if (this.mostRecentUserSubscriptionProductStatusHistory.accessStatus === 'subscriptionAccess') {
                        endDateUnix = this.moment(this.mostRecentUserSubscriptionProductStatusHistory.nextBillingDate).format('x')
                    }
                    if (this.mostRecentUserSubscriptionProductStatusHistory.accessStatus === 'rentalAccess') {
                        endDateUnix = this.moment(this.mostRecentUserSubscriptionProductStatusHistory.endDateTime).format('x')
                    }

                    let currentUnix = this.moment().format('x')

                    // test trial ended with current trial user
                    // daysLeft = ((currentUnix - endDateUnix) / 1000 / 60 / 60 / 24).toFixed(0)

                    var dayCalc = Math.floor(((endDateUnix - currentUnix) / 1000 / 60 / 60 / 24)).toFixed(0)
                    daysLeft = dayCalc > 0 ? dayCalc : 0
                    k('trialDaysLeft: ', this.mostRecentUserSubscriptionProductStatusHistory, endDateUnix, currentUnix, daysLeft)
                }
                return daysLeft
            }
        },

        watch: {

            authenticated() {
                if (!this.appOffline && this.authenticated && this.userLoginToken) this.getUserSubscriptionProductStatusHistory()
            },

            userSubscriptionProductStatusHistory() {
                k('topNav mostRecentUserSubscriptionProductStatusHistory: ', this.mostRecentUserSubscriptionProductStatusHistory)
                k('topNav userIsOnTrial: ', this.userIsOnTrial)
                k('topNav userIsSubscribed: ', this.userIsSubscribed)
                k('topNav userHidTrialBanner: ', this.userHidTrialBanner)
                k('topNav userHidReferAFriendBanner: ', this.userHidReferAFriendBanner)
            }
        },

        created() {
            if (!this.appOffline && this.authenticated && this.userLoginToken) this.getUserSubscriptionProductStatusHistory()

            // this.userHidTrialBanner = this.localStorage.get('userHidTrialBanner')
        },

        methods: {
            hideTrialBanner() {
                this.userHidTrialBanner = true
                // this.localStorage.set('userHidTrialBanner', true)
            }
        }
    }
</script>

<style scoped>

</style>
