<template>

    <div slot="footer" v-if="routesToShow.includes(goingTo) && environmentProducts" :style="`background: ${pvolveMintBG} !important;`">

        <q-tabs align="justify" position="bottom">
            <q-tab color="white" slot="title" @click.native="goToHome()">
                <q-icon name="fas fa-video" style="font-size: 1rem;" />
                <h6 class="text-white" style="font-size: .7rem; margin-bottom: 0;">Home</h6>
            </q-tab>
            <q-route-tab color="white" slot="title" to="/beginners">
                <q-icon name="fas fa-star" style="font-size: 1rem;" />
                <h6 class="text-white" style="font-size: .7rem; margin-bottom: 0;">Beginners</h6>
            </q-route-tab>
            <q-route-tab color="white" slot="title" to="/me">
                <q-icon name="fas fa-user" style="font-size: 1rem;" />
                <h6 class="text-white" style="font-size: .7rem; margin-bottom: 0;">/me</h6>
            </q-route-tab>
            <q-route-tab v-if="!appOffline && userAccessToAnyShelfItems" color="white" slot="title" to="/structuredProducts">
                <q-icon name="fas fa-dumbbell" style="font-size: 1rem;" />
                <h6 class="text-white" style="font-size: .7rem; margin-bottom: 0;">Plans</h6>
            </q-route-tab>
        </q-tabs>

    </div>

</template>

<script>
import { pvolveColors } from './pvolveColors'
import { globalComputedData } from '../../../mixins/globalComputedData'
import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
import { contentScheduleTools } from '../../../mixins/contentScheduleTools'

export default {
    props: ['componentData'],

    data() {
        return {
            userEmail: '',
            openOnboardingModal: false,
            routesToShow: [
                '/home',
                '/beginners',
                '/me',
                '/structuredProducts'
            ]
        }
    },

    mixins: [pvolveColors, globalComputedData, userAndProductInfo, contentScheduleTools],

    components: {

    },

    computed: {
        environmentProducts() {
            return this.$store.state.environmentProducts
        },

        appOffline() {
            return this.$store.state.appOffline
        },

        structuredProducts() {
            return this.environmentProducts ? this.environmentProducts.filter((product) => {
                return product.tags.includes('5763')
            }) : []
        },

        userAccessToAnyShelfItems() {
            return this.structuredProducts ? this.structuredProducts.filter((item) => { return this.userHasAccess([item.productID]) }).length : ''
        },

        contentSchedulePreferences() {
            return this.userPreferences ? this.userPreferences.filter((item) => {
                return item.type === 'contentSchedulePreferences'
            })[0] : ''
        },
    },

    methods: {
        automaticallyShowOnboarding() {
            k('automaticallyShowOnboarding? ', this.routesToShow.includes(this.goingTo), this.userPreferences)

            // if (this.routesToShow.includes(this.goingTo) && this.userPreferences) {
            //     let userHasSeenOnboarding = this.localStorage.get('userHasSeenOnboarding')
            //
            //     k('show onboarding? ', this.contentSchedulePreferences, userHasSeenOnboarding)
            //     if (!this.contentSchedulePreferences && !userHasSeenOnboarding) {
            //         this.route('/onboarding')
            //         this.localStorage.set('userHasSeenOnboarding', true)
            //     }
            // }
        },

        goToHome() {
            this.$store.commit('showDownloadsOnly', false)
            this.route('/home')
        }
    },

    watch: {
        userPreferences() {
            k('footer watch userPreferences: ', this.userPreferences)
            // this.automaticallyShowOnboarding()
        },

        goingTo() {
            this.automaticallyShowOnboarding()
        }
    },

    created() {
        k('init pvolveFooter')

        this.getUserPreferences(() => {
            this.automaticallyShowOnboarding()
        }, true)
    }
}
</script>

<style scoped>

</style>
