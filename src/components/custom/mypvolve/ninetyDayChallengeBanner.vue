<template>

    <div id="saleBanner" align="center" v-if="!userHidSaleBanner && challengeOrSaleIsLive && !contestOptIn && !forSubmission" :style="`background: ${pvolveMintBG}; position: relative; padding: .5rem; overflow: hidden;`">
        <a @click="openChallengeOptIn()" target="_blank">
            <h6 :style="`font-size: .75rem; color: #fff; padding: 0 1rem; letter-spacing: 1px; margin: 0;`">
                Turn your resolutions into evolutions with the <span class="thickHeader">90 Day Challenge</span>
            </h6>
        </a>

        <q-btn @click="hideSaleBanner" flat style="max-height: 25px; padding: 0 .5rem; position: absolute; top: -.2rem; right: 0;">
            <q-icon name="fas fa-times" style="color: #fff; font-size: .8rem; margin: 0;"/>
        </q-btn>
    </div>

</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { contestTools } from './contestTools'

    export default {
        mixins: [ pvolveColors, userAndProductInfo, contestTools ],

        data() {
            return {
                userHidSaleBanner: false,
                contestName: '90DayChallenge'
            }
        },

        computed: {
            authenticated() {
                return this.$store.state.user.authenticated
            },

            appOffline() {
                return this.$store.state.appOffline
            },

            forSubmission() {
                return window.forSubmission
            },

            challengeOrSaleIsLive() {
                let newYearsESTUnix = 1546318800000
                let challengeOptInEnd = 1549688400000
                k('challengeOrSaleIsLive: ', Date.now(), newYearsESTUnix, challengeOptInEnd, Date.now() > newYearsESTUnix && Date.now() < challengeOptInEnd)

                return Date.now() > newYearsESTUnix && Date.now() < challengeOptInEnd
            },

            previewUserInfo() {
                return this.$store.state.previewUserInfo
            },

            userLoginTokenParam() {
                return this.userLoginToken && this.userLoginToken !== this.previewUserInfo.userLoginToken ? '?userLoginToken=' + this.userLoginToken : ''
            }
        },

        methods: {
            openChallengeOptIn() {
                var link = `${this.brand.brandURL}offer/ninetyDayChallenge${this.userLoginTokenParam}`
                this.openWindow(link, "_blank");
            },

            hideSaleBanner() {
                this.userHidSaleBanner = true
                this.localStorage.set('userHidSaleBanner', true)
            }
        },

        watch: {
            userPreferences() {
                k('userPreferences watch: ', this.contestOptIn)
            }
        },

        created() {
            if (this.userPreferences) {

            } else {
                if (this.userInfo) {
                    this.getUserPreferences(() => {})
                }
            }

            this.userHidSaleBanner = this.localStorage.get('userHidSaleBanner')
        }
    }
</script>

<style scoped>

</style>
