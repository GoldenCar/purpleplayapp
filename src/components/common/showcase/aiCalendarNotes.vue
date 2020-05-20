<template>

    <div class="col-12 relative-position">
        <questionMarkHelp class="col-12" :componentData="{}" :helpContents="`
            <h6 style='line-height: 1.6rem; margin-bottom: 1rem'>Your P.volve journal is for keeping daily notes of your health and fitness journey.</h6>
            <p class='monty' style='font-size: .9rem;'>How did you feel after your workout? What did you eat today? Did you take a walk, meditate, do some stretches?</p>
            <p class='monty' style='font-size: .9rem;'>Enter any health or wellness-related notes you wish that will help guide yourself to your fitness goals.</p>
        `"
            style="padding: 1rem 0;"
        />

        <div style="padding: 1rem;">
            <q-slide-transition>
                <div v-if="showNotes">
                    <h6 style="margin: .5rem 0;">My Fitness Journal Entry</h6>

                    <q-input
                        type="textarea"
                        rows="3"
                        class="inputBox"
                        placeholder="put notes here"
                        v-model="noteText"
                        color="grey"
                        style="margin: 1rem 0;"
                    />

                    <q-btn :disable="!noteText.length" outline @click="saveNotes()" class="monty" style="background: #fff !important; color: #333;">
                        <h6 style="font-size: .8rem; letter-spacing: 1px;">Save My Entry</h6>
                    </q-btn>
                </div>
            </q-slide-transition>

            <div v-if="!showNotes">
                <q-btn outline @click="showNotes = true" class="monty" style="background: #fff !important; color: #333;">
                    <h6 style="font-size: .8rem; letter-spacing: 1px;">Add Fitness Journal Entry</h6>
                </q-btn>
            </div>
        </div>

    </div>

</template>

<script>
    import questionMarkHelp from '../questionMarkHelp'

    // import { pvolveColors } from './pvolveColors'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'

    export default {
        props: ['monthDataKey', 'selectedDayIndex', 'highlightColor', 'userContentScheduleNoteText'],

        mixins: [ globalComputedData, userAndProductInfo ],

        components: {
            questionMarkHelp
        },

        data() {
            return {
                noteText: '',
                showNotes: false, // todo: change to false
                showHelp: false
            }
        },

        computed: {
            userContentScheduleNotesPreference() {
                return this.userPreferences ? this.userPreferences.find(preference => preference.type === 'userContentScheduleNotes') : ''
            },

            userContentScheduleNotes() {
                return this.userContentScheduleNotesPreference ? this.userContentScheduleNotesPreference.noteData : ''
            },

            userContentScheduleNotesPreferenceID() {
                return this.userContentScheduleNotesPreference && this.userContentScheduleNotesPreference.id ? this.userContentScheduleNotesPreference.id : ''
            }
        },

        watch: {
            userContentScheduleNoteText() {
                if (this.userContentScheduleNoteText) {
                    this.noteText = this.userContentScheduleNoteText
                    this.showNotes = true
                }
            }
        },

        methods: {
           saveNotes() {
                k('noteText: ', this.noteText)
                let userContentScheduleNotes = this.userContentScheduleNotes

                if (!this.userContentScheduleNotes) userContentScheduleNotes = {}
                if (!this.userContentScheduleNotes[this.monthDataKey]) userContentScheduleNotes[this.monthDataKey] = {}

                userContentScheduleNotes[this.monthDataKey][this.selectedDayIndex] = this.noteText

                const req = {
                    userID: this.$store.state.user.info.userID,
                    userLoginToken: this.$store.state.user.userLoginToken,
                    type: 'userContentScheduleNotes',
                    environment: this.$store.state.environment.name,
                    noteData: userContentScheduleNotes
                }
                k('saveNotes req: ', req)

                this.saveUserPreferenceToAPI(this.userContentScheduleNotesPreferenceID, req, () => {
                    this.$q.notify({
                        message: 'Your entry has been saved.',
                        type: 'positive',
                        icon: 'fas fa-check-circle',
                        position: 'bottom-left'
                    })
                })
            },
        },

        created() {
            // k('userContentScheduleNotes: ', this.userContentScheduleNotes)
            // k('monthDataKey: ', this.monthDataKey)
            // k('selectedDayIndex: ', this.selectedDayIndex)
            // k('highlightColor: ', this.highlightColor)
            k('userContentScheduleNoteText: ', this.userContentScheduleNoteText)

            if (this.userContentScheduleNoteText) {
                this.noteText = this.userContentScheduleNoteText
                this.showNotes = true
            }
        }
    }
</script>
