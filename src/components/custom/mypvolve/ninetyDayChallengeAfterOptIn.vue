<template>

    <div>
        <div v-if="challengeQuestions" style="background: rgba(200, 200, 200, .3); margin-top: 1rem;">
            <div class="row well relative-position" :style="`padding: ${windowWidth < 768 ? '2rem 1rem' : '2rem'};`">
                <div class="col-12">
                    <questionMarkHelp class="col-12" style="margin-bottom: 1rem;" :componentData="{}" :helpContents="`
                        <h5 style='text-transform: none; line-height: 1.6rem; margin-bottom: 1rem'>What are these 90 Day Challenge questions?</h5>
                        <p>We have found that writing down some thoughts about your goals,
                        your motivation and habits help keep all of us on track and committed to our health and fitness journey.</p>
                        <p>The questions are optional, if something springs to mind, enter it here, you can always add or update your answers at any time.</p>
                    `" />

                    <h4 class="thickHeader" style="color: #555;">Challenge Questions:</h4>
                    <!--<p style="margin: 0 0 4rem 1rem;">Answer the questions below to help keep you motivated and focused on your goals:</p>-->
                </div>

                <div class="col-12">
                    <div class="row" style="margin: -1rem; padding: 1rem 0;">
                        <div v-for="question in challengeQuestions" class="col-sm-12 col-md-6" style="padding: 1rem;">
                            <h6 style="text-transform: unset;">{{question.questionText}}</h6>
                            <q-input type="textarea" rows="4" class="inputBox" v-model="question.userAnswer" color="grey" />
                        </div>
                    </div>
                </div>

                <div class="col-12">
                    <q-btn flat @click="saveAnswers()" class="monty" :style="`background: ${ pvolveMintBG }; color: #fff;  padding: .8rem 2rem;`">
                        <h6 class="thickHeader" style="font-size: .8rem; letter-spacing: 1px; margin: 0;">Save My Answers</h6>
                    </q-btn>
                </div>
            </div>
        </div>

        <div style="background: rgba(0, 0, 0, .4); margin-top: 1rem;">
            <div class="row well relative-position" :style="`padding: ${windowWidth < 768 ? '2rem 1rem' : '2rem'};`">
                <div class="col-12">
                    <h4 class="thickHeader" :style="`margin-bottom: 1rem; color: #fff;`">Recruit Your Friends, Reach Your Goals</h4>

                    <p class="monty text-white">If you commit to a goal with someone, you increase chances of success by 95%!</p>
                    <p class="monty text-white">Invite friends to the 90 Day Challenge and enter their email address below.</p>

                    <q-field
                        :error="friendEmailError"
                        error-label="Please fill in an email address"
                        style="max-width: 40rem;"
                    >
                        <q-input float-label="your friend's email" class="inputBox" v-model="friendEmail" color="grey" @input="friendEmailError = false" />
                    </q-field>

                    <q-btn flat @click="sendChallenge()" class="monty" :style="`margin-top: 1rem; background: ${ pvolveMintBG }; color: #fff; padding: .8rem 2rem;`">
                        <h6 class="thickHeader" style="font-size: .8rem; letter-spacing: 1px; margin: 0;">Send Challenge</h6>
                    </q-btn>

                    <p class="monty text-white" style="margin-top: 1rem; font-size: .9rem;">If your friend accepts, you'll earn $30 credit towards your next month of streaming, plus they'll also get $30 credit after their paid subscription begins.</p>
                </div>
            </div>
        </div>

    </div>

</template>

<script>
    import questionMarkHelp from '../../common/questionMarkHelp'

    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { pvolveColors } from './pvolveColors'
    import { contestTools } from './contestTools'
    import { pvolveSignUpTools } from './pvolveSignUpTools'

    export default {
        props: ['componentData'],

        components: {
            questionMarkHelp
        },

        mixins: [pvolveColors, contestTools, globalComputedData, userAndProductInfo, pvolveSignUpTools],

        data() {
            return {
                contestName: '90DayChallenge',
                contestMailListName: '90DayChallenge',

                challengeQuestions: null,
                showHelp: false,

                defaultChallengeQuestions: [{
                    questionText: 'What gets you motivated to work out the most?',
                    userAnswer: ''
                }, {
                    questionText: 'What unhealthy habits do you want to quit?',
                    userAnswer: ''
                }, {
                    questionText: 'What healthy habits do you want to adopt?',
                    userAnswer: ''
                }, {
                    questionText: 'What do you hope to get out of this challenge?',
                    userAnswer: ''
                }],

                friendEmail: '',
                friendEmailError: false
            }
        },

        computed: {
            ninetyDayChallengeQuestionPreference() {
                return this.userPreferences ? this.userPreferences.find(preference => preference.type === '90DayChallengeQuestions') : ''
            },

            ninetyDayChallengeQuestions() {
                return this.ninetyDayChallengeQuestionPreference ? this.ninetyDayChallengeQuestionPreference.challengeQuestions : ''
            },

            ninetyDayChallengeQuestionsPreferenceID() {
                return this.ninetyDayChallengeQuestions && this.ninetyDayChallengeQuestions.id ? this.ninetyDayChallengeQuestions.id : ''
            },
        },

        methods: {

            setQuestions() {
                k('setQuestions: ', this.ninetyDayChallengeQuestions)

                if (this.ninetyDayChallengeQuestions) {
                    this.challengeQuestions = this.ninetyDayChallengeQuestions
                } else {
                    this.challengeQuestions = this.defaultChallengeQuestions
                }
            },

            saveAnswers() {
                const req = {
                    userID: this.userInfo.userID,
                    userLoginToken: this.$store.state.user.userLoginToken,
                    type: '90DayChallengeQuestions',
                    environment: this.environmentName,
                    challengeQuestions: this.challengeQuestions
                }
                k('saveAnswers req: ', req)

                this.saveUserPreferenceToAPI(this.ninetyDayChallengeQuestionsPreferenceID, req, () => {})
            },

            sendChallenge() {

                if (!this.friendEmail.includes('@') || !this.friendEmail.includes('.')) {
                    this.friendEmailError = true
                    return false;
                }

                const req = {
                    "friendEmail": this.friendEmail,
                    "referrerName": this.userInfo.firstName || this.userInfo.userEmail,
                    "referringUserID": this.userInfo.userID,
                    "challengeName": "90DayChallenge",
                    "environment": "mypvolve"
                }
                k('sendChallenge req: ', req)

                this.api.post(`${this.api.apiv4Route}api/client/mypvolve/inviteFriendToChallenge`, req, res => {
                    k('sendChallenge res: ', res)

                    if (res.success) {
                        this.$q.notify({
                            message: 'Challenge invite has been sent.',
                            type: 'positive',
                            icon: 'fas fa-check-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            }
        },

        watch: {
            userInfo() {
                this.getUserPreferences(() => {})
            },

            userPreferences() {
                k('userPreferences watch: ', this.contestOptIn)

                this.setQuestions()
            }
        },

        created() {
            if (this.userPreferences) {
                this.setQuestions()
            } else {
                if (this.userInfo) this.getUserPreferences(() => {})
            }
        }
    }
</script>

<style scoped>

</style>
