<template>

    <q-modal
      v-model="openModal"
      @show="showInner = true"
      @hide="showInner = false"
      :content-css="{minWidth: '80vw', minHeight: '80vh'}"
    >
        <q-modal-layout>

            <q-toolbar class="q-layout-header" color="grey" :style="toolbarStyle">
                <q-toolbar-title>
                <!--Preview-->
                </q-toolbar-title>
                <q-btn flat icon="fas fa-times" @click="openModal = false" style="padding: .5rem;" />
            </q-toolbar>

            <div v-if="showInner" :is="playerModalName" />

        </q-modal-layout>

    </q-modal>

</template>

<script>

    export default {

        props: ['componentData'],

        data() {
            return {
                openModal: false,
                showInner: false
            }
        },

        computed: {
            playerModalName() {
                return this.brand.hooks ? this.brand.hooks.productComplete : ''
            },

            environment() {
                return this.$store.state.environment
            },

            brandColor() {
                return this.brand ? this.brand.brandColor : ''
            },

            toolbarStyle() {
                return this.brandColor ? 'background: ' + this.brandColor + ' !important ;' : ''
            }
        },

        methods: {
            close() {
                this.openModal = false
            }
        },

        created() {
            this.$root.$on('openPlayerModal', (val) => {
                // k('event hub openPlayerModal: ', val)
                this.openModal = true
            })

            if (this.brand &&
                this.brand.hooks &&
                this.brand.hooks.productComplete) {
            //   k('OPEN PLAYER MODAL!')
              this.loadIt(this.brand.hooks.productComplete, 'custom/' + this.brand.environmentName + '/' + this.brand.hooks.productComplete)
            }
        },

        beforeDestroy() {

        }
    }
</script>

<style>

</style>
