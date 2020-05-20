<template>

    <div id="pvolveMyTransformation" class="row bg-grey-2" style="padding-bottom: 2rem;">
        <div class="well" style="padding: .5rem 1rem;">

            <div class="bg-white" @click="showTransformation = !showTransformation" align="center" style="cursor: pointer; width: 100%; padding: 1rem .5rem;">
                <h3 class="text-grey-8" style="margin: 0;">
                    <span class="thinHeader">my</span> <span class="" :style="`color: ${pvolveMintBG};`">transformation story</span>
                    <q-icon :name="!showTransformation ? 'fas fa-chevron-right' : 'fas fa-chevron-down'" style="font-size: 1.2rem; vertical-align: unset;" />
                </h3>
            </div>

            <q-slide-transition>
                <div>
                    <myTransformation v-if="showTransformation && !userInChallenge" :highlightColor="pvolveMintBG" :disclaimer="`* By posting, uploading, inputting, providing, or submitting photos, videos, text, images, or any other copyrightable work (together and individually, “Your Submission”), you grant to Pvolve LLC, its affiliated companies, and its licensees (collectively, “p.volve”) a non-exclusive and compensation-free license to use Your Submission in connection with the operation of their businesses, including, without limitation, the license to: reproduce, prepare derivative works from, distribute, transmit, publicly display, publicly perform, edit, translate, and reformat Your Submission. p.volve has the sole discretion whether to use and/or remove Your Submission. Your Submission includes a representation that your results, and Your Submission, are true and accurate, not altered in any way (e.g., by Photoshop), and have been achieved through your participation in the p.volve program.`" />

                    <ninetyDayChallengeTransformation v-if="showTransformation && userInChallenge" :highlightColor="pvolveMintBG" :disclaimer="`* By posting, uploading, inputting, providing, or submitting photos, videos, text, images, or any other copyrightable work (together and individually, “Your Submission”), you grant to Pvolve LLC, its affiliated companies, and its licensees (collectively, “p.volve”) a non-exclusive and compensation-free license to use Your Submission in connection with the operation of their businesses, including, without limitation, the license to: reproduce, prepare derivative works from, distribute, transmit, publicly display, publicly perform, edit, translate, and reformat Your Submission. p.volve has the sole discretion whether to use and/or remove Your Submission. Your Submission includes a representation that your results, and Your Submission, are true and accurate, not altered in any way (e.g., by Photoshop), and have been achieved through your participation in the p.volve program.`" />
                </div>
            </q-slide-transition>

        </div>

    </div>

</template>

<script>
    import myTransformation from '../../common/showcase/myTransformation'
    import ninetyDayChallengeTransformation from './ninetyDayChallengeTransformation'

    import { pvolveColors } from './pvolveColors'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['componentData'],

        components: {
            myTransformation,
            ninetyDayChallengeTransformation
        },

        mixins: [pvolveColors, userAndProductInfo, globalComputedData],

        data() {
            return {
                showTransformation: false,
                contestName: '90DayChallenge'
            }
        },

        computed: {
            userInChallenge() {
                return this.userPreferences ? this.userPreferences.find((pref) => { return pref.contestName === this.contestName }) : false
            }
        }
    }
</script>

<style>

</style>
