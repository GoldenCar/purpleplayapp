<template>
    <div>
<!--
        <PvolveTrialBanner />
        <ninetyDayChallengeBanner /> -->

        <div id="pvolveStructuredProductsHome" class="bg-white">
            <div align="center" style="margin-top: 2rem;">
                <h2 class="text-grey-9" >P's structured plans</h2>
            </div>

            <div class="row well" style="margin-top: 2rem; padding: 0 1rem;">
                <h6 style="text-transform: uppercase;"><img :src="levelImageSrc('beginner')" style="max-width: 3rem; vertical-align: bottom; margin: -0.5rem 0;" /> Beginner Programs</h6>
            </div>

            <pvolveStructuredProducts :componentData="beginnerStructuredProductComponentData" />

            <div class="row well" style="margin-top: 2rem; padding: 0 1rem;">
                <h6 style="text-transform: uppercase;"><img :src="levelImageSrc('intermediate')" style="max-width: 3rem; vertical-align: bottom; margin: -0.5rem 0;" /> intermediate programs</h6>
            </div>

            <pvolveStructuredProducts :componentData="intermediateStructuredProductComponentData" />

            <div class="row well" style="margin-top: 2rem; padding: 0 1rem;">
                <h6 style="text-transform: uppercase;"><img :src="levelImageSrc('advanced')" style="max-width: 3rem; vertical-align: bottom; margin: -0.5rem 0;" /> advanced programs</h6>
            </div>

            <pvolveStructuredProducts :componentData="advancedStructuredProductComponentData" />

        </div>
    </div>

</template>

<script>
    import pvolveStructuredProducts from './pvolveStructuredProducts'
    import productSection from '../../common/showcase/productSection'
    // import PvolveTrialBanner from './PvolveTrialBanner'
    // import ninetyDayChallengeBanner from './ninetyDayChallengeBanner'

    import { pvolveColors } from './pvolveColors'
    import { pvolveProductSectionTools } from './pvolveProductSectionTools'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { designTools } from '../../../mixins/designTools'

    export default {
        props: ['componentData'],

        mixins: [userAndProductInfo, designTools, pvolveColors, pvolveProductSectionTools],

        components: {
            productSection,
            pvolveStructuredProducts,
            // PvolveTrialBanner,
            // ninetyDayChallengeBanner
        },

        data() {
            return {

            }
        },

        computed: {

        },

        methods: {

        },

        watch: {

        },

        created() {
            // k('componentData: ', this.componentData)

        }
    }
</script>

<style scoped>
    #hero {
        position: relative;
    }

    .color-overlay {
        position: absolute;
        content: "";
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .angled {
        clip-path: polygon(-450% 0%, 550% 0%, 50% 100%, 50% 100%);
        -webkit-clip-path: polygon(-450% 0%, 550% 0%, 50% 100%, 50% 100%);
    }
</style>
