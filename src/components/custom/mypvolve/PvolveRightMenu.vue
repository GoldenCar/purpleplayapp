<template>

    <div class="row">

        <q-btn v-if="!appOffline" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToHome()">
            <q-icon name="fas fa-home" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">Home</h6>
        </q-btn>

        <q-btn v-if="!appOffline" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToTutorials()">
            <q-icon name="fas fa-star" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">Beginner</h6>
        </q-btn>
<!--
        <q-btn class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToLibrary()">
            <q-icon name="fas fa-video" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">Library</h6>
        </q-btn> -->

        <q-btn v-if="!appOffline" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="$emit('navigate', '/me')">
            <q-icon name="fas fa-user" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">/me</h6>
        </q-btn>

        <q-btn v-if="!appOffline && userAccessToAnyShelfItems" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToStructuredProducts()">
            <q-icon name="fas fa-dumbbell" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">Workout Plans By P.</h6>
        </q-btn>

        <q-btn class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToPrinciples()">
            <q-icon name="fas fa-question" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">P.rinciples</h6>
        </q-btn>

        <q-btn v-if="authenticated && !appOffline" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="refresh()">
            <q-icon name="fas fa-sync-alt" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">Refresh</h6>
        </q-btn>

        <q-btn v-if="authenticated && !appOffline && !forSubmission" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToReferAFriend()">
            <q-icon name="fas fa-users" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">Refer A Friend</h6>
            <div class="pchip" :style="`margin-left: .5rem; color: #fff; background: ${pvolveMintBG} !important;`"><h6 style="margin: 0; font-size: .9rem; letter-spacing: 1px;">Get $30</h6></div>
        </q-btn>

        <q-btn v-if="showExternalStorageOption" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="toggleExternalStorage()">
            <q-icon :name="useExternalStorage ? 'fas fa-check-circle' : 'fas fa-circle'" :color="useExternalStorage ? 'primary' : 'grey'" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">Use External Storage</h6>
        </q-btn>

        <q-btn v-if="(downloadedProducts.length || productDownloadQueue.length) && !appOffline" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="toggleDownloadsOnly()">
            <q-icon name="fas fa-download" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">Show Downloads Only</h6>
        </q-btn>

        <q-btn v-if="productDownloadQueue.length" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="clearQueue()">
            <q-icon name="fas fa-ban" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">Clear Download Queue</h6>
        </q-btn>

        <q-btn v-if="!appOffline && !forSubmission" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToAccount()">
            <q-icon name="fas fa-user-circle" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">Manage Account</h6>
        </q-btn>

        <q-btn v-if="!appOffline && !forSubmission" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToBlog()">
            <q-icon name="fas fa-book-open" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">Blog</h6>
        </q-btn>

        <q-btn v-if="!appOffline && !forSubmission" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToStudioSignUps()">
            <q-icon name="fas fa-sign-in-alt" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">Studio Signups</h6>
        </q-btn>

        <q-btn v-if="!appOffline && !forSubmission" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToSupport()">
            <q-icon name="fas fa-question" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">Help</h6>
        </q-btn>

        <q-btn v-if="!appOffline && !forSubmission" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToPress()">
            <q-icon name="fas fa-newspaper" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">Press</h6>
        </q-btn>

        <q-btn v-if="!appOffline && !forSubmission" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToPball()">
            <q-icon name="fas fa-caret-right" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">P.ball</h6>
        </q-btn>

        <q-btn v-if="!appOffline && !forSubmission" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToPband()">
            <q-icon name="fas fa-caret-right" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">P.band</h6>
        </q-btn>

        <q-btn v-if="!appOffline && !forSubmission" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToEvents()">
            <q-icon name="fas fa-calendar-alt" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">Events</h6>
        </q-btn>

        <q-btn v-if="!appOffline && !forSubmission" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToHashPvolve()">
            <q-icon name="fas fa-hashtag" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">pvolve</h6>
        </q-btn>

        <q-btn v-if="!appOffline && !forSubmission" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToFBPvolve()">
            <q-icon name="fab fa-facebook" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">Pvolve</h6>
        </q-btn>

        <q-btn class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="signout()">
            <q-icon name="fas fa-sign-out-alt" style="font-size: .9rem;" />
            <h6 style="font-size: .9rem; letter-spacing: 1px;">Sign Out</h6>
        </q-btn>

    </div>

