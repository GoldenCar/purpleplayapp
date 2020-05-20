<template>

    <div> <!--email + password -->

        <div v-if="(freeProducts && freeProducts.length) || freeTrialForNewUsers" class="full-width" style="padding: 1rem;">
            <q-card class="bg-white" align="center" :style="`border-bottom: 5px solid ${brand.brandColorSecondary};`">
                <q-card-main>
                    <template v-if="freeTrialForNewUsers">
                        <div class="smallHead">
                            <div v-html="brand.signUpFreeTrialDescription" />
                        </div>
                    </template>

                    <template v-else>
                        <div class="smallHead">
                            <q-icon name="fas fa-heart" :style="`color : ${brand.brandColorSecondary};`" />
                            Sign up to receive our email newsletter and unlock more free content!
                        </div>

                        <div v-html="brand.signUpDescription" />

                        <p style="font-size: .8rem; color: #444; line-height: 16px;">
                            * We respect your right to privacy as much as we do our own. We will never share your email address or personal information.
                        </p>
                    </template>

                    <div @click="scrollIt('signInForm')">
                        <p class="monty" style="font-size: .9rem; margin: 0;">Scroll down to sign in / sign up.</p>
                        <q-icon name="fas fa-chevron-down" />
                    </div>

                </q-card-main>
            </q-card>

            <div v-if="freeProducts && freeProducts.length" style="background: #fff;">
                <freeProductsRow></freeProductsRow>
            </div>
        </div>

        <div class="full-width bg-grey-3" style="padding: 2rem 1rem; min-height: calc(100vh - 50px); display: flex; justify-content: center;">
            <div id="signInForm" class="full-width" style="max-width: 500px; margin: 0 auto;">
                <div align="center">
                    <!-- <h1 :style="`text-transform: none; margin: 1rem 0; color: ${buttonColor};`">{{newUser ? 'Create your account' : 'Sign in to your account'}}</h1> -->
                    <q-icon name="fas fa-sign-in-alt" style="font-size: 3rem;" />

                    <h1 :style="`margin: 1rem 0;`">{{!userEmail ? 'sign in / sign up' : userEmail && !newUser ? 'sign in' : 'sign up'}}</h1>

                    <p class="monty" style="font-size: .9rem;">{{!userEmail ? 'Start by entering your email.' : newUser ? 'Use your email and create a password to start streaming!' : 'Sign in to your existing account.'}}</p>
                </div>

                <div style="padding: 0 .5rem;">
                    <q-field
                        :error="fieldError.userEmail"
                        error-label="Please fill in your email address"
                    >
                        <q-input
                            v-model="userEmail"
                            class="inputBox"
                            name="userEmail"
                            type="email"
                            color="grey-7"
                            float-label="your email"
                            @keydown.enter="checkEmail()"
                            @blur="checkEmail()"
                            @input="fieldError.userEmail = false"
                        />
                    </q-field>
                </div>

                <div class="row">
                    <div v-if="newUser" class="col-sm-12 col-md-6" style="padding: 0 .5rem;">
                        <q-input
                            v-model="firstName"
                            class="inputBox"
                            name="firstName"
                            type="text"
                            color="grey-7"
                            float-label="first name"
                        />
                    </div>

                    <div v-if="newUser" class="col-sm-12 col-md-6" style="padding: 0 .5rem;">
                        <q-input
                            v-model="lastName"
                            class="inputBox"
                            name="lastName"
                            type="text"
                            color="grey-7"
                            float-label="last name"
                        />
                    </div>
                </div>

                <div class="col-sm-12" style="padding: 0 .5rem;">
                    <q-field
                        :error="fieldError.userPassword"
                        error-label="Please enter a password"
                    >
                        <q-input
                            v-model="userPassword"
                            class="inputBox"
                            name="userPassword"
                            type="password"
                            color="grey-7"
                            float-label="your password"
                            @input="fieldError.userPassword = false"
                            @keydown.enter="go()"
                        />
                    </q-field>

                    <a v-if="!newUser" @click="requestPasswordChange()">
                        <p class="monty" style="text-transform: uppercase; font-size: 12px; color: #777;">
                            forgot password
                        </p>
                    </a>
                </div>

                <div class="col-12" style="padding: .5rem;">
                    <q-btn outline @click="go()" class="full-width monty" :style="`background: ${brandColor} !important; color: #fff; font-size: 1rem;`">
                        <h6 style="letter-spacing: 1px;">Go!</h6>
                    </q-btn>

                    <h6 v-if="brand.includeSocialLogin" class="dividerHeader" align="center" style="margin: 1rem 0;">
                        <span style="background: #efefef;">or sign in with</span>
                    </h6>

                    <div v-if="brand.includeSocialLogin" class="row" style="margin: -.5rem;">
                        <div class="col-sm-12 col-md-6" style="padding: .5rem;">
                            <q-btn id="fbLogin" outline v-if="brand.includeSocialLogin && brand.includeSocialLogin.facebookAppID" @click="userTappedFacebookLogin()" class="monty full-width" color="blue-9" style="background: #fff !important;">
                                <q-icon name="fab fa-facebook" /> Facebook
                            </q-btn>
                        </div>

                        <div class="col-sm-12 col-md-6" style="padding: .5rem;">
                            <q-btn id="googleLogin" outline v-if="brand.includeSocialLogin && brand.includeSocialLogin.googleAppID" @click="userTappedGoogleLogin()" class="monty full-width" color="red-9" style="background: #fff !important;">
                                <q-icon name="fab fa-google" /> Google
                            </q-btn>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>

