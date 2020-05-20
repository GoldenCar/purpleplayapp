
export const social = {
    computed: {
        environment() {
            return this.$store.state.environment
        },

        platformID() {
            return this.$store.state.platformID
        },

        googleAppID() {
            var id = this.brand.includeSocialLogin.googleAppID.web

            if (this.platformID === 'ios') id = this.brand.includeSocialLogin.googleAppID.ios
            // if (this.platformID === 'android') id = this.brand.includeSocialLogin.googleAppID.android

            return id
        }
    },

    methods: {
        share2Facebook(product) {
            // k('share to fb: ', product)

            var defaultShareURL = 'https://share' + this.api.whichServer() + '.platformpurple.com/product-preview/' + this.environment.name + '/' + product.productID

            var url = 'https://www.facebook.com/sharer/sharer.php?u=' +
                (product.productJSON && product.productJSON.shareURL ? product.productJSON.shareURL :
                this.environment.json && this.environment.json.e.shareURL ? this.environment.json.e.shareURL :
                defaultShareURL)
            // open external fb share dialog
            var w = window.open(
                url,
                'name',
                'width=600,height=400,toolbar=0,menubar=0,location=-100,status=1,scrollbars=0,resizable=0')
            w.focus()
        },

        share2Twitter(product) {
            // k('share to twitter: ', product)

            var defaultShareURL = 'https://share' + this.api.whichServer() + '.platformpurple.com/product-preview/' + this.environment.name + '/' + product.productID

            var url = 'https://www.twitter.com/share?url=' +
                (product.productJSON && product.productJSON.shareURL ? product.productJSON.shareURL :
                this.environment.json && this.environment.json.e.shareURL ? this.environment.json.e.shareURL :
                defaultShareURL)

            var w = window.open(
                url,
                'name',
                'width=600,height=400,toolbar=0,menubar=0,location=-100,status=1,scrollbars=0,resizable=0')
            w.focus()
        },

        fbLogEvent(eventString, params, valueToSum) {
            k('fbLogEvent: ', eventString, params, valueToSum)

            // logEvent(String name, Object params, Number valueToSum, Function success, Function failure)
            facebookConnectPlugin.logEvent(eventString, params, valueToSum, (res) => {
                k('facebook event success! ', res)
            }, (error) => {
                ke('facebook event error: ', error)
            })
        },

        fbLogin(cb) {
            facebookConnectPlugin.login(['public_profile', 'email'], (res) => {
                k('facebook login success! ', res)
                if (res.authResponse) {
                    this.sendFBAuthToPurple(res.authResponse, cb)
                }
            }, (error) => {
                ke('facebook login error: ', error)
                cb(false)
            })
        },

        googleLogin(cb) {
            window.plugins.googleplus.login({
                // 'scopes': '... ', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
                'webClientId': this.googleAppID, // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
                // 'offline': true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
            },
            (res) => {
                kw('google login success! ', res)
                this.sendGoogleAuthToPurple(res, cb)
            },
            (msg) => {
                ke('google login error: ' + msg)
                cb(false)
            })
        },

        sendFBAuthToPurple(authRes, cb) {
            // https://api-v4-dev2.platformpurple.com/api/auth/facebook
            // {
            // 	"accessToken": "EAAYXqKYXAmcBAMr1aOOZCDrHzm0yHZBZAFgkwGunjDUdWTEOZCqCgySVzXTd8hybztbqPs7cTsPFF9J5cEByjdYIaaf5ZCseSIiyoPUyWjLZAcCCcpmJZCnZCyq2YEiC8ZAqDjLjzqSqt6gk8I19o4UkPxaDDEP4T4KPBZA7v86lmvrLrkr7In1YunwJ91Nek1bVXqsmS8ons4uAZDZD",
            // 	"userID": "10154848432133573"
            // }

            var route = this.api.apiv4Route + 'api/auth/facebook'

            var req = {
                "accessToken": authRes.accessToken,
                "userID": authRes.userID,
                "reauthorize_required_in": authRes.expiresIn,
                "appID": this.brand.includeSocialLogin.facebookAppID
            }
            k('sendFBAuthToPurple route req: ', route, req)

            this.api.post(route, req, (res) => {
                k('sendFBAuthToPurple res: ', res)

                if (res.success && res.userLoginToken) {
                    cb(res)
                } else {
                    cb(false)
                }
            })
        },

        sendGoogleAuthToPurple(authRes, cb) {
            if (!authRes.accessToken) {
                k('why no googleAuth token?')
                return false
            }

            var route = this.api.apiv4Route + 'api/auth/google'

            var req = {
                "accessToken": authRes.accessToken,
                "appID": this.googleAppID,
                "expires_in": null,
                "projectID": this.brand.includeSocialLogin.googleProjectID
            }

            k('sendGoogleAuthToPurple route req: ', route, req)

            this.api.post(route, req, (res) => {
                k('sendGoogleAuthToPurple res: ', res)
                if (res.success && res.userLoginToken) {
                    cb(res)
                } else {
                    cb(false)
                }
            })
        }
    }
}
