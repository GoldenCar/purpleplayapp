<template>

    <div id="setMyGoals" class="row justify-center relative-position justify-center">
        <questionMarkHelp class="col-12" :componentData="{}" :helpContents="`
            <p class='monty' style='font-size: .9rem'>'Set My Goals' enables you to:</p>
            <ol class='monty' style='font-size: .9rem'>
                <li>Enter goals for your progress</li>
                <li>You can track: workout time, weight (${weightMeasureUnit}), waist (${lengthMeasureUnit}), and thigh (${lengthMeasureUnit})</li>
                <li>You can then check your progress up above in the 'My Progress' section</li>
            </ol>
        `"
            style="margin-top: 1rem; padding: 1rem 0;"
        />

        <!--<div class="col-lg-6" style="padding: .5rem;">-->
        <!--    <q-card class="text-white" :style="`height: 100%; background: ${cardBackgroundColor};`">-->
        <!--        <q-card-main class="row">-->
        <!--            <h6 class="col-12">weekly workout goal:</h6>-->
        <!--            <div class="col-12">-->
        <!--                <hr />-->
        <!--            </div>-->

        <!--            <q-input id="workoutsPerWeek" type="number" class="col-12 inputBox" color="grey" v-model="workoutsPerWeek" float-label="How many workouts per week?" @input="showSaveGoal = true" />-->

        <!--            <q-input id="minutesPerWorkout" type="number" class="col-12 inputBox" color="grey" v-model="minutesPerWorkout" float-label="How many minutes per workout?" @input="showSaveGoal = true" />-->

        <!--            <div id="saveWorkoutGoal" v-if="showSaveGoal" class="col-12" style="margin-top: 1rem;">-->
        <!--                <q-btn @click="saveWorkoutGoal()" :disabled="!workoutsPerWeek || !minutesPerWorkout" :style="`color: #fff; background: ${buttonBackgroundColor};`">-->
        <!--                    <h6>Save Goal</h6>-->
        <!--                    <q-icon name="fas fa-caret-right" style="font-size: 1.5rem !important; margin-left: 1rem;" />-->
        <!--                </q-btn>-->
        <!--            </div>-->
        <!--        </q-card-main>-->
        <!--    </q-card>-->
        <!--</div>-->

        <div class="col-12" align="right">
            <q-field style="padding: 1rem;">
                <q-checkbox v-model="measurementSystem" @input="measurementSystemChange" label="Use metric units" color="grey-7" true-value="metric" false-value="imperial" />
            </q-field>
        </div>

        <div class="col-lg-6" style="padding: .5rem;">
            <div class="row">
                <h6 class="col-12">measurement goals:</h6>
                <div class="col-12">
                    <hr />
                </div>

                <q-input
                    id="weightInput"
                    type="tel"
                    class="full-width inputBox"
                    color="grey"
                    v-model="assessmentGoals.weight"
                    float-label="Weight (pounds)"
                    placeholder=""
                    @input="showSaveProgressGoal = true"
                    v-mask="'###'"
                />

                <div class="col-6" style="padding-right: .5rem;">
                    <q-input
                        id="waistInput"
                        class="inputBox"
                        type="tel"
                        color="grey"
                        v-model="assessmentGoals.waist"
                        float-label="Waist (inches)"
                        placeholder=""
                        @input="showSaveProgressGoal = true"
                        v-mask="'###'"
                    />
                </div>

                <div class="col-6" style="padding-left: .5rem;">
                    <q-input
                        id="thighInput"
                        class="inputBox"
                        type="tel"
                        color="grey"
                        v-model="assessmentGoals.thigh"
                        float-label="Thigh (inches)"
                        placeholder=""
                        @input="showSaveProgressGoal = true"
                        v-mask="'###'"
                    />
                </div>

                <div v-if="showSaveProgressGoal" class="col-12" style="margin-top: 1rem;">
                    <q-btn id="saveProgressGoal" outline @click="saveProgressGoal()" :disabled="!assessmentGoals.weight || !assessmentGoals.waist || !assessmentGoals.thigh" :style="`color: #333; background: #fff !important;`">
                        <h6 style="font-size: .8rem; letter-spacing: 1px;">Save Progress Goal</h6>
                    </q-btn>
                </div>
            </div>
        </div>

    </div>

