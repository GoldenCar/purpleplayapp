<template>

    <div id="pvolveMyProgress" class="row bg-grey-2">
        <div class="well" style="padding: .5rem 1rem;">

            <div class="bg-white" @click="showMyProgress = !showMyProgress" align="center" style="cursor: pointer; width: 100%; padding: 1rem;">
                <h3 class="text-grey-8" style="margin: 0;">
                    <span class="thinHeader">my </span> <span class="thickHeader" :style="`color: ${pvolveMintTitle};`">progress</span>
                    <q-icon :name="!showMyProgress ? 'fas fa-chevron-right' : 'fas fa-chevron-down'" style="font-size: 1.5rem; vertical-align: unset; margin-left: .5rem;" />
                </h3>
            </div>

            <q-slide-transition>
                <myProgress v-if="showMyProgress" :highlightColor="pvolveMintTitle" />
            </q-slide-transition>

        </div>

    </div>

</template>

<script>
    import myProgress from '../../common/showcase/myProgress'
    import { pvolveColors } from './pvolveColors'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['componentData'],

        components: {
            myProgress
        },

        mixins: [pvolveColors, userAndProductInfo, globalComputedData],

        data() {
            return {
                showMyProgress: false
            }
        }
    }
</script>

<style>

</style>
