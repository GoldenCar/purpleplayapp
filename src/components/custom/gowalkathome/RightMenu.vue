<template>

    <div class="row justify-center">

        <q-btn class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToLibrary()" :style="`background: ${brand.brandColor}; color: #111;`">
            <q-icon name="fas fa-book-open" />
            <h6>Library</h6>
        </q-btn>

        <q-btn v-if="ydwSubscriber && !appOffline" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="$emit('navigate', '/yourdailywalk')" style="background: rgb(128, 200, 48);">
            <img src="https://f3r6v6t8.ssl.hwcdn.net/static/shopLogos/yourdailywalk.png" style="max-width: 100%; max-height: 2rem; margin: 0 .5rem;">

            <h6 class="text-white">Your Daily Walk</h6>
        </q-btn>

        <q-btn v-if="authenticated && !appOffline" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="refresh()" :style="`background: ${brand.brandColor}; color: #111;`">
            <q-icon name="fas fa-sync-alt" />
            <h6>Refresh Library</h6>
        </q-btn>

        <q-btn v-if="showExternalStorageOption" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="toggleExternalStorage()" :style="`background: ${brand.brandColor}; color: #111;`">
            <q-icon :name="useExternalStorage ? 'fas fa-check-circle' : 'fas fa-circle'" :color="useExternalStorage ? 'primary' : 'grey'" />
            <h6>Use External Storage</h6>
        </q-btn>

        <q-btn v-if="(downloadedProducts.length || productDownloadQueue.length) && !appOffline" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="toggleDownloadsOnly()" :style="`background: ${brand.brandColor}; color: #111;`">
            <q-icon :name="showDownloadsOnly ? 'fas fa-check-circle' : 'fas fa-circle'" color="white" :style="showDownloadsOnly ? `color: ${brand.brandColorSecondary};` : ''" />
            <h6>Show Downloads Only</h6>
        </q-btn>

        <q-btn v-if="!appOffline" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToAccount()" :style="`background: ${brand.brandColor}; color: #111;`">
            <q-icon name="fas fa-user" />
            <h6>Manage Account</h6>
        </q-btn>

        <q-btn v-if="!appOffline" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToSupport()" :style="`background: ${brand.brandColor}; color: #111;`">
            <q-icon name="fas fa-medkit" />
            <h6>Support</h6>
        </q-btn>

        <q-btn v-if="productDownloadQueue.length" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="clearQueue()" :style="`background: ${brand.brandColor}; color: #111;`">
            <q-icon name="fas fa-ban" />
            <h6>Clear Download Queue</h6>
        </q-btn>

        <q-btn class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="signout()" :style="`background: ${brand.brandColor}; color: #111;`">
            <q-icon name="fas fa-sign-out-alt" />
            <h6>Sign Out</h6>
        </q-btn>

    </div>

</template>

<script>
import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
import { mobileMenuTools } from '../../../mixins/mobileMenuTools'

export default {
    data() {
        return {}
    },

    mixins: [userAndProductInfo, mobileMenuTools],

    computed: {
        ydwSubscriberIDs() {
            return this.brand.validSubscriptionProductIDs
        },

        ydwSubscriber() {
            return this.environmentProducts
                ? this.environmentProducts.filter(product => {
                      return this.ydwSubscriberIDs.includes(product.productID)
                  }).length
                : ''
        },
    },

    methods: {},
}
</script>

<style scoped>
.menuButton {
    padding: 2rem;
    border: 1px solid #ccc;
}
</style>