<script>
    import { authentication } from '../../mixins/authentication'
    import { social } from '../../mixins/social'
    import { firebasePushNotifications } from '../../mixins/firebasePushNotifications'

    import freeProductsRow from './freeProductsRow'

    export default {
        props: ['componentData'],

        components: {
            freeProductsRow
        },

        data() {
            return {
                userEmail: '',
                userPassword: '',
                firstName: '',
                lastName: '',
                newUser: '',
                subscriptionProductID: '',

                fieldError: {
                    userEmail: false,
                    userPassword: false
                },

                userIsForABTesting: 0
            }
        },

        mixins: [authentication, social, firebasePushNotifications],

        computed: {
            environmentProductAndTagState() {
                return this.$store.state.environmentProductAndTagState
            },

            userLoginToken() {
                return this.$store.state.user.userLoginToken
            },

            windowWidth() {
                return this.$store.state.windowWidth
            },

            previewUserInfo() {
                return this.$store.state.previewUserInfo
            },

            freeProducts() {
                return this.$store.state.freeProducts
            },

            freeTrialCode() {
                return this.brand.freeTrialCode
            },

            freeTrialForNewUsers() {
                let freeTrialForUser = this.brand.ABTesting ? this.userIsForABTesting : true
                return this.freeTrialCode && freeTrialForUser
            }
        },

        created() {
            this.setPreviewUserInfo()

            if (this.brand.ABTesting && this.freeTrialCode) {
                let userIsForABTesting = Math.round(Math.random()) ? true : false
                k('set userIsForABTesting: ', userIsForABTesting)
                this.userIsForABTesting = userIsForABTesting
            }
        },

        methods: {
            setPreviewUserInfo() {
                if (!this.authenticated) {
                    // signing in for first time, or just signed out, store preview token
                    k('storing previewToken: ', this.previewUserInfo.userLoginToken)
                    this.$store.commit('userLoginToken', this.previewUserInfo.userLoginToken)

                    k('storing preview userInfo: ', this.previewUserInfo.info)
                    this.$store.commit('userInfo', this.previewUserInfo.info)

                    if (!this.environmentProductAndTagState) this.getUserActiveProductsForEnvironment((res) => {})
                }
            },

            checkEmail() {
                if (!this.userEmail || !this.userEmail.includes('@') || !this.userEmail.includes('.')) {
                    this.fieldError.userEmail = true
                    this.newUser = false
                } else {
                    this.sendEmailToAPI((res) => {
                        if (res.success) { // they are found
                            // this.creditCardComponentData.firstName = res.body[0].firstName
                            this.newUser = false
                        } else {
                            this.newUser = true
                        }
                    })
                }
            },

            go() {
                if (this.newUser) {
                    this.signUserUp()
                } else {
                    this.signIn()
                }
            },

            signUserUp() {
                k('signUserUp')

                if (!this.userEmail || !this.userEmail.includes('@') || !this.userEmail.includes('.') || !this.userPassword) {

                    if (!this.userEmail || !this.userEmail.includes('@') || !this.userEmail.includes('.')) {
                        this.$q.notify({
                           message: 'Please enter a valid email.',
                           type: 'negative',
                           icon: 'fas fa-exclamation-circle',
                           position: 'bottom-right'
                        })
                    }

                    if (!this.userPassword) {
                        this.$q.notify({
                           message: 'Please enter a password.',
                           type: 'negative',
                           icon: 'fas fa-exclamation-circle',
                           position: 'bottom-right'
                        })
                    }

                    return false
                }

                this.$q.loading.show()

                this.registerNewUser((res) => {

                    if (!res.success) {
                        this.$q.notify({
                           message: res.errorCode,
                           type: 'negative',
                           icon: 'fas fa-exclamation-circle',
                           position: 'bottom-right'
                        })
                    } else {

                        this.userFound(res)

                        var isSignIn = false
                        var registrationMethod = 'appForm'
                        this.signInUpSuccess(isSignIn, registrationMethod)

                        // this.$q.notify({
                        //     message: 'Logged in!',
                        //     type: 'positive',
                        //     icon: 'fas fa-check-circle',
                        //     position: 'bottom-left'
                        // })
                    }
                })
            },

            signIn() {
                k('SIGN IN')

                if (!this.userEmail || !this.userPassword) {
                    if (!this.userEmail) this.fieldError.userEmail = true
                    if (!this.userPassword) this.fieldError.userPassword = true

                    this.$q.notify({
                       message: 'Please enter your email and password to sign in.',
                       type: 'negative',
                       icon: 'fas fa-exclamation-circle',
                       position: 'bottom-right'
                    })
                    return false
                }

                this.$q.loading.show()

                this.signUserIn((res) => {

                    if (!res.authenticated) {
                        this.$q.loading.hide()

                        this.showBadPasswordDialog((res) => {
                            k('res from dialog', res)
                            switch (res) {
                                case 'tryAgain':
                                    this.userPassword = ''
                                    break
                                case 'resetPassword':
                                    this.requestPasswordChange()
                                    break
                            }
                        })
                    }

                    if (res.success && res.authenticated) {
                        this.api.sendEvent({
                            eventType: 'userSignedIn',
                            userEmail: this.userEmail,
                            userID: res.userID,
                            os: this.userAgentInfo.os.name,
                            referrer: document.referrer
                        })

                        this.userFound(res)

                        var isSignIn = true
                        var registrationMethod = 'appForm'
                        this.signInUpSuccess(isSignIn, registrationMethod)

                        // this.$q.notify({
                        //     message: 'Logged in!',
                        //     type: 'positive',
                        //     icon: 'fas fa-check-circle',
                        //     position: 'bottom-left'
                        // })
                    } else {
                        this.$q.loading.hide()
                        this.$q.notify({
                           message: res.message,
                           type: 'negative',
                           icon: 'fas fa-exclamation-circle',
                           position: 'bottom-right'
                        })
                    }
                })

            },

            signInUpSuccess(isSignIn, registrationMethod) {
                // remove preview info
                this.$store.commit('userInfo', '')
                this.localStorage.set('userInfo', '')

                if (this.freeTrialForNewUsers) {
                    this.connectUserToFreeTrial(() => {
                        this.connectUserToFreeBundle(() => {
                            // this.connectUserToPreviewBundle(() => {
                                this.initUser(() => {
                                    this.afterInitUser(isSignIn, registrationMethod)
                                })

                                this.$q.loading.hide()
                                this.$router.push(this.brand && this.brand.appStartRoute && !this.appOffline ? this.brand.appStartRoute : '/library')
                            // })
                        })
                    })
                } else {
                    this.connectUserToFreeBundle(() => {
                        this.connectUserToPreviewBundle(() => {
                            this.initUser(() => {
                                this.afterInitUser(isSignIn, registrationMethod)
                            })

                            this.$q.loading.hide()
                            this.$router.push(this.brand && this.brand.appStartRoute && !this.appOffline ? this.brand.appStartRoute : '/library')
                        })
                    })
                }

            },

            afterInitUser(isSignIn, registrationMethod) {
                if (this.brand.signUpMailingListID) this.subscribeUserToMailingList(this.brand.signUpMailingListID, isSignIn)

                if (this.brand.includeSocialLogin && this.brand.includeSocialLogin.facebookAppID) this.fbLogEvent('fb_mobile_complete_registration', {
                    'fb_registration_method': registrationMethod,
                    'fb_content_id': this.userInfo.userID
                }, null)

                if (window.FirebasePlugin) this.subscribeToUserPushNotifications()

                let eventType = ''
                if (registrationMethod === 'appForm' && isSignIn) eventType = 'userSignedIn'
                if (registrationMethod === 'appForm' && !isSignIn) eventType = 'userAccountCreated'
                if (registrationMethod === 'facebookLogin') eventType = 'userSignedInWithFB'
                if (registrationMethod === 'googleLogin') eventType = 'userSignedInWithGoogle'

                let signInUpEvent = {
                    eventType: eventType,
                    userEmail: this.userEmail,
                    userID: this.userInfo.userID,
                    os: this.userAgentInfo.os.name,
                    referrer: document.referrer
                }
                k('signInUpEvent: ', signInUpEvent)
                this.api.sendEvent(signInUpEvent)
            },

            requestPasswordChange() {
                k('sendRequestPasswordChangeToAPI')

                this.sendRequestPasswordChangeToAPI((res) => {
                    if (res.success) {
                        this.informUserPasswordResetHasBeenSent()
                    }
                    else {
                        var resStr = 'Sorry we could not reset your password. Please try again later or contact support.'
                        if (res.message) {
                            if (res.message === 'noUserEmailFound') resStr = 'This email was not found in our system. Please check that the email is correct.'
                        }
                        this.$q.notify({
                           message: resStr,
                           type: 'negative',
                           icon: 'fas fa-exclamation-circle',
                           position: 'bottom-right'
                        })
                    }
                })
            },

            connectUserToFreeTrial(cb) {
                if (!this.brand.freeTrialCode) {
                    cb(false)
                    return false
                }

                var route = `${this.api.apiv4Route}api/client/${this.brand.environmentName}/activateTrialForAppUser`
                var req = {
                    'userLoginToken': this.userLoginToken,
                    'activationCode': this.brand.freeTrialCode
                }
                k('connectUserToFreeTrial route req: ', route, req)

                this.api.post(route, req, (res) => {
                    k('connectUserToFreeTrial res: ', res)
                    cb(res)
                })
            },

            connectUserToFreeBundle(cb) {
                if (!this.brand.freeBundleActivationCode) {
                    cb(false)
                    return false
                }

                var route = this.api.apiv4Route + 'api/shop/useActivationCode'

                var req = {
                    'activationCode': this.brand.freeBundleActivationCode,
                    'userLoginToken': this.userLoginToken,
                    'environmentName': this.brand.environmentName
                }
                k('connectUserToFreeBundle route req: ', route, req)

                this.api.post(route, req, (res) => {
                    k('connectUserToFreeBundle res: ', res)
                    cb(res)
                })
            },

            connectUserToPreviewBundle(cb) {
                if (!this.brand.previewBundleActivationCode) {
                    cb(false)
                    return false
                }

                var route = this.api.apiv4Route + 'api/shop/useActivationCode'

                var req = {
                    'activationCode': this.brand.previewBundleActivationCode,
                    'userLoginToken': this.userLoginToken,
                    'environmentName': this.brand.environmentName
                }
                k('connectUserToPreviewBundle route req: ', route, req)

                this.api.post(route, req, (res) => {
                    k('connectUserToPreviewBundle res: ', res)
                    cb(res)
                })
            },

            userTappedFacebookLogin() {
                this.fbLogin((res) => {
                    if (res) {
                        this.userFound(res)

                        var isSignIn = false
                        var registrationMethod = 'facebookLogin'
                        this.signInUpSuccess(isSignIn, registrationMethod)
                    } else {
                        this.$q.notify({
                           message: 'There was an issue with your sign in, please try again.',
                           type: 'negative',
                           icon: 'fas fa-exclamation-circle',
                           position: 'bottom-right'
                        })
                    }
                })
            },

            userTappedGoogleLogin() {
                this.googleLogin((res) => {
                    if (res) {
                        this.userFound(res)

                        var isSignIn = false
                        var registrationMethod = 'googleLogin'
                        this.signInUpSuccess(isSignIn, registrationMethod)
                    } else {
                        this.$q.notify({
                           message: 'There was an issue with your sign in, please try again.',
                           type: 'negative',
                           icon: 'fas fa-exclamation-circle',
                           position: 'bottom-right'
                        })
                    }
                })
            }

        }
    }
</script>

<style>
    .smallHead {
        font-family: 'Montserrat', 'sans-serif';
        font-size: 1.2rem;
        margin-bottom: 1rem;
    }
</style>
