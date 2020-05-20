<template>
    <div id="pvolveOnboardingModalLayout" class="relative-position">

        <div align="right" class="q-layout-header" style="position: fixed; padding: .5rem; width: 100%; background: #fff; border-bottom: 1px solid #ccc; z-index: 99; box-shadow: none;">
            <q-btn @click="route($store.state.comingFrom)" flat style="padding: .5rem;">
                <q-icon name="fas fa-times" color="grey-9" />
            </q-btn>
        </div>

        <div v-if="userPreferences" class="stepCard" :style="`background: ${slide.backgroundColor ? slide.backgroundColor : '#fff'};`">
            <template v-if="slide.id === 'welcome'">
                <div class="angled">
                    <div class="row" :style="`background: url(${slide.imageURL}) 50% 0% / cover;`">
                        <div class="col-6" style="padding: 3rem 1rem 14rem;">
                            <h1 class="thickHeader" :style="`color: ${pvolveMintTitle};`">{{slide.title}}</h1>
                            <h5 class="text-grey-9" style="text-transform: unset;">I’m Stephen Pasterino, <br /> but I go by P.</h5>
                        </div>
                    </div>
                </div>

                <div class="col-12" align="center" style="padding: 1rem 1rem 0; margin: 0 auto; max-width: 450px;">
                    <h6 class="text-grey-9" style="text-transform: unset; line-height: 1.75rem;">{{slide.text}}</h6>
                </div>

                <div class="col-12" align="center" style="padding: 1rem 1rem 0; margin: 0 auto; max-width: 450px;">
                    <h6 :style="`text-transform: unset; line-height: 1.75rem; color: ${pvolveMintTitle};`">Turns out the fast, sweaty world of women’s fitness and training isn’t creating the naturally proportioned, lean bodies that women are looking for. I developed P.volve to change all that.</h6>
                </div>

                <div v-if="authenticated && userActiveProducts.length" class="col-12" align="center" style="padding: 1rem 0;">
                    <q-btn @click="changeSlide(1)" size="lg" :style="`background: ${slide.buttonColor};`">
                        <h6 class="thickHeader">
                            Get Started
                            <q-icon name="fas fa-caret-right" style="font-size: 1.1rem;" />
                        </h6>
                    </q-btn>
                </div>
            </template>

            <template v-if="slide.id === 'program'">
                <div class="angled">
                    <div class="row" :style="`background: url(${slide.imageURL}) 50% 0% / cover;`">
                        <div class="col-12" align="center" style="padding: 6rem 4rem;">
                            <h2 class="text-white" style="text-transform: unset;">{{slide.title}}</h2>
                        </div>
                    </div>
                </div>

                <div class="col-12" align="center" style="padding: 1rem; margin: 0 auto; max-width: 450px;">
                    <h6 class="text-grey-9" style="text-transform: unset; line-height: 2rem;">{{slide.text}}</h6>
                </div>

                <div class="col-12" align="center" style="padding: 1rem 0;">
                    <q-btn @click="changeSlide(1)" size="lg" :style="`background: ${slide.buttonColor};`">
                        <h6 class="thickHeader">
                            create your custom program
                            <q-icon name="fas fa-caret-right" style="font-size: 1.1rem;" />
                        </h6>
                    </q-btn>
                </div>
            </template>

            <template v-if="slide.id === 'bodyFocus'">
                <div align="center" style="padding: 3rem 2rem 1rem;">
                    <h2 :style="`text-transform: unset; color: ${slide.textColor};`">{{slide.title}}</h2>
                </div>

                <div class="row justify-center" style="padding: 1rem 3rem;">
                    <div v-if="tagOptions('body focus')" class="col-xs-12 col-sm-6" v-for="tag in tagOptions('body focus')" :key="tag.id" style="padding: 5px;">
                        <div class="filterButton" align="center" @click="toggleTag(tag)" :style="`${localUserSelectedTags.includes(tag.id) ? `background: ${pvolveSalmon}; color: #fff;` : `color: ${slide.textColor};`}`">
                            <h6 style="margin: .5rem;">{{tag.tagName}}</h6>
                        </div>
                    </div>
                </div>

                <div class="col-12" align="center" style="padding: 1rem 3rem;">
                    <h6 class="text-grey-9" style="text-transform: unset; line-height: 2rem;">{{slide.text}}</h6>
                </div>

            </template>

            <template v-if="slide.id === 'equipment'">
                <div align="center" style="padding: 3rem 1rem 0;">
                    <h2 :style="`text-transform: unset; color: ${slide.textColor};`">{{slide.title}}</h2>
                </div>

                <div class="row justify-center" style="padding: 1rem;">
                    <div class="col-xs-6 col-sm-4" v-if="tag.id !== 5542" v-for="tag in tagOptions('equipment')" style="padding: .25rem; position: relative;">
                        <div class="filterButton" align="center" @click="toggleTag(tag)" :style="localUserSelectedTags.includes(tag.id) ? `border-color: ${pvolveMintTitle}; border-width: 3px;` : ''">
                            <div style="padding: .25rem;">
                                <img :src="equipmentImageSrc(tag.id)" style="max-width: 100%; width: 100%;" />
                            </div>
                            <h6 :style="`font-size: .8rem; margin: .5rem 0; color: ${slide.textColor};`">{{tag.tagName}}</h6>
                        </div>
                    </div>

                    <div class="col-xs-6 col-sm-4" v-if="tag.id == 5542" v-for="tag in tagOptions('equipment')" style="padding: .25rem; position: relative;">
                        <div class="filterButton" align="center" @click="toggleTag(tag)" :style="localUserSelectedTags.includes(tag.id) ? `border-color: ${pvolveMintTitle}; border-width: 3px;` : ''">
                            <h6 :style="`font-size: .8rem; padding: 3.5rem 1rem; color: ${slide.textColor};`">I don't have any equipment yet.</h6>
                        </div>
                    </div>
                </div>

                <div class="col-12" align="center" style="padding: 1rem;">
                    <h6 class="text-grey-9" style="text-transform: unset; line-height: 2rem;">{{slide.text}}</h6>
                </div>
            </template>

            <template v-if="slide.id === 'daysOfWeek'">
                <div align="center" style="padding: 3rem 2rem 1rem;">
                    <h2 :style="`text-transform: unset; color: ${slide.textColor};`">{{slide.title}}</h2>
                </div>

                <div class="row justify-center" style="padding: 1rem 3rem;">
                    <div class="col-xs-12 col-sm-6" v-if="tag.id !== 5542" v-for="(tag, index) in daysOfWeek" style="padding: .25rem; position: relative;">
                        <div class="filterButton" align="center" @click="toggleDayToViewContent(tag)" :style="daysToViewContent.includes(tag) ? `background: #fff; color: #444;` : ''">
                            <h6 style="font-size: .8rem; margin: .5rem;">{{tag}}</h6>
                        </div>
                    </div>
                </div>

                <div class="col-12" align="center" style="padding: 1rem 4rem;">
                    <h6 :style="`text-transform: unset; line-height: 2rem; color: ${slide.textColor};`">{{slide.text}}</h6>
                </div>
            </template>

            <template v-if="slide.id === 'reminderTime'">
                <div align="center" style="padding: 3rem 1rem 1rem; margin: 0 auto; max-width: 400px;">
                    <img :src="slide.imageURL" style="max-width: 100px;" />
                    <h2 :style="`text-transform: unset; color: ${slide.textColor};`">{{slide.title}}</h2>
                </div>

                <div class="row justify-center" style="padding: 1rem;">
                    <div class="col-12" style="padding: .5rem; max-width: 400px;">

                        <q-input
                            v-model="phoneNumber"
                            class="inputBox"
                            :attributes="{autocompletetype: 'tel', autocorrect: 'off'}"
                            id="phoneNumber"
                            placeholder="(123) 456-7890"
                            color="grey-7"
                            v-mask="'###############'"
                            align="center"
                            :style="`color: ${pvolveSalmon}; padding: .5rem; margin-top: 0; border: 1px solid ${slide.buttonColor};`"
                        />

                        <q-btn size="sm" :disable="(!phoneNumber || (phoneNumber.replace(/-|\(|\)| /g, '') && userInfo.phoneNum && phoneNumber.replace(/-|\(|\)| /g, '') === userInfo.phoneNum)) ? true : false" class="full-width" @click="savePhoneNumberIfNecessary" :style="`background: ${slide.buttonColor};`">
                            <h6 style="font-size: .8rem;">Save My Phone #</h6>
                        </q-btn>

                        <div style="border-bottom: 1px solid #cdcdcd; margin: 1rem 0;"></div>

                        <q-slide-transition>
                            <div v-if="useReminders" style="padding: .5rem;">

                                <h6 align="center" :style="`font-size: .8rem; color: ${slide.buttonColor};`">Select Reminder Time:</h6>
                                <timePicker
                                :inputTimeString="defaultReminderTime"
                                @outputTimeString="defaultReminderTimeSelected"
                                :style="`color: ${slide.buttonColor};`"
                                />
                            </div>
                        </q-slide-transition>

                        <q-btn class="full-width" @click="remindMe" :style="`background: ${slide.buttonColor};`">
                            <h6 style="font-size: .8rem;">{{useReminders ? 'Cancel default reminder' : 'Set default reminder'}}</h6>
                        </q-btn>
                    </div>
                </div>

                <div class="col-12" align="center" style="padding: 1rem; max-width: 500px; margin: 0 auto;">
                    <h6 :style="`text-transform: unset; line-height: 2rem; color: ${slide.textColor};`">{{slide.text}}</h6>
                </div>
            </template>

            <template v-if="slide.id === 'ready'">
                <div class="angled">
                    <div :style="`background: url(${slide.imageURL}) 50% 50% / cover; padding: 12rem;`">

                    </div>
                </div>

                <div class="col-12" align="center" style="padding: 2rem 1rem 0; margin: 0 auto; max-width: 300px;">
                    <h2 :style="`text-transform: unset; color: ${pvolveMintTitle};`">{{slide.title}}</h2>
                </div>

                <div class="col-12" align="center" style="padding: 1rem 1rem 0; margin: 0 auto; max-width: 400px;">
                    <h6 class="text-grey-9" style="text-transform: unset; line-height: 2rem;">{{slide.text}}</h6>
                </div>
            </template>
        </div>

        <div v-if="userPreferences && slide.id !== 'welcome' && slide.id !== 'program' && slide.id !== 'ready'" class="fixed-bottom" style="background: #fff; height: 50px; border-top: 1px solid #ccc;">
            <div class="row justify-center" align="center" style="padding: .5rem;">
                <div class="col-6" align="left">
                    <q-btn flat v-if="currentSlide" @click="changeSlide(-1)">
                        <h6 class="thickHeader" :style="`margin: 0; color: ${pvolveMintTitle};`">
                            <q-icon name="fas fa-caret-left" style="font-size: 1.1rem;" />
                            Back
                        </h6>
                    </q-btn>
                </div>

                <div class="col-6" align="right">
                    <q-btn flat @click="changeSlide(1)" >
                        <h6 class="thickHeader" :style="`margin: 0; color: ${pvolveMintTitle};`">
                            Next
                            <q-icon name="fas fa-caret-right" style="font-size: 1.1rem;" />
                        </h6>
                    </q-btn>
                </div>
            </div>
        </div>

        <div v-if="userPreferences && slide.id === 'ready'" class="fixed-bottom" style="background: #fff; height: 100px; border-top: 1px solid #ccc;">
            <div class="row justify-center" align="center" style="padding: .5rem;">
                <div class="col-12" align="center" style="padding: 1rem .5rem;">
                    <q-btn @click="goToCalendar()" size="lg" :style="`background: ${slide.buttonColor};`">
                        <h6 class="thickHeader text-white">
                            your custom workout
                            <q-icon name="fas fa-caret-right" style="font-size: 1.1rem;" />
                        </h6>
                    </q-btn>
                </div>
            </div>
        </div>

    </div>

