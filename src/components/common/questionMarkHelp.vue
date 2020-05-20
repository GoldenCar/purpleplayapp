<template>
    
    <div class="relative-position">
        <q-btn size="sm" round class="bg-grey-3 showHelp" style="position: absolute; top: 0rem; right: 0rem; z-index: 99;" @click="showHelp = !showHelp">
            <q-icon :name="showHelp ? 'fas fa-times' : 'fas fa-question'" />
        </q-btn>

        <q-slide-transition>
            <div v-if="showHelp" class="col-12 bg-white" align="left" style="padding: 1rem;">
                <span v-html="helpContents"></span>
            </div>
        </q-slide-transition>
    </div>
    
</template>

<script>
    
    export default {
        props: ['componentData', 'helpContents'],

        data() {
            return {
                showHelp: false
            }
        },

        computed: {
            
        },

        methods: {
            
        },

        created() {
            
        }
    }
</script>

<style scoped>

</style>
