<template>
    <q-toolbar style="background: #fff !important; padding-left: 0; padding-bottom: 0; min-height: 60px;">
        <q-btn flat class="pvolveLogo" @click="goToHome()">
            <img :src="`statics/${brand.appName}/${brand.logoFileName}.png`">
        </q-btn>

        <q-toolbar-title>
            <!-- <div class="monty gt-md" style="font-size: 1.4rem; font-weight: 700;">{{brand.appDisplayName}}</div> -->
        </q-toolbar-title>

        <!--<q-btn v-if="authenticated && firstName" flat>-->
        <!--    Hello, {{firstName}}!-->
        <!--</q-btn>-->

        <q-btn v-if="appOffline" flat style="padding: .5rem;">
            <q-icon name="fas fa-unlink'" color="grey-9" />
        </q-btn>

        <q-btn v-if="!appOffline && authenticated && goingTo === '/library'" :class="tagFilterSelected ? 'selected' : ''" flat @click="selectTagFilter()" style="padding: .5rem; position: relative;">
            <q-icon name="fas fa-filter" color="grey-9" />

            <q-btn v-if="userSelectedTags.length" round size="xs" :style="`background: ${pvolveSalmon}; width: 1rem; height: 1rem; position: absolute; top: 0; right: 0;`"></q-btn>
        </q-btn>

        <q-btn v-if="authenticated && goingTo === '/library'" :class="searchbarSelected ? 'selected' : ''" flat @click="selectSearchbar()" style="padding: .5rem;">
            <q-icon name="fas fa-search" color="grey-9" />
        </q-btn>

        <q-btn v-if="authenticated && !goingTo.includes('/signInUp')" flat @click="showSidebar()" style="padding: .5rem;">
            <q-icon name="fas fa-bars" color="grey-9" />
        </q-btn>
<!--
        <q-btn v-if="authenticated && goingTo.includes('/play')" flat small @click="openChaptersModal()">
            <q-icon name="fas fa-bookmark" :color="brand.topNavIconColor ? brand.topNavIconColor : 'white'" />
        </q-btn> -->

    </q-toolbar>
</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'

    export default {
        mixins: [ pvolveColors, userAndProductInfo ],

        data() {
            return {
                tagFilterSelected: false,
                searchbarSelected: false
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

            userSelectedTags() {
                return this.$store.state.userSelectedTags
            },

            waitForMutationToExitMedia() {
                return this.$store.state.waitForMutationToExitMedia
            }
        },

        watch: {
            appOffline() {
                if (this.appOffline) this.route('/library')
            }
        },

        created() {
            k('GOINGOTO: ', this.goingTo)

            this.injection.injectCSSFileIntoDOM({
                id: 'mypvolveCSS',
                headOrBody: 'head',
                url: 'statics/mypvolve/mypvolve.css'
            })
        },

        methods: {
            selectTagFilter() {
                this.tagFilterSelected = !this.tagFilterSelected
                this.$root.$emit('toggleTagSidebar')
                window.scrollTo(0, 0);
            },

            selectSearchbar() {
                this.searchbarSelected = !this.searchbarSelected
                this.$root.$emit('toggleSearchbar')
            },

            showSidebar() {
                if (this.waitForMutationToExitMedia) return false
                this.$emit('showSidebar')
            },

            goToHome() {
                k('goToHome: ', this.goingTo)

                if (!this.appOffline && this.goingTo !== '/signInUp') {
                    this.$store.commit('showDownloadsOnly', false)
                    this.$router.push('/home')
                }
            }
        }
    }
</script>

<style scoped>
    .q-btn {
        padding: 0 .5rem;
    }

    .pvolveLogo {
        cursor: pointer;
        background-color: white;
        padding: 5px;
        min-height: 40px;
        max-width: 200px;
        clip-path: polygon(95% 0%, 0% 0%, 0% 100%, 100% 100%);
        -webkit-clip-path: polygon(95% 0%, 0% 0%, 0% 100%, 100% 100%);
    }

    .pvolveLogo img {
        max-height: 30px;
        margin: 0 .5rem;
        max-width: 100%;
        width: auto;
        display: block;
    }

    .selected {
        border-bottom: 2px white solid;
    }
</style>
