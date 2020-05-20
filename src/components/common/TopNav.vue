<template>

    <q-toolbar :style="'background-color:' + (brand.topNavColor || brand.brandColor) + ' !important;'">
        <q-btn flat>
            <img :src="`statics/${brand.environmentName}/${brand.logoFileName}.png`" class="logo">
        </q-btn>

        <q-toolbar-title>
            <div class="monty gt-md" style="font-size: 1.4rem; font-weight: 700;">{{brand.appDisplayName}}</div>
        </q-toolbar-title>

        <!--<q-btn v-if="authenticated && firstName" flat>-->
        <!--    Hello, {{firstName}}!-->
        <!--</q-btn>-->

        <q-btn flat style="padding: .5rem;">
            <q-icon :name="appOffline ? 'fas fa-unlink' : 'fas fa-wifi'" :color="brand.topNavIconColor ? brand.topNavIconColor : 'white'" />
        </q-btn>

        <!-- <q-btn v-if="authenticated && goingTo === '/library'" flat @click="$root.$emit('toggleTagSidebar')" style="padding: .5rem; position: relative;">
            <q-icon name="fas fa-filter" :color="brand.topNavIconColor ? brand.topNavIconColor : 'white'" />

            <q-btn v-if="userSelectedTags.length" round size="xs" :style="`width: 1rem; height: 1rem; position: absolute; top: 0; right: 0;`"></q-btn>
        </q-btn> -->

        <q-btn v-if="authenticated && goingTo === '/library'" flat :class="searchbarSelected ? 'selected' : ''" @click="selectSearchbar()" style="padding: .5rem;">
            <q-icon name="fas fa-search" :color="brand.topNavIconColor ? brand.topNavIconColor : 'white'" />
        </q-btn>

        <q-btn v-if="authenticated && !goingTo.includes('/play') && !goingTo.includes('/signInUp')" flat @click="$emit('showSidebar')" style="padding: .5rem;">
            <q-icon name="fas fa-bars" :color="brand.topNavIconColor ? brand.topNavIconColor : 'white'" />
        </q-btn>
<!--
        <q-btn v-if="authenticated && goingTo.includes('/play')" flat small @click="openChaptersModal()">
            <q-icon name="fas fa-bookmark" :color="brand.topNavIconColor ? brand.topNavIconColor : 'white'" />
        </q-btn> -->

    </q-toolbar>

</template>

<script>
    export default {
        data() {
            return {
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
            }
        },

        created() {
            k('GOINGOTO: ', this.goingTo)
        },

        methods: {
            selectSearchbar() {
                this.searchbarSelected = !this.searchbarSelected
                this.$root.$emit('toggleSearchbar')
            }
        }
    }
</script>

<style scoped>
    .q-btn {
        padding: 0 .5rem;
    }

    .logo {
        max-height: 35px;
    }

    .selected {
        border-bottom: 2px white solid;
    }
</style>
