import { userAndProductInfo } from './userAndProductInfo'

export const authentication = {
    computed: {
        goingTo() {
            return this.$store.state.goingTo
        },

        comingFrom() {
            return this.$store.state.comingFrom
        },

        environmentName() {
            return this.$store.state.environment.name
        },

        anonymousUserID() {
            return this.$store.state.user.anonymousUserID
        },

        userAgentInfo() {
            return this.$store.state.userAgentInfo
        },

        firstVisitToEnvironment() {
            return this.$store.state.firstVisitToEnvironment
        },

        sessionLogObj() {
            return this.$store.state.sessionLogObj
        }
    },

    mixins: [userAndProductInfo],

    methods: {
        sendEmailToAPI(cb) {
            var req = {
                "userEmail": this.userEmail
            }

            this.api.post(this.api.apiv4Route + 'api/user/emailAccountExists', req, (res) => {
                k('userInfoFromEmail: ', res)

                cb(res)
            })
        },

        signUserIn(cb) {

            let req = {
                userEmail: this.userEmail,
                password: this.userPassword
            }

            k('sign in req: ', req)

            this.api.post(this.api.whichServer() == '-dev2' ? this.api.apiv4Route + 'api/user/authenticate' : this.api.apiv3Route + 'user/authenticate', req, res => {
                k('auth: ', res)

                if (this.api.whichServer() == '-dev2' && res.success) res.authenticated = true

                cb(res)
            })
        },

        registerNewUser(cb) {
            var req = {
                "userEmail": this.userEmail,
                "password": this.userPassword,
                "firstName": this.firstName,
                "lastName": this.lastName
            }

            k('signUserUp req: ', req)

            this.api.post(this.api.apiv4Route + 'api/user/createNewUserIfNecessary', req, (res) => {
                k('newUser res: ', res)

                cb(res)
            })
        },

        userFound(res) {
            k('userFound: ', res)

            this.$store.commit('userLoginToken', res.userLoginToken)
            this.fileManager.writeToFile('userLoginToken.js', res.userLoginToken)
            this.$store.commit('authenticated', true)

            // if (!this.noredirect) this.route(this.$route.query.redirect || this.comingFrom || '/')

            // var isSignIn = true
            // this.initUser(isSignIn)
        },

        initUser(cb) {
            k('initUser')

            // get user Info
            if (this.appOffline) {
                let savedUserInfo = this.localStorage.get('userInfo')
                k('savedUserInfo: ', savedUserInfo)
                if (savedUserInfo) {
                    this.$store.commit('userInfo', savedUserInfo)
                    this.logUserInfo(savedUserInfo)
                }
            } else {
                this.getUserInfo(userInfo => {
                    k('userInfo res: ', userInfo)

                    if (userInfo) {
                        this.$store.commit('userInfo', userInfo)
                        this.localStorage.set('userInfo', userInfo)

                        // if (signIn && this.anonymousUserID) {
                        //     var req = {
                        //     	"newUserID": userInfo.userID,
                        //     	"originalUserID": this.anonymousUserID,
                        //     	"newUserEmail": userInfo.userEmail
                        //     }
                        //
                        //     this.api.post(this.api.ioRoute + 'support/reassignIssues', req, (res) => {
                        //         k('reassignIssues: ', res)
                        //         this.$store.commit('issuesReassigned', true)
                        //
                        //         var req = {
                        //             anonymousUserID: this.anonymousUserID,
                        //             loggedInUserID: userInfo.userID
                        //         }
                        //
                        //         this.api.post(this.api.ioRoute + 'events/updateAnonUserID', req, (res) => {
                        //             k('updateAnonUserID: ', res)
                        //             this.$store.commit('anonymousUserID', '')
                        //         })
                        //     })
                        // }

                        this.logUserInfo(userInfo)
                    }

                    cb()
                })

            // if (this.goingTo !== '/activate') {
                this.removeEnvironmentProductInfo()

                k('get new product info and verify from initUser')
                this.getUserActiveProductsForEnvironment((res) => {
                    this.verifyDownloadedProducts()
                })
            // }
            }

        },

        logUserInfo(userInfo) {
            var logEventObj = {
                eventType: 'userInfo',
                userEmail: userInfo.userEmail,
                userID: userInfo.userID,
                os: this.userAgentInfo ? this.userAgentInfo.os.name : '',
                referrer: document.referrer ? document.referrer : ''
            }

            kw('userInfo log event: ', logEventObj, this.sessionLogObj)
            this.api.sendEvent(logEventObj)

            var newSessionLogObj = this.j_.mergeObjects(this.j_.cloneObject(this.sessionLogObj), logEventObj)
            this.$store.commit('sessionLogObj', newSessionLogObj)
        },

        subscribeUserToMailingList(listID, signIn) {
            let req = {
                "userEmail": this.userEmail,
                "listID": listID,
                "mergeFields": {}
            }

            if (signIn) {
                req.mergeFields.APPSIGNIN = "true"
            } else {
                req.mergeFields.APPSIGNUP = "true"
            }
            if (this.userInfo.firstName) req.mergeFields.FNAME = this.userInfo.firstName
            if (this.userInfo.lastName) req.mergeFields.LNAME = this.userInfo.lastName
            k('subscribeUserToMailingList req: ', req)

            this.api.post(`${this.api.apiv4Route}api/client/${this.brand.environmentName}/subscribeUser2MailingList`, req, (res) => {
                k('subscribeUserToMailingList: ', res)
            })
        },

        resetPassword() {
            this.sendRequestPasswordChangeToAPI((res) => {
                if (res.success) {
                    this.informUserPasswordResetHasBeenSent()
                }
                else {
                    var resStr = 'Sorry we could not reset your password. Please try again later or contact support.'
                    if (res.message) {
                        if (res.message === 'noUserEmailFound') resStr = 'This email was not found in our system. Please check that the email is correct.'
                    }
                }
            })
        },

        sendRequestPasswordChangeToAPI(cb) {
            var req = {
                userEmail: this.userEmail,
                environment: this.environmentName
            }

            k('requestPasswordChange req: ', req)

            this.api.post(this.api.apiv4Route + 'api/user/requestPassword', req, (res) => {
                k('request password change res: ', res)

                cb(res)
            })
        },

        showBadPasswordDialog(cb) {

            this.$q.dialog({
                title: 'Oops!',
                message: 'The password you entered doesn’t match the one we have on file for you.',
                ok: {
                    label: 'Reset password'
                },
                cancel: {
                    label: 'Enter password again'
                }
            }).then(() => {
                cb('resetPassword')
            }).catch(() => {
                cb('tryAgain')
            })
        },

        informUserPasswordResetHasBeenSent(cb) {
            this.$q.dialog({
                title: 'Your password reset email has been sent!',
                message: 'Please check your email for the link to reset your password.'
            })
        }
    }
}