</template>

<script>
import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
import { pvolveColors } from './pvolveColors'
import { mobileMenuTools } from '../../../mixins/mobileMenuTools'

export default {
    data() {
        return {}
    },

    mixins: [userAndProductInfo, pvolveColors, mobileMenuTools],

    computed: {
        structuredProducts() {
            return this.environmentProducts
                ? this.environmentProducts.filter(product => {
                      return product.tags.includes('5763')
                  })
                : []
        },

        forSubmission() {
            return window.forSubmission
        },

        userAccessToAnyShelfItems() {
            return this.structuredProducts.filter(item => {
                return this.userHasAccess([item.productID])
            }).length
        },

        previewUserInfo() {
            return this.$store.state.previewUserInfo
        },

        userLoginTokenParam() {
            return this.userLoginToken && this.userLoginToken !== this.previewUserInfo.userLoginToken ? '?userLoginToken=' + this.userLoginToken : ''
        }
    },

    created() {},

    methods: {
        refresh() {
            this.getUserActiveProductsForEnvironment((res) => {})
            this.getUserPreferences(() => {}, true)
            this.$emit('navigate', '/home')
        },

        goToPrinciples() {
            this.$emit('navigate', '/principles')
        },

        goToTutorials() {
            this.$store.commit('showDownloadsOnly', false)
            this.$emit('navigate', '/beginners')
        },

        goToStudioSignUps() {
            this.$emit('close')
            var link = 'https://www.pvolve.com/pages/pvolve-studio'
            this.openWindow(link, '_blank')
        },

        goToBlog() {
            this.$emit('close')
            var link = 'https://www.pvolve.com/blogs/all'
            this.openWindow(link, '_blank')
        },

        goToPress() {
            this.$emit('close')
            var link = 'https://www.pvolve.com/pages/press'
            this.openWindow(link, '_blank')
        },

        goToEvents() {
            this.$emit('close')
            var link = 'https://www.eventbrite.com/o/pvolve-15668496053'
            this.openWindow(link, '_blank')
        },

        goToHashPvolve() {
            this.$emit('close')
            var link = 'https://www.pvolve.com/pages/pvolve'
            this.openWindow(link, '_blank')
        },

        goToPball() {
            this.$emit('close')
            var link = 'https://www.pvolve.com/pages/pball'
            this.openWindow(link, '_blank')
        },

        goToPband() {
            this.$emit('close')
            var link = 'https://www.pvolve.com/pages/pband'
            this.openWindow(link, '_blank')
        },

        goToReferAFriend() {
            this.$emit('close')
            var link = `${this.brand.brandURL}referAFriend${this.userLoginTokenParam}`
            this.openWindow(link, "_blank");
            // window.location.href = link
        },

        goToFBPvolve() {
            this.$emit('close')
            var scheme

            if(device.platform === 'iOS') {
                scheme = 'fb://'
            }
            else if(device.platform === 'Android') {
                scheme = 'com.facebook.katana'
            }

            appAvailability.check(
                scheme,
                () => {
                    // facebook app is available
                    const link = this.platformID === "android" ? "fb://group/216357882428108" : "fb://group/?id=216357882428108"
                    this.openWindow(link, "_system")
                },
                () => {
                    // facebook app not available
                    this.openWindow('https://www.facebook.com/groups/pvolvestreamersgroup/', '_blank')
                }
            )
        },

        goToStructuredProducts() {
            this.$emit('navigate', '/structuredProducts')
        },

        goToSupport() {
            this.$emit('navigate', '/help')
        },
    },
}
</script>

<style scoped>
.menuButton {
    padding: 2rem;
    border: .5px solid #eee;
    color: #333;
    background: #fff;
}

.pchip {
    /* width: fit-content; */
    color: #fff;
    background: #fff;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    margin: 0;
}
</style>
