import { globalComputedData } from './globalComputedData'

export const contentScheduleTools = {

    mixins: [globalComputedData],

    data() {
        return {
            userWantsToRegenerateContent: false,
            lastUpdatedCalendarTimestamp: '',

            localUserSelectedTags: [],
            daysToViewContent: [],
            userContentSchedule: '',

            useReminders: false,
            defaultReminderTime: '',
            phoneNumber: null,

            tagOptions(which) {
                return Object.keys(this.environmentTagHeadingObj[which].tags).map((key) => {
                    return this.environmentTagHeadingObj[which].tags[key]
                })
            },
        }
    },

    computed: {
        daysOfWeek() {
            return this.moment.weekdays()
        },

        contentSchedulePreferences() {
            return this.userPreferences ? this.userPreferences.find(preference => preference.type === 'contentSchedulePreferences') : ''
        },

        savedUserPreferenceItemID() {
            return this.contentSchedulePreferences && this.contentSchedulePreferences.id ? this.contentSchedulePreferences.id : ''
        },
    },

    watch: {
        userInfo() {
            if (this.userInfo.phoneNum) {
                k('setting phonenumber')
                this.phoneNumber = this.userInfo.phoneNum
            }
        },

        contentSchedulePreferences() {
            k('contentSchedulePreferences: ', this.contentSchedulePreferences)
        }
    },

    methods: {
        toggleTag(tag) {
            // k('toggleTag: ', tag)

            if (this.localUserSelectedTags.includes(tag.id)) {
                this.localUserSelectedTags.splice(this.localUserSelectedTags.indexOf(tag.id), 1)
            } else {
                this.localUserSelectedTags.push(tag.id)
            }
            // k('localUserSelectedTags: ', this.localUserSelectedTags)
        },

        toggleDayToViewContent(tag) {
            // k('toggleDayToViewContent: ', tag)

            if (this.daysToViewContent.includes(tag)) {
                this.daysToViewContent.splice(this.daysToViewContent.indexOf(tag), 1)
            } else {
                this.daysToViewContent.push(tag)
            }
            k('daysToViewContent: ', this.daysToViewContent)
        },

        setContentSchedulePreferences() {
            let item = this.contentSchedulePreferences
            k('setContentSchedulePreferences vars: ', item)

            if (item) {
                if (item.defaultReminderTime) {
                    this.defaultReminderTime = item.defaultReminderTime
                    this.useReminders = true
                } else {
                    this.defaultReminderTime = ''
                    this.useReminders = false
                }
                if (item.userContentSchedule) this.userContentSchedule = item.userContentSchedule

                this.localUserSelectedTags = item.userSelectedTags
                this.daysToViewContent = item.daysToViewContent
                this.lastUpdatedCalendarTimestamp = item.lastUpdatedCalendarTimestamp
            }
        },

        saveContentSchedulePreferences(cb) {
            const method = this.savedUserPreferenceItemID ? 'put' : 'post';
            const endpointURL = `${this.api.ioRoute}userInfo${this.savedUserPreferenceItemID ? '/' + this.savedUserPreferenceItemID : ''}`

            var req = {
                userID: this.userInfo.userID,
                userLoginToken: this.userLoginToken,
                type: 'contentSchedulePreferences',
                environment: this.environmentName,
                userSelectedTags: this.localUserSelectedTags,
                daysToViewContent: this.daysToViewContent,
                defaultReminderTime: this.useReminders ? this.defaultReminderTime : '',
                lastUpdatedCalendarTimestamp: this.lastUpdatedCalendarTimestamp ? this.lastUpdatedCalendarTimestamp : ''
            }

            if (this.userContentSchedule) req.userContentSchedule = this.userContentSchedule
            k('saveContentSchedulePreferences req: ', req, method, endpointURL)

            this.api[method](endpointURL, req, (res) => {
                k('saveContentSchedulePreferences res: ', res)

                if (!res.success) {
                    return
                }

                if (res.docID) {
                    req.id = res.docID
                } else {
                    req.id = this.savedUserPreferenceItemID
                }

                this.replaceOrAddPreference(req)
                k('replaceOrAddPreference: ', this.contentSchedulePreferences, req)

                cb()
            })
        },

        replaceOrAddPreference(newPreference) {

            if (!this.userPreferences) {
                this.$store.commit('userPreferences', []);
            }

            let cloneUserPreferences = this.j_.cloneObject(this.userPreferences)
            let index = cloneUserPreferences.findIndex(preference => preference.type === 'contentSchedulePreferences')
            k('replaceOrAddPreference index: ', index)

            if (index > -1) {
                cloneUserPreferences[index] = newPreference;
            } else {
                cloneUserPreferences.push(newPreference)
            }

            this.$store.commit('userPreferences', cloneUserPreferences)
        },

        remindMe() {
            k('remindMe: ', this.useReminders, this.phoneNumber)

            if (this.useReminders) {
                this.useReminders = false
                this.defaultReminderTime = ''
            } else {
                if (this.phoneNumber && this.userInfo.phoneNum) {
                    this.useReminders = true
                    this.defaultReminderTime = '12:00'
                }
                else {
                    this.$q.notify({
                        message: 'Please enter the phone number to which you would like to receive your reminders.',
                        type: 'negative',
                        icon: 'fas fa-check-circle',
                        position: 'bottom-left'
                    })
                }
            }
        },

        defaultReminderTimeSelected(timeString) {
            k('defaultReminderTimeSelected: ', timeString)
            this.defaultReminderTime = timeString
        },

        savePhoneNumberIfNecessary() {
            // api-v4-dev2.platformpurple.com/api/user/updateUserInfo
            var phoneNumber = this.phoneNumber.replace(/-|\(|\)| /g, '')
            k('save phone number: ', phoneNumber)

            if (phoneNumber === this.userInfo.phoneNum) {
                k('same number')
            }
            else {
                this.sendNewPhoneNumberToAPI(phoneNumber)
            }
        },

        sendNewPhoneNumberToAPI(phoneNumber) {
            var req = {
                userLoginToken: this.userLoginToken,
                phoneNum: phoneNumber
            }

            k('phoneNum update req: ', req)

            this.updateUserInfo(req, (res) => {
                k('phoneNum update res: ', res)

                if (res.success) {
                    this.userInfo.phoneNum = phoneNumber
                    this.$store.commit('userInfo', this.userInfo)
                    this.localStorage.set('userInfo', userInfo)

                    this.$q.notify({
                        message: 'Phone number saved!',
                        type: 'positive',
                        icon: 'fas fa-check-circle',
                        position: 'bottom-left'
                    })
                }
                else {
                    this.$q.notify({
                        message: 'Phone number was not saved, please try again.',
                        type: 'negative',
                        icon: 'fas fa-check-circle',
                        position: 'bottom-left'
                    })
                }
            })
        }
    }
}
