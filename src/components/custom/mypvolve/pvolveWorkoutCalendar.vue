<template>

    <div id="pvolveWorkoutCalendar" v-if="authenticated && userActiveProducts.length">
        <h3 class="text-grey bg-grey-2" align="center" style="margin: 0; padding: 2rem 1rem 0;">
            <span class="thinHeader">{{userInfo.firstName ? `${userInfo.firstName}'s ` : 'My '}}</span> <span class="thickHeader" :style="`color: ${pvolveMintBG};`">workout calendar</span>
        </h3>

        <aiCalendar
            :contentName="'workout'"
            :specialContentName="'Stretch'"
            :specialContentTagID="5769"
            :smsReminderTemplateName="'workoutReminder'"
            :contentFilteringHelpHTML="contentFilteringHelpHTML"
            :contentScheduleHelpHTML="contentScheduleHelpHTML"
            :productScope="userActiveProducts"
            :tagSelectMenus="tagSelectMenus"
            :highlightColor="pvolveMintBG"
            :contentCompleteImageSrc="contentCompleteImageSrc"
            :replaceButtonColor="pvolveMintBG"
            :removeButtonColor="pvolvePink"
            style="padding: 2rem 1rem 1rem 1rem;"
        />
    </div>

</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import aiCalendar from '../../common/showcase/aiCalendar'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['componentData'],

        components: {
            aiCalendar
        },

        mixins: [ pvolveColors, globalComputedData ],

        data() {
            return {
                showWorkoutCalendar: true,
                contentCompleteImageSrc: 'statics/mypvolve/PLV010-17_PeachIcon_CMYK.png',
                tagSelectMenus: [{
                    title: 'Body focus',
                    dataKey: 'body focus',
                }, {
                    title: 'Workout length',
                    dataKey: 'duration',
                }, {
                    title: 'Equipment owned',
                    dataKey: 'equipment',
                }],

                contentFilteringHelpHTML: `<p class='monty' style='font-size: .9rem;'>Below you can select options based on:</p> <ul class='monty' style='font-size: .9rem'> <li>your workout preferences</li> <li>what days you would like to work out</li> <li>whether you would like text reminders at a particular time</li> </ul> <p class='monty' style='font-size: .9rem;'>Your choices will be used to filter your calendar to be personalized to your needs. Notice that your selection will change the total number of workouts available below. Your calendar will then be assembled based on your selections and P.volve products when clicking "GENERATE MY PLAN!".</p> <p class='monty' style='font-size: .9rem;'>Your workout schedule will be saved for next time, but be careful, if you select to regenerate the calendar on a month you have already made changes on you will lose any unlocked days.</p> <p class='monty' style='font-size: .9rem;'>To enable text reminders, you must have a valid phone number and pick a default reminder time before generating your calendar.</p>`,
            }
        },

        computed: {
            userActiveProducts() {
                // 5494 === tutorials
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    return product.userActiveProduct && product.webplayer && product.productType == 'bundleProduct' && product.tags.split(',').indexOf('5494') === -1
                }) : ''
            },

            contentScheduleHelpHTML() {
                return `<h5 style="color: ${this.brandColor};">Workout History:</h5>
                        <p class='monty' style='font-size: .9rem;'>
                            There’s a P.volve peach <img src="${this.contentCompleteImageSrc}" style="width: 2rem; display: inline; vertical-align: middle;" /> on all the days you worked out, plus your total workout time.
                        </p>
                        <p class='monty' style='font-size: .9rem;'>
                            Tap the peach to review your workout for that day.
                        </p>
                        <h5 style="color: ${this.brandColor};">Workout Schedule:</h5>
                        <p class='monty' style='font-size: .9rem; margin-top: 1rem;'>
                            Once you've generated your personalized workout plan, you can change it to fit your schedule:
                        </p>
                        <ul class='monty' style='font-size: .9rem'>
                            <li style="margin-bottom: 1rem;">select the play icon to play that day's workout</li>
                            <li style="margin-bottom: 1rem;">select the plus icon on a day without a workout to add one</li>
                            <li style="margin-bottom: 1rem;">select the gear icon to see workout details and options</li>
                            <li style="margin-bottom: 1rem;">
                                In the workout options, you can:
                                <ul>
                                    <li style="margin-bottom: 1rem;">set a specific text reminder time for that day</li>
                                    <li style="margin-bottom: 1rem;">replace the current workout with another</li>
                                    <li style="margin-bottom: 1rem;">remove that workout</li>
                                    <li style="margin-bottom: 1rem;">lock/unlock a workout you want to keep around even when regenerating your calendar</li>
                                </ul>
                            </li>
                        </ul>
                        `
            }
        }
    }
</script>

<style>
    .filterButton {
        border: 2px solid #efefef;
        margin: 5px;
        /*padding: 5px;*/
        cursor: pointer;
        height: calc(100% - .5rem);
    }
</style>
