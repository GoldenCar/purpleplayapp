<template>

    <div class="bg-grey-3">
        <div class="row well">
            <div class="col-12" style="padding: .5rem;">
                <helpFAQ v-if="faqContent" :faqData="faqContent" :buttonColor="pvolveMintBG" :hideSearch="true" />
            </div>
        </div>
    </div>

</template>

<script>
import { pvolveColors } from './pvolveColors'
import { globalComputedData } from '../../../mixins/globalComputedData'
import helpFAQ from '../../common/support/helpFAQ'

export default {
    props: ['componentData'],

    components: {
        helpFAQ,
    },

    data() {
        return {
            messageFieldError: false,
            emailFieldError: false,
            message: '',
            unauthenticatedEmail: '',

            faqContent: {
                pedagogy: [
                    {
                        question: 'What are the P.volve Phases?',
                        answer: 'To empower and support you through every stage of your P.volve fitness journey, I’ve broken the method down into 3 phases—Beginner, Intermediate, and Advanced.',
                    },
                    {
                        question: 'Why are there different phases?',
                        answer:
                            'If you think about it, you wouldn’t run before you can walk right? Same principles apply--P.volve is all about scalability, which is why my clients never plateau and see continuous results for years. Each phase leads into the next as it is important to master form, technique, and to truly understand the movements in each phase in order to make the next phase more purposeful and impactful. We start by learning the foundation and creating the mind-body connection. From there, we foster it, strengthen it and challenge it with each workout.',
                    },
                    {
                        question: 'What can I expect in the Beginner Phase?',
                        answer:
                            'The focus of the Beginner phase is to orient and correct your muscle memory in terms of basic functional motions and movement. This phase is heavily focused on controlled stepping patterns, training the body to be able to step forward to back and side to side with perfect bio-mechanics and proportional muscle activation and stabilization. The key to building a solid foundation is to mobilize the hips, which then enables the pelvis to move properly and activate the surrounding muscles. In addition to the hips, the spotlighted muscles of the Beginner phase will be the butt, lower stomach and thighs as these are the primary muscles utilized in everyday movements and must be conditioned to correct any dysfunctions and weaknesses elsewhere in the body. Once the center of the body is fully integrated, functional and strong, the rest of the body falls into place much faster.',
                    },
                    {
                        question: 'What can I expect in the Intermediate Phase?',
                        answer:
                            'The Intermediate phase builds upon the stepping patterns and motions from the beginner phase by adding resistance through the use of bands and weights. This creates just the right amount of stress on the muscles-- enough to engage them even further and condition them to work with and against more than just your own body weight, but not so much it causes inflammation or bulk. This phase also introduces larger ranges of motion, including different angulations when moving through the exercises. While the beginner phase establishes the foundational front-to-back and side-to-side planes, the intermediate phase becomes more dynamic as we incorporate new angles of stepping patterns in order to challenge the stabilizer muscles, increase balance and strength, and create greater definition.',
                    },
                    {
                        question: 'What can I expect in the Advanced Phase?',
                        answer:
                            'The Advanced phase emphasizes creating deep hip and glute strength and activation while further challenging balance and stability with increasingly dynamic movements. As the longest phase of the P.volve Pedagogy, everything you do will be an integrated full body exercise, working to hold resistance in each part of your body and move with every single muscle you have. My goal with this phase is for everyone to become a master of awareness with their body, demonstrating greater control of your body through a mix of reaching, twisting, stepping, lifting and squeezing all in tandem. Being able to move in all 3 planes of motion (sagittal, frontal and transverse) simultaneously will take your body to the next level. Not only will this phase enable you to move with strength and grace as you flow from one exercise to the next, but it will allow you to move your body through possible plateaus, continually challenging it for years to come.',
                    },
                    {
                        question: 'What equipment is used in each phase?',
                        answer:
                            'The beginner phase is focused on mastering your own bodyweight, so we begin with little to no equipment, occasionally using the P.ball, some ankle bands and light weights. The intermediate phase utilizes that same equipment, but with the addition of the P.band and varied levels of weight and resistance.  The advanced phase introduces the gliders into the mix, taking you from 20% to 80% of the way towards your peak shape. All that said, this list is somewhat is simply a guide and I may stray from it now and then, just to keep things interesting!',
                    },
                    {
                        question: 'How quickly should I be progressing through each phase?',
                        answer: `Ideally, you will spend about 30 days mastering the beginner phase, and another 30 days for the intermediate phase. Once you\’ve created that foundation, the advanced phase is really where you will maintain your new base line. This is where you will be able to challenge your body even further as you choose, but where you will also be able to maintain your progress even if you take some time off (because life happens). Even after you master this phase, it is best to always come back and mix beginner and intermediate workouts into your routine either weekly or biweekly. It’s great to periodically come back to the foundation and re-master your form. As you start to activate new muscles, I guarantee that the workouts will feel entirely different from the first few times around— even the P.sit! <br /> <br /> That said, the timing and length of each phase will ultimately be determined by you! Every body is different, and only you will know if and when you feel ready to progress. If you need more time, Keep practicing the workouts, and if you progress faster, no problem!. Your evolution is about YOU and taking the time that YOU need to create a habit, and ultimately make a life-lasting change. More importantly, I want emphasize that P.volve isn’t a quick fix-- this is a full evolution that will keep evolving with you and your body through each stage of life, so don’t rush the process!`,
                    },
                    {
                        question: 'I’m not sure what level I should start with-- where do I begin?',
                        answer:
                            'If you have been working out for 5 years, 5 days, or never at all, the beginner phase is your base camp. The movements done in P.volve are pretty different than anything else out there in the fitness world, so I encourage everyone new to this method start from the ground up. You may be eager to start at the intermediate level (most are), but I’ve seen clients who were extremely active and worked consistently before coming to P.volve and did not have the ability to properly control their body. The advanced phase is where you will evolve, but it won’t be effective unless the beginner and intermediate phases have been perfected. The absolute best place to start is with the Beginner program! <br /> <br /> This structured 2-week program comes with a calendar to keep you on track and will introduce you to the new movements of P.volve (accompanied by lots of my talking and instruction).',
                    },
                    {
                        question: 'What if I am injured?',
                        answer:
                            'Always first consult your doctor or physician regarding injuries. If you’re given the green light, you can always do any workout from any phase without any equipment (trust me, it will still be challenging!). If an exercise is more dynamic and incorporates both upper and lower body, you can also simplify the moves by breaking them down to accommodate your condition (ex: simply keep the arms at your chest).',
                    }
                ]
            }
        }
    },

    mixins: [pvolveColors, globalComputedData],

    computed: {},

    methods: {
        sendMessage() {
            if ((!this.userInfo.userEmail && !this.unauthenticatedEmail) || !this.message) {
                if (!this.message) this.messageFieldError = true
                return false
            }

            let route = this.api.apiv4Route + 'api/email/send2Support'
            let req = {
                environment: this.environmentName,
                message: this.message,
                from: this.userInfo.userEmail || this.unauthenticatedEmail,
                firstName: this.userInfo.firstName,
            }
            k('sendMessage req: ', route, req)

            this.api.post(route, req, res => {
                k('sendMessage res: ', res)

                if (res.success) {
                    this.message = ''

                    this.$q.notify({
                        message: 'Email has been sent!',
                        type: 'positive',
                        icon: 'fas fa-check-circle',
                        position: 'bottom-left',
                    })
                }
            })
        },
    },

    watch: {},

    created() {
        k('environmentJSON: ', this.environmentJSON)
    },
}
</script>

<style>
</style>