</template>

<script>
import { pvolveColors } from './pvolveColors'
import { globalComputedData } from '../../../mixins/globalComputedData'
import { contentScheduleTools } from '../../../mixins/contentScheduleTools'
import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
import timePicker from '../../common/timePicker'

export default {

    components: {
        timePicker
    },

    mixins: [ pvolveColors, globalComputedData, userAndProductInfo, contentScheduleTools ],

    data() {
        return {
            currentSlide: 0,

            equipmentImageSrc(id) {
                let map = {
                    5485: 'https://vault.platformpurple.com/static/clients/mypvolve/light-ankle.jpg',
                    5488: 'https://vault.platformpurple.com/static/clients/mypvolve/glider.jpg',
                    5487: 'https://vault.platformpurple.com/static/clients/mypvolve/hand-weights.jpg',
                    5693: 'https://vault.platformpurple.com/static/clients/mypvolve/heavy-band.jpg',
                    5490: 'https://vault.platformpurple.com/static/clients/mypvolve/light-band.jpg',
                    5486: 'https://vault.platformpurple.com/static/clients/mypvolve/p.ball.jpg',
                    5750: 'https://vault.platformpurple.com/static/clients/mypvolve/heavy-ankle.jpg',
                    5724: 'https://vault.platformpurple.com/static/clients/mypvolve/p.band.jpg',
                    5758: 'https://vault.platformpurple.com/static/clients/mypvolve/step.jpg'
                }
                return map[id]
            }
        }
    },

    computed: {
        slides() {
            let slides = [{
                id: 'bodyFocus',
                backgroundColor: 'linear-gradient(#fff, #FFF8F5)',
                textColor: this.pvolveSalmon,
                buttonColor: this.pvolveSalmon,
                buttonTextColor: '#fff',
                title: 'What area would you like to focus on?',
                text: 'Choose as many as you like. You can change your body focus at any time.'
            }, {
                id: 'equipment',
                textColor: this.pvolveMintTitle,
                buttonColor: this.pvolveMintTitle,
                buttonTextColor: '#fff',
                title: 'What equipment do you have?',
                text: 'This can be updated at any time!'
            }, {
                id: 'daysOfWeek',
                backgroundColor: 'linear-gradient(rgba(134, 138, 148, .7), rgba(120, 124, 134, 1))',
                textColor: '#fff',
                buttonColor: '#FFF8F5',
                buttonTextColor: this.pvolveSalmon,
                title: 'What days of the week would you like to work out?',
                text: 'Choose as many as you like. You can always update your schedule.'
            }, {
                id: 'reminderTime',
                imageURL: 'https://vault.platformpurple.com/static/clients/mypvolve/pvolve-message-icon.png',
                backgroundColor: '#FFF8F5',
                textColor: '#999',
                buttonColor: this.pvolveSalmon,
                buttonTextColor: '#fff',
                title: 'Want workout reminders?',
                text: 'Your reminder time can be updated at any time.'
            }, {
                id: 'ready',
                backgroundColor: 'linear-gradient(#fff, #FFF8F5)',
                imageURL: 'https://vault.platformpurple.com/static/clients/mypvolve/pvolve-streaming-workout.jpg',
                textColor: '#444',
                buttonColor: this.pvolveMintTitle,
                title: 'That’s it, you’re ready to start!',
                text: 'Click through to see your workout, customized to YOU. It can be adjusted at any time and will always include the latest and greatest workouts from P.'
            }]

            if (!this.contentSchedulePreferences) slides.unshift({
                id: 'welcome',
                imageURL: 'https://vault.platformpurple.com/static/clients/mypvolve/Stephen-portrait.jpg',
                textColor: '#444',
                buttonColor: this.pvolveMintTitle,
                title: 'WELCOME!',
                text: 'P.volve evolved from over 15 years immersed in the sports and fitness world and my professional training at the Gray Institute.'
            }, {
                id: 'program',
                imageURL: 'https://vault.platformpurple.com/static/clients/mypvolve/pvolve-streaming-green.jpg',
                textColor: '#444',
                buttonColor: this.pvolveMintTitle,
                title: 'Ready to join the thousands of women I’ve helped to achieve real, visible results?',
                text: 'I’m a strong believer in the results that customized workout programs can deliver. I’m going to ask you some questions so I can learn about you and your fitness goals, and create a customized program just for you.'
            })

            k('slides computed: ', this.contentSchedulePreferences, slides)

            return slides
        },

        slide() {
            return this.slides[this.currentSlide]
        },

        userActiveProducts() {
            // 5494 === tutorials
            return this.environmentProducts ? this.environmentProducts.filter((product) => {
                return product.userActiveProduct && product.webplayer && product.productType == 'bundleProduct' && product.tags.split(',').indexOf('5494') === -1
            }) : ''
        },

        contentSchedulePreferences() {
            return this.userPreferences ? this.userPreferences.filter((item) => {
                return item.type === 'contentSchedulePreferences'
            })[0] : ''
        },
    },

    methods: {
        initOnboardingInfo() {
            // if (this.userPreferences) {
            //     this.setContentSchedulePreferences()
            // } else {
                this.getUserPreferences(() => {}, true)
            // }

            k('set phonenumber? ', this.userInfo)
            if (this.userInfo && this.userInfo.phoneNum) {
                this.phoneNumber = this.userInfo.phoneNum
            }
        },

        changeSlide(delta) {
            this.currentSlide += delta
            k('change slide: ', this.currentSlide)

            window.scrollTo(0, 0)
        },

        goToCalendar() {
            this.localStorage.set('userWantsToRegenerateCalendarContent', true)
            this.saveContentSchedulePreferences(() => {
                this.route('/me')
            })
        }
    },

    watch: {
        userPreferences() {
            k('onboarding watch userPreferences: ', this.userPreferences)
            if (this.userPreferences) {
                this.setContentSchedulePreferences()
            }
        },

        userInfo() {
            k('onboarding watch userInfo: ', this.userInfo)

            if (this.userInfo) {
                this.initOnboardingInfo()
            }
        }
    },

    created() {
        k('onboarding created userPreferences: ', this.userPreferences)

        this.initOnboardingInfo()
    }
}
</script>

<style scoped>
     .tightLetterSpacing {
        letter-spacing: -1px;
        margin: 0;
    }

    .stepCard {
        padding-top: 3.3rem;
        width: 100%;
        height: 100%;
        color: white;
    }

    .stepText {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.2rem;
        text-transform: none;
        margin-bottom: 3rem;
        line-height: 1.5rem;
        color: white;
    }

    .biggerStepText {
        font-size: 1.6rem;
    }

    .bottomNav {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 1rem 2rem;
        width: 100%;
        color: white;
    }

    .filterButton {
        border: 1px solid #D1CFCE;
        margin: 5px;
        /*padding: 5px;*/
        cursor: pointer;
        height: calc(100% - .5rem);
    }

    .angled {
        clip-path: polygon(-450% 0%, 500% 0%, 50% 100%, 50% 100%);
        -webkit-clip-path: polygon(-450% 0%, 500% 0%, 50% 100%, 50% 100%);
        max-width: 550px;
        margin: 0 auto;
    }

</style>
