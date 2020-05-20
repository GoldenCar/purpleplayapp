<template>

    <div>
        <q-toolbar class="bg-white navbar">

            <q-btn flat @click="route('/')" style="padding: 0;">
                <img class="logo-icon logo-icon--small" src="statics/ekb/logo-small.png" />
            </q-btn>

            <q-btn flat style="border-right: 1px solid #ddd; padding: 0;">
                <q-icon v-if="appOffline" color="black" name="wifi_off" />
                <q-icon v-else color="black" name="wifi" />
            </q-btn>

            <q-toolbar-title>
                <search
                    v-if="windowWidth > 500"
                    :value="searchValue"
                    v-on:update:value="updataSearchValue" />
            </q-toolbar-title>

            <q-btn flat v-if="windowWidth > 1150 && !appOffline" @click="route('/downloads')" style="text-transform: none; padding: 0 .5rem; border-right: 1px solid #ddd; color: #000;">
                {{ $t('downloads') }}
            </q-btn>

            <q-btn flat v-if="windowWidth > 1150 && !appOffline" @click="route('/curriculumConnect')" style="text-transform: none; padding: 0 .5rem; border-right: 1px solid #ddd; color: #000;">
                Curriculum Connect
            </q-btn>

            <q-btn flat v-if="windowWidth > 1150 && !appOffline" @click="route('/webEdTV')" style="text-transform: none; padding: 0 .5rem; border-right: 1px solid #ddd; color: #000;">
                WebEdTV
            </q-btn>

            <q-btn flat class="gt-sm" color="black" @click="changeLocale()" style="border-right: 1px solid #ddd; padding: 0 .5rem;">
                <q-icon name="fas fa-globe" />
                {{ languages[$locale === 'en' ? 'ar' : 'en' ] }}
            </q-btn>

            <q-btn flat v-if="!appOffline" class="gt-sm" color="black" @click="openHelp" style="border-right: 1px solid #ddd; padding: 0 .5rem;">
                <q-icon name="fas fa-question" />
            </q-btn>

            <q-btn flat v-if="$q.platform.is.electron" class="gt-sm" color="black" @click="$store.commit('toggleSettingsModal')" style="border-right: 1px solid #ddd; padding: 0 .5rem;">
                <q-icon name="fas fa-cog" />
            </q-btn>

            <q-btn
                v-if="windowWidth <= 500"
                color="black"
                flat
                @click="searchOpen = !searchOpen"
                style="border-right: 1px solid #ddd; border-left: 1px solid #ddd; padding: .5rem;"
            >
                <q-icon name="fas fa-search"/>
            </q-btn>

            <q-btn
                color="black"
                v-if="windowWidth < 1150"
                flat
                @click="$emit('showSidebar')"
                style="padding: 0 .5rem;"
            >
                <q-icon name="fas fa-bars"/>
            </q-btn>

        </q-toolbar>

        <q-toolbar v-if="$q.platform.is.electron && Boolean(productDownloadQueue.length)" style="background: #fff !important; pading: .5rem; min-height: 30px; border-top: 1px solid #ccc;">
            <q-toolbar-title>
            </q-toolbar-title>
            <q-btn flat size="sm" @click="clearQueue()" style="color: #000;">
                <q-icon name="fas fa-ban" />
                {{$t('Clear Download Queue')}}
            </q-btn>
        </q-toolbar>

        <search
            v-if="windowWidth <= 500 && searchOpen"
            :value="searchValue"
            v-on:update:value="updataSearchValue"
            class="expandable-search"
            style="width: 100%;"
            @closeSearchBar="searchOpen = false" />
    </div>

</template>

<script>
import Search from 'components/custom/discoveryekb/Search'

import { Platform } from 'quasar'
let shell;
if (Platform.is.electron) {
    shell = require('electron').shell
}


export default {
    components: {
        Search
    },

    data() {
        return {
            version() {
                return vNumber()
            },

            languages: {
                ar: 'العربي',
                en: 'English'
            },
            menuOpen: false,
            searchOpen: false,
            searchValue: '',
        }
    },

    computed: {
        authenticated() {
            return this.$store.state.user.authenticated
        },

        goingTo() {
            return this.$store.state.goingTo
        },

        firstName() {
            return this.$store.state.user.info.firstName
        },

        videoIsPlaying() {
            return this.$store.state.currentlyPlayingVideo
        },

        appOffline() {
            return this.$store.state.appOffline
        },

        isApp() {
            return this.$q.platform.is.cordova || this.$q.platform.is.electron
        },

        windowWidth() {
            return this.$store.state.windowWidth
        },

        productDownloadQueue() {
            return this.$store.state.productDownloadQueue
        },
    },

    watch: {
        // searchOpen() {
        //     if (this.searchOpen) {
        //         this.menuOpen = false
        //     }
        // },
        // menuOpen() {
        //     if (this.menuOpen) {
        //         this.searchOpen = false
        //     }
        // },
        // windowWidth (newWidth) {
        //     if (newWidth >= 1250) {
        //         this.menuOpen = false
        //     }
        // },

        appOffline() {
            if (this.appOffline) this.route('/downloads')
        }
    },

    created() {
        k('GOINGOTO: ', this.goingTo)

        this.injection.injectCSSFileIntoDOM({
            id: 'ekbCSS',
            headOrBody: 'head',
            url: 'statics/ekb/ekb.css'
        })
    },

    methods: {
        openHelp() {
            if (this.$q.platform.is.electron) {
                shell.openExternal('https://ekbsupport.discoveryeducation.com/support');
            } else {
                window.open('https://ekbsupport.discoveryeducation.com/support', '_blank')
            }
        },

        changeLocale() {
            this.$locale === 'en' ? this.$locale = 'ar' : this.$locale = 'en'
        },

        updataSearchValue(newValue) {
            this.searchValue = newValue;
        },

        clearQueue() {
            this.clearDownloadQueue()
        }
    }
}
</script>

<style scoped>
    .logo-icon {
        cursor: pointer;
    }

    .logo-icon.logo-icon--offline {
        max-width: 250px;
        max-height: 45px;
    }

    .logo-icon.logo-icon--small {
        max-width: 120px;
        max-height: 45px;
    }

    .hamburger-menu-items {
    }

    .hamburger-menu-items > .q-item {
        cursor: pointer;
    }

    .expandable-search.search {
        background-color: #fff;
        min-height: 50px;
        border-top: 1px solid #ddd;
    }
</style>
