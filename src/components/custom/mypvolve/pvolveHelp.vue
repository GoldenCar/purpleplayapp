<template>

    <div class="bg-grey-3">
        <div class="row well">
            <div class="col-12" style="padding: 1rem;">
                <h6 style="margin: 1rem; letter-spacing: 1px;">Check out our FAQ below! If you have a different question, you can contact us:</h6>

                <div class="bg-white" style="padding: 1rem;">
                    <h6 v-if="userInfo.userEmail" style="color: #333; font-size: .9rem; word-wrap: break-word; letter-spacing: 1px;">From: {{userInfo.userEmail}}</h6>

                    <q-field
                        v-else
                        :error="emailFieldError"
                        error-label="Please enter an email."
                    >
                        <q-input color="grey" v-model="unauthenticatedEmail" class="inputBox" float-label="From (Email Address):" @input="emailFieldError = false" />
                    </q-field>

                    <div style="padding: 1rem 0;">
                        <q-field
                            :error="messageFieldError"
                            error-label="Please enter a question."
                        >
                            <q-input
                                v-model="message"
                                type="textarea"
                                color="grey"
                                float-label="Enter your question..."
                                :max-height="100"
                                rows="4"
                                @input="messageFieldError = false"
                            />
                        </q-field>
                    </div>

                    <q-btn outline @click="sendMessage()" :style="`background: #fff !important; color: #333;`">
                        <h6 style="font-size: .9rem; letter-spacing: 1px;">
                            Send
                        </h6>
                    </q-btn>
                </div>
            </div>

            <div class="col-12" style="padding: .5rem;">
                <helpFAQ v-if="faqData" :buttonColor="pvolveMintTitle" />
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
            helpFAQ
        },

        data() {
            return {
                messageFieldError: false,
                emailFieldError: false,
                message: '',
                unauthenticatedEmail: ''
            }
        },

        mixins: [pvolveColors, globalComputedData],

        computed: {
            faqData() {
                return this.brand ? this.brand.faq : []
            }
        },

        methods: {
            sendMessage() {
                if ((!this.userInfo.userEmail && !this.unauthenticatedEmail) || !this.message) {
                    if (!this.message) this.messageFieldError = true
                    return false
                }

                let route = this.api.apiv4Route + 'api/email/send2Support'
                let req = {
                    "environment": this.environmentName,
                    "message": this.message,
                    "from": this.userInfo.userEmail || this.unauthenticatedEmail,
                    "firstName": this.userInfo.firstName
                }
                k('sendMessage req: ', route, req)

                this.api.post(route, req, (res) => {
                    k('sendMessage res: ', res)

                    if (res.success) {
                        this.message = ''

                        this.$q.notify({
                            message: 'Email has been sent!',
                            type: 'positive',
                            icon: 'fas fa-check-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            }
        },

        watch: {

        },

        created() {
            k('environmentJSON: ', this.environmentJSON)
        }
    }
</script>

<style>

</style>
