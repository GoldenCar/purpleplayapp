<template>

    <div style="padding-bottom: 1rem;">

        <PvolveTrialBanner />
        <ninetyDayChallengeStatus />
        <pvolveWorkoutCalendar />
        <pvolveViewingHistory />
        <pvolveMyProgress />
        <pvolveSetMyGoals />
        <pvolveEnterCurrentProgress />
        <!-- <pvolveMyTransformation /> -->

    </div>

</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    import ninetyDayChallengeStatus from './ninetyDayChallengeStatus'
    import pvolveWorkoutCalendar from './pvolveWorkoutCalendar'
    import pvolveViewingHistory from './pvolveViewingHistory'
    import pvolveMyProgress from './pvolveMyProgress'
    import pvolveSetMyGoals from './pvolveSetMyGoals'
    import pvolveEnterCurrentProgress from './pvolveEnterCurrentProgress'
    import pvolveMyTransformation from './pvolveMyTransformation'
    import PvolveTrialBanner from './PvolveTrialBanner'

    export default {
        data() {
            return {

            }
        },

        mixins: [pvolveColors, globalComputedData],

        components: {
            PvolveTrialBanner,
            ninetyDayChallengeStatus,
            pvolveWorkoutCalendar,
            pvolveViewingHistory,
            pvolveMyProgress,
            pvolveSetMyGoals,
            pvolveEnterCurrentProgress,
            pvolveMyTransformation,
        },

        computed: {

        },

        methods: {

        },

        watch: {

        },

        created() {

        }
    }
</script>

<style>

</style>
