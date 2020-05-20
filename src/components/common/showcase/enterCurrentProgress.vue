<template>

    <div id="enterCurrentProgress" class="row relative-position justify-center">
        <questionMarkHelp class="col-12" :componentData="{}" :helpContents="`
            <p class='monty' style='font-size: .9rem'>'Enter My Current Progress' enables you to:</p>
            <ol class='monty' style='font-size: .9rem'>
                <li>Track your progress through entering your measurements</li>
                <li>Update your progress for days that you have already tracked</li>
                <li>You can track: weight (${weightMeasureUnit}), waist (${lengthMeasureUnit}), and thigh (${lengthMeasureUnit})</li>
                <li>You can then check your progress up above in the 'My Progress' section</li>
            </ol>
        `"
            style="margin-top: 1rem; padding: 1rem 0;"
        />

        <div class="col-12" align="right">
            <q-field style="padding: 1rem;">
                <q-checkbox v-model="measurementSystem" @input="measurementSystemChange" label="Use metric units" color="grey-7" true-value="metric" false-value="imperial" />
            </q-field>
        </div>

        <div class="col-md-6" style="padding: 2rem 1rem;">
            <q-datetime
                id="progressDate"
                color="grey-7"
                class="full-width"
                float-label="Date"
                format="M/DD/YY"
                :max="Date.now()"
                v-model="displayDateTimeStamp"
                type="date"
            />

            <q-input
                id="weightProgressInput"
                color="grey-7"
                type="tel"
                class="full-width"
                v-model="myStats.weight"
                float-label="Weight (pounds)"
                placeholder=""
                v-mask="'###'"
            />

            <q-input
                id="waistProgressInput"
                color="grey-7"
                type="tel"
                class="full-width"
                v-model="myStats.waist"
                float-label="Waist (inches)"
                placeholder=""
                v-mask="'###'"
            />

            <q-input
                id="thighProgressInput"
                color="grey-7"
                type="tel"
                class="full-width"
                v-model="myStats.thigh"
                float-label="Thigh (inches)"
                placeholder=""
                v-mask="'###'"
            />

            <div class="row full-width">
                <q-btn id="saveProgress" outline @click="saveAssessment()" style="color: #333; background: #fff !important; margin-top: 1rem !important;">
                    <h6 style="font-size: .8rem; letter-spacing: 1px;">Save Progress</h6>
                </q-btn>
            </div>
        </div>

    </div>

</template>

<script>
    import questionMarkHelp from '../questionMarkHelp'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { measurementSystem } from '../../../mixins/measurementSystem'

    export default {

        mixins: [userAndProductInfo, globalComputedData, measurementSystem],

        components: {
            questionMarkHelp
        },

        data() {
            return {
                showHelp: false,

                myStats: {
                    weight: '',
                    waist: '',
                    thigh: ''
                },

                labelDate: '',
                displayDateTimeStamp: '',
                userInfoStatsMap: {}
            }
        },

        methods: {

            saveAssessment() {
                if (!this.displayDateTimeStamp) {
                    this.$q.notify({
                        message: 'Please enter a date.',
                        type: 'negative',
                        icon: 'fas fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                    return false
                }

                if (!this.myStats.weight && !this.myStats.waist && !this.myStats.thigh) {
                    this.$q.notify({
                        message: 'Please enter at least one statistic to track.',
                        type: 'negative',
                        icon: 'fas fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                    return false
                }

                var labelDate = this.moment(this.displayDateTimeStamp).format('M/DD/YY')

                var progress = []
                Object.keys(this.myStats).forEach((statKey) => {
                    if (this.myStats[statKey]) {
                        progress.push({
                            "label": statKey,
                            "value": this.myStats[statKey]
                        })
                    }
                })

                var req = {
                    userID: this.userInfo.userID,
                    userLoginToken: this.userLoginToken,
                    type: 'progress',
                    environment: this.environmentName,
                    displayDateTimeStamp: this.displayDateTimeStamp,
                    // labelDate: this.labelDate,
                    progress: progress
                }

                k('progress req: ', j(req))

                if (this.userInfoStatsMap[labelDate]) {
                    k('update: ', this.userInfoStatsMap[labelDate])
                    req.id = this.userInfoStatsMap[labelDate].id
                    this.updateAssessmentToAPI(req)
                }
                else {
                    this.saveAssessmentToAPI(req)
                }
            },

            saveAssessmentToAPI(req) {
                this.api.post(this.api.ioRoute + 'userInfo', req, (res) => {
                    k('progress res: ', res)

                    if (res.success) {
                        this.$q.notify({
                            message: 'Saved your progress!',
                            type: 'positive',
                            icon: 'fas fa-check-circle',
                            position: 'bottom-left'
                        })

                        // add locally
                        req.id = res.docID

                        if (!this.userPreferences) this.$store.commit('userPreferences', [])
                        this.userPreferences.push(req)
                        this.$store.commit('userPreferences', this.userPreferences)

                        this.generateUserInfoStatsMap()

                        // reset fields
                        this.displayDateTimeStamp = Date.now()
                    } else {
                        this.$q.notify({
                            message: 'Progress could not be saved at this time. Please try again.',
                            type: 'negative',
                            icon: 'fas fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            },

            updateAssessmentToAPI(req) {
                this.api.put(this.api.ioRoute + 'userInfo/' + req.id, req, (res) => {
                    k('progress update res: ', res)

                     if (res.success) {
                        this.$q.notify({
                            message: 'Updated your progress!',
                            type: 'positive',
                            icon: 'fas fa-check-circle',
                            position: 'bottom-left'
                        })

                        // add locally
                        if (!this.userPreferences) this.$store.commit('userPreferences', [])
                        //remove current obj before locally adding
                        var index
                        var i = 0
                        this.userPreferences.forEach((item) => {
                            if (item.id === req.id) index = i
                            i++
                        })
                        this.userPreferences.splice(index, 1)

                        this.userPreferences.push(req)
                        this.$store.commit('userPreferences', this.userPreferences)

                        this.generateUserInfoStatsMap()

                        // reset fields
                        this.displayDateTimeStamp = Date.now()
                    } else {
                        this.$q.notify({
                            message: 'Progress could not be updated at this time. Please try again.',
                            type: 'negative',
                            icon: 'fas fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                })
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

        },

        watch: {
            userInfo() {
                if (this.userInfo && this.userInfo.userID) {
                    this.getUserPreferences(() => {})
                }
            },

            userPreferences() {
                this.generateUserInfoStatsMap()
                this.displayDateTimeStamp = Date.now()
            },

            displayDateTimeStamp() {
                k('displayDateTimeStamp: ', this.displayDateTimeStamp)

                if (this.userInfoStatsMap[this.moment(this.displayDateTimeStamp).format('M/DD/YY')]) {
                    this.userInfoStatsMap[this.moment(this.displayDateTimeStamp).format('M/DD/YY')].progress.forEach((item) => {
                        this.myStats[item.label] = item.value
                    })
                } else {
                    this.myStats.weight = ''
                    this.myStats.waist = ''
                    this.myStats.thigh = ''
                }
            }
        },

        created() {
            if (this.userPreferences) {
                this.generateUserInfoStatsMap()
                this.displayDateTimeStamp = Date.now()

            } else if (this.userInfo && this.userInfo.userID) {
                this.getUserPreferences(() => {})
            }
        }
    }
</script>

<style scoped>
    .padded {
      padding: .5rem;
    }
</style>