</template>

<script>
    import questionMarkHelp from '../questionMarkHelp'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { measurementSystem } from '../../../mixins/measurementSystem'

    export default {
        props: ['cardBackgroundColor', 'buttonBackgroundColor'],

        mixins: [ globalComputedData, userAndProductInfo, measurementSystem ],

        data() {
            return {
                showHelp: false,
                assessmentGoals: {
                    weight: '',
                    waist: '',
                    thigh: ''
                },

                workoutsPerWeek: '',
                minutesPerWorkout: '',

                currentGoal: '',
                currentProgressGoal: '',

                showSaveGoal: false,
                showSaveProgressGoal: false
            }
        },

        components: {
            questionMarkHelp
        },

        computed: {
            // currentProgressGoal() {
            //     return this.userPreferences ? this.userPreferences.filter((item) => {
            //         return item.type === 'goal' && item.goalType === 'progress'
            //     })[0] : ''
            // }
        },

        methods: {

            checkUserInfoData() {
                k('checkUserInfoData: ', this.userPreferences)

                this.userPreferences.forEach((item) => {
                    if (item.type === 'goal' && item.goalType === 'mediaPlaySeconds') {
                        k('found current goal: ', item)
                        this.currentGoal = item
                        // this.goalTarget = (item.goalTarget / 60 / 60).toFixed(2)
                        this.workoutsPerWeek = item.goalWorkoutsPerWeek
                        this.minutesPerWorkout = item.goalMinutesPerWorkout
                    }

                    if (item.type === 'goal' && item.goalType === 'progress') {
                        k('found current goal: ', item)
                        this.currentProgressGoal = item
                    }
                })
            },

            saveWorkoutGoal() {
                var req = {
                    userID: this.userInfo.userID,
                    userLoginToken: this.userLoginToken,
                    type: 'goal',
                    environment: this.environmentName,
                    goalType: 'mediaPlaySeconds',
                    goalInterval: 'week',
                    goalTarget: (this.workoutsPerWeek * this.minutesPerWorkout) * 60,
                    goalWorkoutsPerWeek: this.workoutsPerWeek,
                    goalMinutesPerWorkout: this.minutesPerWorkout,
                    notifyUser: true
                }

                // k('workoutGoal req: ', req)

                if (this.currentGoal) {
                    req.id = this.currentGoal.id
                    this.sendGoalUpdateToAPI(req)
                } else {
                    this.sendGoalToAPI(req)
                }
            },

            sendGoalUpdateToAPI(req) {
                this.api.put(this.api.ioRoute + 'userInfo/' + this.currentGoal.id, req, (res) => {
                    // k('workoutGoal res: ', res)

                    if (res.success) {
                        if (!this.userPreferences) this.$store.commit('userPreferences', [])
                        //remove current obj before locally adding
                        var index
                        var i = 0
                        this.userPreferences.forEach((item) => {
                            if (item.id === this.currentGoal.id) index = i
                            i++
                        })
                        this.userPreferences.splice(index, 1)

                        this.userPreferences.push(req)
                        this.$store.commit('userPreferences', this.userPreferences)

                        this.currentGoal = req
                        this.showSaveGoal = false
                        this.$q.notify({
                            message: 'Goal updated!',
                            type: 'positive',
                            icon: 'fas fa-check-circle',
                            position: 'bottom-left'
                        })
                    } else {
                        this.$q.notify({
                            message: 'Goal was not saved. Please try again.',
                            type: 'negative',
                            icon: 'fas fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            },

            sendGoalToAPI(req) {
                this.api.post(this.api.ioRoute + 'userInfo', req, (res) => {
                    // k('workoutGoal res: ', res)

                    if (res.success) {
                        req.id = res.docID
                        if (!this.userPreferences) this.$store.commit('userPreferences', [])
                        this.userPreferences.push(req)
                        this.$store.commit('userPreferences', this.userPreferences)

                        this.currentGoal = req
                        this.showSaveGoal = false

                        this.$q.notify({
                            message: 'Goal updated!',
                            type: 'positive',
                            icon: 'fas fa-check-circle',
                            position: 'bottom-left'
                        })
                    } else {
                        this.$q.notify({
                            message: 'Goal was not saved. Please try again.',
                            type: 'negative',
                            icon: 'fas fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            },

            saveProgressGoal() {

                var req = {
                	userID: this.userInfo.userID,
                	userLoginToken: this.userLoginToken,
                	type: 'goal',
                	environment: this.environmentName,
                	goalType: 'progress',
                	goalInterval: 'week',
                	goalTargets: [],
                	notifyUser: true
                }

                if (this.assessmentGoals.weight) {
                    req.goalTargets.push({
            			"label": "weight",
            			"value": this.assessmentGoals.weight
            		})
                }

                if (this.assessmentGoals.waist) {
                    req.goalTargets.push({
            			"label": "waist",
            			"value": this.assessmentGoals.waist
            		})
                }

                if (this.assessmentGoals.thigh) {
                    req.goalTargets.push({
            			"label": "thigh",
            			"value": this.assessmentGoals.thigh
            		})
                }

                k('saveProgressGoal req: ', req)

                if (this.currentProgressGoal) {
                    req.id = this.currentProgressGoal.id
                    this.updateProgressGoalToAPI(req)
                } else {
                    this.saveProgressGoalToAPI(req)
                }

            },

            saveProgressGoalToAPI(req) {
                this.api.post(this.api.ioRoute + 'userInfo', req, (res) => {
                    // k('saveProgressGoal res: ', res)

                    if (res.success) {
                        req.id = res.docID
                        if (!this.userPreferences) this.$store.commit('userPreferences', [])
                        this.userPreferences.push(req)
                        this.$store.commit('userPreferences', this.userPreferences)

                        this.showSaveProgressGoal = false
                        this.$q.notify({
                            message: 'Goal set!',
                            type: 'positive',
                            icon: 'fas fa-check-circle',
                            position: 'bottom-left'
                        })
                    } else {
                        this.$q.notify({
                            message: 'Goal was not saved. Please try again.',
                            type: 'negative',
                            icon: 'fas fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            },

            updateProgressGoalToAPI(req) {
                this.api.put(this.api.ioRoute + 'userInfo/' + this.currentProgressGoal.id, req, (res) => {
                    // k('saveProgressGoal res: ', res)

                    if (res.success) {
                        if (!this.userPreferences) this.$store.commit('userPreferences', [])
                        //remove current obj before locally adding
                        var index
                        var i = 0
                        this.userPreferences.forEach((item) => {
                            if (item.id === this.currentProgressGoal.id) index = i
                            i++
                        })
                        this.userPreferences.splice(index, 1)

                        this.userPreferences.push(req)
                        this.$store.commit('userPreferences', this.userPreferences)

                        this.showSaveProgressGoal = false
                        this.$q.notify({
                            message: 'Goal updated!',
                            type: 'positive',
                            icon: 'fas fa-check-circle',
                            position: 'bottom-left'
                        })
                    } else {
                        this.$q.notify({
                            message: 'Goal was not saved. Please try again.',
                            type: 'negative',
                            icon: 'fas fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            }

        },

        watch: {

            userPreferences() {
                this.checkUserInfoData()
            },

            userInfo() {
                this.getUserPreferences(() => {})
            },

            workoutsPerWeek() {
                if (this.minutesPerWorkout) this.goalTarget = ((this.workoutsPerWeek * this.minutesPerWorkout) / 60).toFixed(2)
            },

            minutesPerWorkout() {
                if (this.workoutsPerWeek) this.goalTarget = ((this.workoutsPerWeek * this.minutesPerWorkout) / 60).toFixed(2)
            },

            currentProgressGoal() {
                k('currentProgressGoal watch: ', this.currentProgressGoal)

                if (this.currentProgressGoal) {
                    this.currentProgressGoal.goalTargets.forEach((item) => {
                        this.assessmentGoals[item.label] = item.value
                    })
                }
            }
        },

        created() {

            if (this.userPreferences) {
                this.checkUserInfoData()
            } else {
                if (this.userInfo) {
                    this.getUserPreferences(() => {})
                }
            }
        }
    }

</script>

<style scoped>
    .productCard {
        height: 100%;
    }
</style>
