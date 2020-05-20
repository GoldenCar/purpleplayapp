<template>

    <q-card v-if="authenticated" class="bg-white">
        <q-card-main>
            <h5 align="center" class="text-grey-8" style="text-transform: none;"><template v-if="userRated">Your rating:</template><template v-else="">Rate this workout!</template></h5>
            <div class="row justify-center">
                <image-rating v-model="rating" @rating-selected="rateProduct()" :src="ratingImageSrc"></image-rating>
            </div>

            <h5 align="center" class="text-grey-8" style="text-transform: none;">Please leave us a review or comment:</h5>
            <p class="text-grey-9" align="center">Your feedback is valuable to us! Since we shoot every week, we can and will keep your comments in mind as we strive to provide the best possible fitness experience for you!</p>

            <div style="padding: .5rem;">
                <q-field :error="fieldError.comment" error-label="Please enter a comment to post" />
                    <q-input
                        v-model="comment"
                        type="textarea"
                        float-label="your comment"
                        :max-height="100"
                        :min-rows="5"
                        color="grey-7"
                        class="inputBox"
                        @input="fieldError.comment = false"
                    />
                </q-field>
            </div>

            <div v-if="comment && (!userInfo.firstName || !userInfo.lastName)" class="row full-width justify-center" style="margin: .5rem 0;">
                <div class="col-6" style="padding: 0 .5rem;">
                    <q-input
                        v-model="firstName"
                        float-label="First Name"
                        color="grey-7"
                        class="inputBox"
                    />
                </div>
                <div class="col-6" style="padding: 0 .5rem;">
                    <q-input
                        v-model="lastName"
                        float-label="Last Name"
                        color="grey-7"
                        class="inputBox"
                    />
                </div>
                <div v-if="fieldError.name" class="col-12">
                    <p align="center" style="color: red;">Please enter your name to post a comment.</p>
                </div>
            </div>

            <div class="row full-width justify-center" align="center" style="margin: 1rem 0;">
                <q-btn id="comment-form-btn" :disable="sendingComment" outline @click="postComment" class="monty"style="background: #fff !important; color: #333;">
                    <h6 style="margin: 0; font-size: .9rem; letter-spacing: 1px;">
                        Submit your comment
                    </h6>
                </q-btn>
            </div>
            <p v-if="fieldError.rating" class="col-12" align="center" style="color: red;">Please select a rating above to post your comment.</p>

            <div class="text-grey-7"><strong>Privacy policy:</strong> Because we want this to be a safe community, all comments are moderated. Your personal information will never be shared with anyone. By leaving a comments, you give P.volve, Inc. the right to post it along with your first name and first initial of your last name.</div>
        </q-card-main>
    </q-card>

</template>

<script>
    import { ImageRating } from 'vue-rate-it'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'

    export default {
        props: ['ratingImageSrc'],

        data() {
            return {
                comment: '',
                sendingComment: false,
                rating: 0,
                fieldError: {
                    comment: false,
                    rating: false,
                    name: false
                },
                userRated: false,
                firstName: '',
                lastName: ''
            }
        },

        components: {
          ImageRating
        },

        mixins: [globalComputedData, userAndProductInfo],

        computed: {
            accentColor() {
                return (this.brandColor ? 'background: ' + this.brandColor : 'background: #777') + '; color: white;'
            }
        },

        created() {
            this.getUserProductRating()

            if (this.userInfo) {
                if (this.userInfo.firstName) this.firstName = this.userInfo.firstName
                if (this.userInfo.lastName) this.lastName = this.userInfo.lastName
            }
        },

        watch: {
            userInfo() {
                if (this.userInfo) {
                    if (this.userInfo.firstName) this.firstName = this.userInfo.firstName
                    if (this.userInfo.lastName) this.lastName = this.userInfo.lastName
                }
            }
        },

        methods: {

            getUserProductRating() {
                var req = {
                    filters: {
                        productID: this.currentProduct.productID,
                        userID: this.userInfo.userID,
                    },
                    size: 1,
                    sortKeys: {
                        timestamp: "desc"
                    },
                    forceProd: false
                }

                this.api.post(this.api.ioRoute + 'events/productRating', req, (res) => {
                    if (res && res.data && res.data.length) {
                        this.userRated = true
                        this.rating = res.data[0].rating
                    }
                })
            },

            postComment() {
                if (!this.comment || !this.userRated || !this.firstName || !this.lastName) {
                    if (!this.firstName || !this.lastName) {
                        this.fieldError.name = true
                    }

                    if (!this.comment) {
                        this.fieldError.comment = true
                    }

                    if (!this.userRated) {
                        this.fieldError.rating = true
                    }

                    return false
                }

                if (this.firstName !== this.userInfo.firstName || this.lastName !== this.userInfo.lastName) {
                    var req = {
                        userLoginToken: this.userLoginToken,
                        firstName: this.firstName,
                        lastName: this.lastName
                    }

                    k('name update req: ', req)

                    this.updateUserInfo(req, (res) => {
                        k('name update res: ', res)

                        if (res.success) {
                            this.userInfo.firstName = this.firstName
                            this.userInfo.lastName = this.lastName
                            this.$store.commit('userInfo', this.userInfo)
                        }
                    })
                }

                this.sendingComment = true

                var req = {
                    creatorUserID: this.userInfo.userID,
                    productID: this.currentProduct.productID,
                    comment: this.comment
                }
                k('postComment req: ', req)

                this.api.post(this.api.apiv4Route + 'api/comments/new', req, (res) => {
                    k('postComment res: ', res)

                    this.sendingComment = false

                    this.$emit('newComment', {
                        comment: this.comment,
                        dateCreated: Date.now(),
                        commenter: this.userInfo.firstName && this.userInfo.lastName ? this.userInfo.firstName + ' ' + this.userInfo.lastName[0] + '.' : '',
                        pending: true
                    })

                    this.comment = ''

                    this.$q.notify({
                        message: 'Thank you for your comment!',
                        type: 'positive',
                        icon: 'fas fa-check-circle',
                        position: 'bottom-left'
                    })
                })
            },

            rateProduct() {
                k('rateProduct!')

                if (this.userRated) {
                    k('user already rated this product')
                    return false
                }

                this.userRated = true
                this.fieldError.rating = false

                let req = {
                	"productID": this.currentProduct.productID,
                	"rating": this.rating,
                	"userLoginToken": this.userLoginToken
                }
                k('saveUserRating req: ', req)

                this.api.post(this.api.apiv4Route + 'api/product/saveUserRating', req, (res) => {
                    k('saveUserRating res: ', res)
                })

                var logEventObj = {
                    eventType: 'productRating',
                    eventDesc: 'user rated product "' + this.currentProduct.productName + '" a ' + this.rating,
                    rating: this.rating,
                    productSKU: this.currentProduct.productSKU,
                    productName: this.currentProduct.productName,
                    productID: this.currentProduct.productID
                }
                this.api.sendEvent(logEventObj)
            }
        }
    }
</script>

<style>
.vue-rate-it-rating-text {
    display: none;
}
</style>
