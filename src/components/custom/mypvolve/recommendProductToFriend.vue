<template>

    <div v-if="product">
        <h5 :style="`margin-bottom: 1rem; color: #333; line-height: 2rem;`">Recommend This Workout</h5>

        <p class="monty" style="font-size: .9rem; margin: 1rem 0 0;">Enter your friend's email address to recommend this workout to them!</p>

        <q-field
            :error="friendEmailError"
            error-label="Please fill in an email address"
            style="max-width: 30rem;"
            align="left"
        >
            <q-input float-label="your friend's email" class="inputBox" v-model="friendEmail" color="grey" @input="friendEmailError = false" @keyup.enter="sendRecommendation()" />
        </q-field>

        <q-btn outline @click="sendRecommendation()" class="monty" :style="`margin-top: .5rem; background: #fff !important; color: #333;`">
            <h6 style="font-size: .9rem; letter-spacing: 1px;">Send</h6>
        </q-btn>
        <!--<p class="monty text-grey-8" style="margin-top: 1rem; font-size: 80%;">If your friend accepts, you'll earn $20 credit towards your next month of streaming, plus they'll also get $20 credit after their paid subscription begins.</p>-->
    </div>

</template>

<script>

    import { pvolveColors } from './pvolveColors'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['product'],

        components: {

        },

        mixins: [pvolveColors, globalComputedData],

        data() {
            return {
                friendEmail: '',
                friendEmailError: false
            }
        },

        computed: {

        },

        methods: {
            sendRecommendation() {

                if (!this.friendEmail.includes('@') || !this.friendEmail.includes('.')) {
                    this.friendEmailError = true
                    return false;
                }

                let req = {
                	friendEmail: this.friendEmail,
                	userLoginToken: this.userLoginToken,
                	productID: this.product.productID,
	                environment: 'mypvolve'
                }
                k('sendRecommendation req: ', req)

                this.api.post(`${this.api.apiv4Route}api/userInfo/saveFriendProductRecommendation`, req, res => {
                    k('sendRecommendation res: ', res)

                    if (res.success) {
                        this.friendEmail = ''

                        this.$q.notify({
                            message: 'Recommendation sent!',
                            type: 'positive',
                            icon: 'fas fa-check-circle',
                            position: 'bottom-left'
                        })
                    }
                })

                var logEventObj = {
                    eventType: 'productRecommendation',
                    eventDesc: `${this.userInfo.firstName || this.userInfo.userEmail} recommended ${this.product.productName} to ${this.friendEmail}`,
                    friendEmail: this.friendEmail,
                    userID: this.userInfo.userID,
                    productID: this.product.productID,
                    productName: this.product.productName
                }

                this.api.sendEvent(logEventObj)
            }
        },

        watch: {

        },

        mounted() {

        }
    }
</script>

<style>

</style>
