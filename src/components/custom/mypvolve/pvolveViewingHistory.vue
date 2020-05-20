<template>

    <div id="pvolveViewingHistory" v-if="authenticated && userActiveProducts.length" class="row bg-grey-2">
        <div class="well" style="padding: .5rem 1rem;">

            <div class="bg-white" @click="showMyViewingHistory = !showMyViewingHistory" align="center" style="cursor: pointer; width: 100%; padding: 1rem;">
                <h3 class="text-grey-8" style="margin: 0;">
                    <span class="thinHeader">my fitness </span> <span class="thickHeader" :style="`color: ${pvolveMintTitle};`">journal</span>
                    <q-icon :name="!showMyViewingHistory ? 'fas fa-chevron-right' : 'fas fa-chevron-down'" style="font-size: 1.5rem; vertical-align: unset; margin-left: .5rem;" />
                </h3>
            </div>

            <q-slide-transition>
                <myViewingHistory v-if="showMyViewingHistory" :highlightColor="pvolveMintTitle" />
            </q-slide-transition>

        </div>

    </div>

</template>

<script>
    import myViewingHistory from '../../common/showcase/myViewingHistory'
    import { pvolveColors } from './pvolveColors'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['componentData'],

        components: {
            myViewingHistory
        },

        mixins: [pvolveColors, userAndProductInfo, globalComputedData],

        data() {
            return {
                showMyViewingHistory: false
            }
        }
    }
</script>

<style>

</style>
