<template>

    <div id="myProgress" class="row relative-position justify-center">
        <questionMarkHelp class="col-12" :componentData="{}" :helpContents="`
            <p class='monty' style='font-size: .9rem'>This view will help you stay on track with your fitness and progress goals!</p>
            <p class='monty' style='font-size: .9rem'>Here's how to use it:</p>
            <ol class='monty' style='font-size: .9rem'>
                <li>Enter goals for your workouts and progress in the 'SET MY GOALS' section</li>
                <li>Then enter your progress weekly in the 'ENTER MY CURRENT PROGRESS' section below and track your progress!</li>
                <li>Finally, upload selfies at intervals to see your transformation!</li>
            </ol>
        `"
            style="margin-top: 1rem; padding: 1rem 0;"
        />

        <div class="col-12" align="right">
            <q-field style="padding: 1rem;">
                <q-checkbox v-model="measurementSystem" @input="measurementSystemChange" label="Use metric units" color="grey-7" true-value="metric" false-value="imperial" />
            </q-field>
        </div>

        <div class="col-12">

            <div v-if="showSendMeEmails" style="padding: .5rem 0;">
                <q-card class="bg-white">
                    <q-field
                        icon="fas fa-envelope"
                        helper="Update me about my progress through a weekly email report"
                        style="padding: 1rem;"
                    >
                        <q-checkbox v-model="sendGoalEmails" label="Send me emails" color="grey-7" />
                    </q-field>

                    <q-inner-loading :visible="sendGoalEmailLoading" />
                </q-card>
            </div>

            <div class="row full-width" style="padding: .5rem 0;">
                <!--<q-card class="col bg-white">-->
                <!--    <q-card-title>-->
                <!--        <h5 :style="`color: ${brandColor};`">Workout Goal</h5>-->
                <!--    </q-card-title>-->
                <!--    <q-card-main>-->
                <!--        <h4 id="currentWeeklyWorkoutGoal" v-if="currentWeeklyWorkoutGoal && currentWeeklyWorkoutGoal.goalTarget" class="thinHeader" :style="`margin: 0; color: ${brandColor};`">{{(currentWeeklyWorkoutGoal.goalTarget / 60 / 60).toFixed(2) + ' hours'}}</h4>-->
                <!--        <p v-if="!currentWeeklyWorkoutGoal">No goal yet! Enter one in 'Set My Goals' below.</h4>-->
                <!--        <p id="hoursWatched">You have watched: {{(totalMediaPlay / 60 / 60).toFixed(2) + ' hours'}}</p>-->
                <!--        <q-field-->
                <!--            v-if="currentWeeklyWorkoutGoal && currentWeeklyWorkoutGoal.goalTarget && totalMediaPlay"-->
                <!--            :helper="(currentWeeklyWorkoutGoal && currentWeeklyWorkoutGoal.goalTarget && totalMediaPlay ? ((totalMediaPlay / currentWeeklyWorkoutGoal.goalTarget) * 100).toFixed(0) : 0) + '% to Workout Goal'"-->
                <!--        >-->
                <!--            <q-progress stripe :percentage="currentWeeklyWorkoutGoal && currentWeeklyWorkoutGoal.goalTarget && totalMediaPlay ? (totalMediaPlay / currentWeeklyWorkoutGoal.goalTarget) * 100 : 0" animate :style="`color: ${highlightColor}; margin: .5rem 0; height: 10px;`" />-->
                <!--        </q-field>-->
                <!--    </q-card-main>-->
                <!--</q-card>-->

                <div class="col bg-white" v-if="!assessmentGoals.weight && !assessmentGoals.waist && !assessmentGoals.thigh" style="padding: 1rem;">
                    <h5 :style="`color: ${brandColor};`">Progress Goals</h5>
                    <p>No progress goals yet! Add them in 'Set My Goals' below.</p>
                </div>

                <div class="col bg-white" v-if="!mostRecentProgressStat.weight && !mostRecentProgressStat.waist && !mostRecentProgressStat.thigh" style="padding: 1rem;">
                    <h5 :style="`color: ${brandColor};`">Progress Tracking</h5>
                    <p>No progress entered yet! Add your stats in 'Enter Your Current Progress' below.</p>
                </div>
            </div>
        </div>

        <div class="col-12">
            <div v-if="(assessmentGoals.weight && mostRecentProgressStat.weight) || chartData.weight.labels.length">
                <div style="padding: 1rem">
                    <h5 :style="`color: ${brandColor};`">My Progress</h5>
                </div>

                <div class="bg-white" style="padding: 1rem;">
                    <div v-if="(assessmentGoals.weight && mostRecentProgressStat.weight) || chartData.weight.labels.length">
                        <h4 class="thinHeader" :style="`color: ${brandColor};`">Weight <span style="font-size: 1rem; color: #444;">(pounds)</span></h4>
                        <q-field
                            v-if="assessmentGoals.weight && mostRecentProgressStat.weight"
                            :helper="(assessmentGoals.weight && mostRecentProgressStat.weight ? weightPercentage : 0) + '% to weight goal'"
                        >
                            <q-progress stripe :percentage="assessmentGoals.weight && mostRecentProgressStat.weight ? weightPercentage : 0" animate :style="`color: ${highlightColor} !important; margin: .5rem 0; height: 10px;`" />
                        </q-field>

                        <div id="weightProgress" />
                    </div>

                    <div v-if="(assessmentGoals.waist && mostRecentProgressStat.waist) || chartData.waist.labels.length">
                        <h4 class="thinHeader" :style="`color: ${brandColor};`">Waist <span style="font-size: 1rem; color: #444;">(inches)</span></h4>
                        <q-field
                            v-if="assessmentGoals.waist && mostRecentProgressStat.waist"
                            :helper="(assessmentGoals.waist && mostRecentProgressStat.waist ? waistPercentage : 0) + '% to waist goal'"
                        >
                            <q-progress stripe :percentage="assessmentGoals.waist && mostRecentProgressStat.waist ? waistPercentage : 0" animate :style="`color: ${highlightColor} !important; margin: .5rem 0; height: 10px;`" />
                        </q-field>

                        <div id="waistProgress" />
                    </div>

                    <div v-if="(assessmentGoals.thigh && mostRecentProgressStat.thigh) || chartData.thigh.labels.length">
                        <h4 class="thinHeader" :style="`color: ${brandColor};`">Thigh <span style="font-size: 1rem; color: #444;">(inches)</span></h4>
                        <q-field
                            v-if="assessmentGoals.thigh && mostRecentProgressStat.thigh"
                            :helper="(assessmentGoals.thigh && mostRecentProgressStat.thigh ? thighPercentage : 0) + '% to thigh goal'"
                        >
                            <q-progress stripe :percentage="assessmentGoals.thigh && mostRecentProgressStat.thigh ? thighPercentage : 0" animate :style="`color: ${highlightColor} !important; margin: .5rem 0; height: 10px;`" />
                        </q-field>

                        <div id="thighProgress" />
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>

<script>
    import questionMarkHelp from '../questionMarkHelp'
    import Chartist from 'chartist'

    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { measurementSystem } from '../../../mixins/measurementSystem'

    export default {
        props: ['highlightColor'],

        mixins: [ userAndProductInfo, globalComputedData, measurementSystem ],

        components: {
            questionMarkHelp
        },

        data() {
            return {
                sendGoalEmails: false,
                sendGoalEmailLoading: false,
                showHelp: false,

                userEmailPref: '',
                totalMediaPlay: '',

                assessmentGoals: {
                    weight: '',
                    waist: '',
                    thigh: ''
                },

                labelDate: '',
                displayDateTimeStamp: '',

                userInfoStatsMap: {},

                chartData: {
                    weight: {
                        labels: [],
                        series: []
                    },

                    waist: {
                        labels: [],
                        series: []
                    },

                    thigh: {
                        labels: [],
                        series: []
                    },
                },

                chartOptions: {
                    axisX: {
                        onlyInteger: true,
                        showGrid: true,
                        labelOffset: {
                            x: -10,
                            y: 0
                        },
                    },
                    axisY: {
                        onlyInteger: true,
                        showGrid: true,
                        labelOffset: {
                            x: 0,
                            y: 20
                        },
                    },
                    fullWidth: true,
                    height: '250px',
                    chartPadding: {
                        right: 20
                    }
                }
            }
        },

        computed: {

            progressData() {
                return this.userPreferences ? this.userPreferences.filter((item) => {
                    return item.type === 'progress'
                }) : ''
            },

            currentProgressGoal() {
                return this.userPreferences ? this.userPreferences.filter((item) => {
                    return item.type === 'goal' && item.goalType === 'progress'
                })[0] : ''
            },

            currentWeeklyWorkoutGoal() {
                return this.userPreferences ? this.userPreferences.filter((item) => {
                    return item.type === 'goal' && item.goalType === 'mediaPlaySeconds'
                })[0] : ''
            },

            showSendMeEmails() {
                return (this.currentWeeklyWorkoutGoal && this.currentWeeklyWorkoutGoal.goalTarget) || (this.assessmentGoals.weight || this.assessmentGoals.waist || this.assessmentGoals.thigh)
            },

            firstProgressStat() {
                var key = Object.keys(this.userInfoStatsMap)[0]
                // k('firstProgressStat: ', j(this.userInfoStatsMap), key)

                var progressObj = {}
                if (key && this.userInfoStatsMap[key]) this.userInfoStatsMap[key].progress.forEach((item) => {
                    progressObj[item.label] = item.value
                })

                return progressObj
            },

            mostRecentProgressStat() {
                var key = Object.keys(this.userInfoStatsMap)[Object.keys(this.userInfoStatsMap).length - 1]
                // k('mostRecentProgressStat: ', j(this.userInfoStatsMap), key)

                var progressObj = {}
                if (key && this.userInfoStatsMap[key]) this.userInfoStatsMap[key].progress.forEach((item) => {
                    progressObj[item.label] = item.value
                })

                return progressObj
            },

            weightPercentage() {
                // k('weight perc: ', this.firstProgressStat.weight, this.mostRecentProgressStat.weight, this.assessmentGoals.weight)
                var perc = Math.round(((this.firstProgressStat.weight - this.mostRecentProgressStat.weight) / (this.firstProgressStat.weight - this.assessmentGoals.weight)) * 100)
                return perc > 100 ? 100 : perc > 0 ? perc : 0
            },

            waistPercentage() {
                // k('waist perc: ', this.firstProgressStat.waist, this.mostRecentProgressStat.waist, this.assessmentGoals.waist)
                var perc = Math.round(((this.firstProgressStat.waist - this.mostRecentProgressStat.waist) / (this.firstProgressStat.waist - this.assessmentGoals.waist)) * 100)
                return perc > 100 ? 100 : perc > 0 ? perc : 0
            },

            thighPercentage() {
                // k('thigh perc: ', this.firstProgressStat.thigh, this.mostRecentProgressStat.thigh, this.assessmentGoals.thigh)
                var perc = Math.round(((this.firstProgressStat.thigh - this.mostRecentProgressStat.thigh) / (this.firstProgressStat.thigh - this.assessmentGoals.thigh)) * 100)
                return perc > 100 ? 100 : perc > 0 ? perc : 0
            }

        },

        methods: {

            resetChartData() {
                this.chartData.weight.labels = []
                this.chartData.waist.labels = []
                this.chartData.thigh.labels = []
                this.chartData.weight.series = []
                this.chartData.waist.series = []
                this.chartData.thigh.series = []
            },

            findAndSetUserPref() {
                this.userEmailPref = this.userPreferences.filter((item) => {
                    return item.type === 'userPrefs'
                })[0]

                // k('userEmailPref: ', this.userEmailPref)

                if (this.userEmailPref) this.sendGoalEmails = this.userEmailPref.sendGoalEmails
                this.sendGoalEmailLoading = false
            },

            generateUserInfoStatsMap() {
                // k('generateUserInfoStatsMap')

                var userInfoStatsMap = {}
                this.progressData.sort((a, b) => {
                    // k('sort: ', a, b, a.displayDateTimeStamp - b.displayDateTimeStamp)
                    return a.displayDateTimeStamp - b.displayDateTimeStamp
                })
                // k('progressData: ', this.progressData)

                this.progressData.forEach((stat) => {
                    var label = this.moment(stat.displayDateTimeStamp).format('M/DD/YY')
                    // k('stat: ', label, stat)
                    userInfoStatsMap[label] = stat
                })

                // k('userInfoStatsMap: ', j(userInfoStatsMap))

                this.userInfoStatsMap = userInfoStatsMap
            },

            generateChartData(userInfoStats) {
                // k('generateChartData: ', this.userInfoStatsMap)

                this.resetChartData()

                var statArrays = {
                    'weight': [],
                    'waist': [],
                    'thigh': []
                }

                var userInfoStatsMapKeys = Object.keys(this.userInfoStatsMap)

                // scope flat array for sorting
                var userStats = userInfoStatsMapKeys.map((statKey) => {
                    return this.userInfoStatsMap[statKey]
                })

                // k('userStats: ', userStats)

                userStats.forEach((stat) => {
                    if (stat.type === 'progress') {

                        // k('stat: ', stat)

                        var label = this.moment(stat.displayDateTimeStamp).format('M/DD')
                        // k('label: ', stat.displayDateTimeStamp, label)

                        stat.progress.forEach((progressStat) => {
                            this.chartData[progressStat.label].labels.push(label)
                            statArrays[progressStat.label].push(Number(progressStat.value))
                        })
                    }
                })

                this.chartData.weight.series.push(statArrays.weight)
                this.chartData.waist.series.push(statArrays.waist)
                this.chartData.thigh.series.push(statArrays.thigh)

                // k('chartData: ', this.chartData)
            },

            getUserTimeWatchedForWeek() {
                // https://api-v4-dev2.platformpurple.com/api/stats/totalMediaPlayForUser

                var req = {
                    userID: this.userInfo.userID,
                    environment: this.environmentName,
                    startMSeconds: this.moment().subtract(7, 'days').valueOf(),
                    endMSeconds: this.moment().valueOf()
                }

                // k('getUserInfoData req: ', j(req))

                this.api.post(this.api.apiv4Route + 'api/stats/totalMediaPlayForUser', req, (res) => {
                    // k('getUserTimeWatchedForWeek res: ', res)

                    if (res.success) {
                        this.totalMediaPlay = res.totalMediaPlay
                    } else {
                        this.$q.notify({
                            message: 'Problem getting progres. Please try again.',
                            type: 'negative',
                            icon: 'fas fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            },

            initCharts() {
                k('initCharts: ', this.chartData)

                if (this.chartData.weight.labels.length) {
                    var data = this.chartData.weight
                    var options = this.chartOptions
                    var responsiveOptions = [
                        ['screen and (max-width: 767px)', {
                            axisX: {
                                labelInterpolationFnc: function(value) {
                                    k('label value: ', value)
                                    return data.labels && data.labels[0] && (data.labels[0] == value || data.labels[data.labels.length - 1] == value) ? value : '';
                                }
                            }
                        }]
                    ]

                    new Chartist.Line('#weightProgress', data, options, responsiveOptions);
                }

                if (this.chartData.waist.labels.length) {
                    var data = this.chartData.waist
                    var options = this.chartOptions
                    var responsiveOptions = [
                        ['screen and (max-width: 767px)', {
                            axisX: {
                                labelInterpolationFnc: function(value) {
                                    k('label value: ', value)
                                    return data.labels && data.labels[0] && (data.labels[0] == value || data.labels[data.labels.length - 1] == value) ? value : '';
                                }
                            }
                        }]
                    ]

                    new Chartist.Line('#waistProgress', data, options, responsiveOptions);
                }

                if (this.chartData.thigh.labels.length) {
                    var data = this.chartData.thigh
                    var options = this.chartOptions
                    var responsiveOptions = [
                        ['screen and (max-width: 767px)', {
                            axisX: {
                                labelInterpolationFnc: function(value) {
                                    k('label value: ', value)
                                    return data.labels && data.labels[0] && (data.labels[0] == value || data.labels[data.labels.length - 1] == value) ? value : '';
                                }
                            }
                        }]
                    ]

                    new Chartist.Line('#thighProgress', data, options, responsiveOptions);
                }
            },

            initChartData() {
                this.findAndSetUserPref()
                this.generateUserInfoStatsMap()
                this.generateChartData()

                this.$nextTick(() => {
                    this.initCharts()
                })
            }

        },

        watch: {

            userInfo() {
                this.getUserPreferences(() => {})
                this.getUserTimeWatchedForWeek()
            },

            userPreferences() {
                k('userPreferences my progress: ', this.userPreferences)

                if (this.userPreferences) {
                    this.initChartData()
                }
            },

            currentProgressGoal() {
                k('currentProgressGoal watch: ', this.currentProgressGoal)

                if (this.currentProgressGoal) {
                    this.currentProgressGoal.goalTargets.forEach((item) => {
                        this.assessmentGoals[item.label] = item.value
                    })

                    k('assessmentGoals: ', this.assessmentGoals)
                }
            },

            sendGoalEmails() {
                // k('sendGoalEmails: ', this.sendGoalEmails)

                if (this.userEmailPref && this.sendGoalEmails !== this.userEmailPref.sendGoalEmails) {
                    // k('send new info to api')

                    this.sendGoalEmailLoading = true
                    this.userEmailPref.sendGoalEmails = this.sendGoalEmails

                    this.api.put(this.api.ioRoute + 'userInfo/' + this.userEmailPref.id, this.userEmailPref, (res) => {
                        // k('userEmailPref res: ', res)

                        this.sendGoalEmailLoading = false

                        if (res.success) {
                            this.$q.notify({
                                message: 'User email preference updated!',
                                type: 'positive',
                                icon: 'fas fa-check-circle',
                                position: 'bottom-left'
                            })
                        } else {
                            this.$q.notify({
                                message: 'User email preference was not saved. Please try again.',
                                type: 'negative',
                                icon: 'fas fa-exclamation-circle',
                                position: 'bottom-left'
                            })
                        }
                    })
                }

            },

            showSendMeEmails() {
                if (this.showSendMeEmails) this.getUserPreferences(() => {})
            }
        },

        created() {
            if (this.userInfo && this.userInfo.userID) {
                this.getUserPreferences(() => {})
                this.getUserTimeWatchedForWeek()
            }

            if (this.userPreferences) {
                this.initChartData()

                if (this.currentProgressGoal) {
                    this.currentProgressGoal.goalTargets.forEach((item) => {
                        this.assessmentGoals[item.label] = item.value
                    })

                    k('assessmentGoals: ', this.assessmentGoals)
                }
            }
        }
    }
</script>

<style>
    .padded {
      padding: .5rem;
    }

    #weightProgress .ct-series-a .ct-line {
      stroke: #57c5a4;
      stroke-width: 3px;
      /*stroke-dasharray: 20px 20px;*/
    }

    #weightProgress .ct-series-a .ct-point {
      stroke: #57c5a4;
      stroke-width: 10px;
      stroke-linecap: round;
    }

    #waistProgress .ct-series-a .ct-line {
      stroke: #57c5a4;
      stroke-width: 3px;
      /*stroke-dasharray: 10px 20px;*/
    }

    #waistProgress .ct-series-a .ct-point {
      stroke: #57c5a4;
      stroke-width: 10px;
      stroke-linecap: round;
    }

    #thighProgress .ct-series-a .ct-line {
      stroke: #57c5a4;
      stroke-width: 3px;
      /*stroke-dasharray: 10px 20px;*/
    }

    #thighProgress .ct-series-a .ct-point {
      stroke: #57c5a4;
      stroke-width: 10px;
      stroke-linecap: round;
    }

    .ct-chart-line {
        fill: rgba(0, 0, 0, 0);
    }

    .ct-grid {
        stroke: #ddd;
    }
</style>
