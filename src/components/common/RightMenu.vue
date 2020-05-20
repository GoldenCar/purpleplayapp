<template>

    <div class="row justify-center bg-white">

        <q-btn class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToLibrary()">
            <q-icon name="fas fa-book-open" />
            <h6>Library</h6>
        </q-btn>

        <q-btn v-if="authenticated && !appOffline" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="refresh()">
            <q-icon name="fas fa-sync-alt" />
            <h6>Refresh Library</h6>
        </q-btn>

        <q-btn v-if="showExternalStorageOption" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="toggleExternalStorage()">
            <q-icon :name="useExternalStorage ? 'fas fa-check-circle' : 'fas fa-circle'" :color="useExternalStorage ? 'primary' : 'grey'" />
            <h6>Use External Storage</h6>
        </q-btn>
<!-- 
        <q-btn v-if="(downloadedProducts.length || productDownloadQueue.length) && !appOffline" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="toggleDownloadsOnly()">
            <q-icon name="fas fa-download" />
            <h6>Show Downloads Only</h6>
        </q-btn> -->

        <q-btn v-if="!appOffline" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToAccount()">
            <q-icon name="fas fa-user" />
            <h6>Manage Account</h6>
        </q-btn>

        <q-btn v-if="!appOffline" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="goToSupport()">
            <q-icon name="fas fa-medkit" />
            <h6>Support</h6>
        </q-btn>

        <q-btn v-if="productDownloadQueue.length" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="clearQueue()">
            <q-icon name="fas fa-ban" />
            <h6>Clear Download Queue</h6>
        </q-btn>

        <q-btn class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton" flat @click="signout()">
            <q-icon name="fas fa-sign-out-alt" />
            <h6>Sign Out</h6>
        </q-btn>

    </div>

</template>

<script>
    import { userAndProductInfo } from '../../mixins/userAndProductInfo'
    import { mobileMenuTools } from '../../mixins/mobileMenuTools'

    export default {
        data() {
            return {

            }
        },

        mixins: [ userAndProductInfo, mobileMenuTools ],

        computed: {

        },

        methods: {

        }
    }

</script>

<style scoped>
    .menuButton {
        padding: 2rem;
        border: 1px solid #fff;
        background: #efefef;
    }
</style>
