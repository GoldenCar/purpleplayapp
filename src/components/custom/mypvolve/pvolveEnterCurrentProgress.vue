<template>

    <div id="pvolveEnterCurrentProgress" class="row bg-grey-2">
        <div class="well" style="padding: 0.5rem 1rem;">

            <div class="bg-white" @click="showAssessment = !showAssessment" align="center" style="cursor: pointer; width: 100%; padding: 1rem;">
                <h3 class="text-grey-8" style="margin: 0;">
                    <span class="thinHeader">enter my </span> <span class="thickHeader" :style="`color: ${pvolveMintTitle};`"> current progress</span>
                    <q-icon :name="!showAssessment ? 'fas fa-chevron-right' : 'fas fa-chevron-down'" style="font-size: 1.5rem; vertical-align: unset; margin-left: .5rem;" />
                </h3>
            </div>

            <q-slide-transition>
                <enterCurrentProgress v-if="showAssessment" />
            </q-slide-transition>

        </div>

    </div>

</template>

<script>
    import enterCurrentProgress from '../../common/showcase/enterCurrentProgress'
    import { pvolveColors } from './pvolveColors'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['componentData'],

        components: {
            enterCurrentProgress
        },

        mixins: [pvolveColors, userAndProductInfo, globalComputedData],

        data() {
            return {
                showAssessment: false
            }
        }
    }
</script>

<style>

</style>
