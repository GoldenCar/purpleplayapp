<template>

    <div style="background: #222; height: 100%;">
        <div class="row justify-center">

            <q-btn :class="`col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton ${$locale === 'ar' ? 'text-right' : ''}`" flat @click="$locale === 'en' ? $locale = 'ar' : $locale = 'en'">
                <q-icon name="fas fa-globe" />
                <h6 style="text-transform: none;">{{languages[$locale === 'en' ? 'ar' : 'en' ]}}</h6>
            </q-btn>

            <q-btn v-if="!appOffline" :class="`col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton ${$locale === 'ar' ? 'text-right' : ''}`" flat @click="openHelp()">
                <q-icon name="fas fa-question" />
                <h6 style="text-transform: none;">{{ $t('Help') }}</h6>
            </q-btn>

            <q-btn :class="`col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton ${$locale === 'ar' ? 'text-right' : ''}`" flat @click="route('/downloads'); $emit('close')">
                <q-icon name="fas fa-download" />
                <h6 style="text-transform: none;">{{ $t('downloads') }}</h6>
            </q-btn>

            <q-btn v-if="showExternalStorageOption" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton ${$locale === 'ar' ? 'text-right' : ''}" flat @click="toggleExternalStorage()">
                <q-icon :name="useExternalStorage ? 'fas fa-check-circle' : 'fas fa-circle'" :color="useExternalStorage ? 'primary' : 'grey'" />
                <h6>{{ $t('Use External Storage') }}</h6>
            </q-btn>

            <q-btn v-if="productDownloadQueue.length" :class="`col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton ${$locale === 'ar' ? 'text-right' : ''}`" flat @click="clearQueue()">
                <q-icon name="fas fa-ban" />
                <h6>{{$t('Clear Download Queue')}}</h6>
            </q-btn>

            <q-btn v-if="!appOffline" :class="`col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton ${$locale === 'ar' ? 'text-right' : ''}`" flat @click="route('/curriculumConnect'); $emit('close')">
                <q-icon name="fas fa-download" />
                <h6 style="text-transform: none;">Curriculum Connect</h6>
            </q-btn>

            <q-btn v-if="!appOffline" :class="`col-xs-12 col-sm-6 col-md-6 col-lg-4 menuButton ${$locale === 'ar' ? 'text-right' : ''}`" flat @click="route('/webEdTV'); $emit('close')">
                <q-icon name="fas fa-download" />
                <h6 style="text-transform: none;">WebEdTV</h6>
            </q-btn>

        </div>
    </div>

</template>

<script>

import { mobileMenuTools } from '../../../mixins/mobileMenuTools'

export default {

    data() {
        return {
            languages: {
                ar: 'العربي',
                en: 'English'
            }
        }
    },

    mixins: [mobileMenuTools],

    computed: {
        showExternalStorageOption() {
            k('showExternalStorageOption: ', this.isCordovaApp, this.platformID, this.externalStorageOptions, this.currentlyDownloading)

            return this.isCordovaApp && this.platformID == 'android' && this.externalStorageOptions.length && !this.currentlyDownloading
        }
    },

    methods: {
        openHelp() {
            window.open('https://ekbsupport.discoveryeducation.com/support', '_blank')
        },

        clearQueue() {
            this.clearDownloadQueue()
            this.$emit('close')
        }
    }
}
</script>

<style scoped>
    .menuButton {
        padding: 2rem;
        border: 1px solid #ccc;
        color: #444;
        background: #fff;
    }
</style>
