<template>

    <div id="pvolveSetMyGoals" class="row bg-grey-2">
        <div class="well" style="padding: .5rem 1rem;">

            <div class="bg-white" @click="showGoals = !showGoals" align="center" style="cursor: pointer; width: 100%; padding: 1rem;">
                <h3 class="text-grey-8" style="margin: 0;">
                    <span class="thinHeader">set my </span> <span class="thickHeader" :style="`color: ${pvolveMintTitle};`">goals</span>
                    <q-icon :name="!showGoals ? 'fas fa-chevron-right' : 'fas fa-chevron-down'" style="font-size: 1.5rem; vertical-align: unset; margin-left: .5rem;" />
                </h3>
            </div>

            <q-slide-transition>
                <setMyGoals v-if="showGoals" :cardBackgroundColor="pvolveBlueGrey" :buttonBackgroundColor="pvolvePink" />
            </q-slide-transition>

        </div>

    </div>

</template>

<script>
    import setMyGoals from '../../common/showcase/setMyGoals'
    import { pvolveColors } from './pvolveColors'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['componentData'],

        components: {
            setMyGoals
        },

        mixins: [pvolveColors, userAndProductInfo, globalComputedData],

        data() {
            return {
                showGoals: false
            }
        }
    }
</script>

<style>

</style>
