
import scapegoat from 'scapegoat'

export const userAndProductInfo = {
    computed: {
        user() {
            return this.$store.state.user
        },

        userLoginToken() {
            return this.$store.state.user.userLoginToken
        },

        environmentData() {
            return this.$store.state.environment.data
        },

        environmentName() {
            return this.$store.state.environment.name
        },

        environmentJSON() {
            return this.$store.state.environment.json
        },

        environmentProducts() {
            return this.$store.state.environmentProducts
        },

        environmentProductAndTagState() {
            return this.$store.state.environmentProductAndTagState
        },

        userActiveProductState() {
            return this.$store.state.userActiveProductState
        },

        initialParameters() {
            return this.$store.state.initialParameters
        },

        userInfo() {
            return this.$store.state.user.info
        },

        userData() {
            return this.$store.state.user.data
        },

        userPreferences() {
            return this.$store.state.user.preferences
        },

        userPreferencesState() {
            return this.$store.state.user.preferencesState
        },

        progressData() {
            return this.userPreferences.filter((item) => {
                return item.type === 'progress'
            })
        },

        appOffline() {
            return this.$store.state.appOffline
        },

        downloadedProducts() {
            return this.$store.state.downloadedProducts
        },

        previewUserInfo() {
            return this.$store.state.previewUserInfo
        }
    },

    methods: {
        getUserInfo(cb) {

            this.api.get(this.api.apiv4Route + 'api/user/infoFromLoginToken?includeOrgData=true&userLoginToken=' + this.userLoginToken, res => {
                // k('getUserInfo: ', res)

                if (!res || res.error || !res.success || !res.userInfo) {
                    if (res.messageCode === 'userNotFound') {
                        // remove and refresh
                        this.$store.commit('userLoginToken', '')
                        this.fileManager.writeToFile('userLoginToken.js', '')

                        this.$store.commit('authenticated', false)

                        this.$router.push('/signInUp')
                    }
                    cb(false)
                } else {
                    // if (this.environmentData) this.getOwnedProducts()

                    var userInfo = res.userInfo

                    // see if purpleTeam
                    if (userInfo.userOrgs.some((o) => {
                            return o.organizationID == 678 || o.organizationID == 3915
                        })) {
                        userInfo.purpleTeam = true
                    }

                    //set for console
                    userInfo.currentOrganizationIndex = 0

                    cb(userInfo)
                }
            })
        },

        getUserData(refreshData) {
            k('get user data mixin')
            if (!this.userData || refreshData) {
                this.api.get(this.api.ioRoute + 'userInfo/' + this.userInfo.userID + '/' + this.environmentName, (res) => {
                    k('getUserData res: ', res)

                    if (res.success) {
                        this.$store.commit('userData', res.userInfo)

                        this.generateUserInfoStatsMap()
                    }

                    this.displayDateTimeStamp = Date.now()
                })
            }
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

        getUserSubscriptionProductStatusHistory() {
            if (!this.brand.validSubscriptionProductIDs || !this.userLoginToken) {
                kw('wait for info to getUserSubscriptionProductStatusHistory')
                return false
            }

            var req = {
                "userLoginToken": this.userLoginToken,
            	"productIDs": this.brand.validSubscriptionProductIDs //optional
                // "affiliateID": this.environmentData.affiliateID  // optional
            }

            k('getUserSubscriptionProductStatusHistory req: ', req)

            this.api.post(this.api.apiv4Route + 'api/productsList/productStatusHistory', req, res => {
                k('getUserSubscriptionProductStatusHistory: ', res)

                if (res.success) {
                    if (res.data) {
                        this.$store.commit('userSubscriptionProductStatusHistory', res.data)
                    }
                }
            })
        },

        getUserPreferences(cb, refreshData) {
            k('get user preferences: ', this.userPreferences, refreshData, this.userInfo.userID, this.environmentName, this.userPreferencesState)

            // if app does not already have data or force refreshData flag is passed, have userID and its not the preview user, environmentName and not already fetching
            if ((!this.userPreferences || refreshData) && this.userInfo.userID && this.userInfo.userID !== this.previewUserInfo.info.userID && this.environmentName && this.userPreferencesState !== 'fetching') {
                this.$store.commit('userPreferencesState', 'fetching')

                let userPreferenceRoute = this.api.ioRoute + 'userInfo/' + this.userInfo.userID + '/' + this.environmentName
                k('userPreferenceRoute: ', userPreferenceRoute)

                this.api.get(userPreferenceRoute, (res) => {
                    k('getUserPreferences res: ', res)

                    this.$store.commit('userPreferencesState', 'fetched')

                    if (res.success) {
                        // kw('userPreferences pre sort: ')
                        // k(j(res.userInfo))

                        //sort userInfo by most recent
                        let userPreferences = this.j_.sortArrayBy(res.userInfo, '-receivedTimestamp')
                        // kw('userPreferences post sort: ')
                        // k(j(userPreferences))

                        this.$store.commit('userPreferences', res.userInfo)
                        // this.generateUserInfoStatsMap()
                    }
                    cb()

                    // this.displayDateTimeStamp = Date.now()
                })
            } else {
                cb()
            }
        },

        saveUserPreferenceToAPI(preferenceID, req, cb) {
            const method = preferenceID ? 'put' : 'post';
            const endpointURL = `${this.api.ioRoute}userInfo${preferenceID ? '/' + preferenceID : ''}`

            k('saveUserPreferenceToAPI req: ', req, method, endpointURL)

            this.api[method](endpointURL, req, (res) => {
                k('saveUserPreferenceToAPI res: ', res)

                if (res.success) {
                    if (res.docID) {
                        req.id = res.docID
                    } else {
                        req.id = preferenceID
                    }

                    this.replaceOrAddLocalUserPreference(req)
                }

                cb(res)
            })
        },

        replaceOrAddLocalUserPreference(newPreference) {
            if (!this.userPreferences) {
                this.$store.commit('userPreferences', []);
            }

            let cloneUserPreferences = this.j_.cloneObject(this.userPreferences)
            let index = cloneUserPreferences.findIndex(preference => preference['type' || 'userInfoType'] === newPreference['type' || 'userInfoType'])
            k('replaceOrAddLocalUserPreference index: ', index)

            if (index > -1) {
                cloneUserPreferences[index] = newPreference;
            } else {
                cloneUserPreferences.push(newPreference)
            }

            this.$store.commit('userPreferences', cloneUserPreferences)
        },

        updateUserInfo(req, cb) {
            // send me an object with any keys you want updated
            // k('updateUserInfo req: ', req)

            this.api.post(this.api.apiv4Route + 'api/user/updateUserInfo', req, (res) => {
                // k('updateUserInfo res: ', res)
                cb(res)
            })
        },

        verifyDownloadedProducts() {
            // just got user active products, check to see if any products are downloaded
            k('verifyDownloadedProducts: ', this.downloadedProducts, this.downloadedProducts.length, this.environmentProducts, this.environmentProducts.length)

            if (this.downloadedProducts && this.downloadedProducts.length && this.environmentProducts && this.environmentProducts.length) {
                // k('create downloadedProductsToRemove')

                // generate list of downloaded products that user does not have access to
                let downloadedProductsToRemove = this.downloadedProducts.filter((product) => {
                    // k('downloadedProduct: ', product)
                    // k('environmentProduct: ', this.environmentProducts.find((eProduct) => { return eProduct.productID === product.productID }))
                    return !this.userHasAccess([product.productID])
                })

                k('downloadedProductsToRemove: ', downloadedProductsToRemove)

                if (downloadedProductsToRemove && downloadedProductsToRemove.length) {
                    downloadedProductsToRemove.forEach((product) => {
                        this.deleteLocalProduct(product.productSKU)
                    })
                }
            }
        },

        getUserActiveProductsForEnvironment(cb) {

            if (this.userActiveProductState === 'fetching') {
                k('already fetching!')
                return false
            }

            if (this.appOffline) {
                k('cannot fetch, app offline!')
                return false
            }

            this.$store.commit('environmentProductAndTagState', 'fetching')

            var route = this.api.apiv4Route + 'api/productsList/userActiveProducts4Environment'
            k('getUserActiveProductsForEnvironment route: ', route)

            var req = {
                userLoginToken: this.userLoginToken,
                environmentName: this.environmentName,
                // excludeProductTypes: ['exclusiveContent'],
                includeTags: true
            }
            if (this.brand.excludedProductTypes) req.excludedProductTypes = this.brand.excludedProductTypes
            k('getUserActiveProductsForEnvironment req: ', req)

            this.api.post(route, req, (res) => {
                k('getUserActiveProductsForEnvironment res: ', res)

                if (res.success) {
                    if (res.userProducts) {
                        res.userProducts = res.userProducts.map(product => {
                            product.userActiveProduct = 1
                            return product
                        })
                    }

                    this.$store.commit('environmentTags', this.makeTagObj(res.tags))
                    this.$store.commit('environmentTagHeadingObj', this.makeTagHeadingObj(res.tags))

                    this.$store.commit('environmentProducts', res.userProducts || [])
                    this.$store.commit('environmentProductAndTagState', 'fetched')

                    // this.$q.notify({
                    //     message: 'Loaded library!',
                    //     type: 'positive',
                    //     icon: 'fas fa-check-circle',
                    //     position: 'bottom-left'
                    // })
                } else {
                    // Toast.create.negative('There was a problem retrieving product information. Please contact support.')
                }

                cb(res)
            })
        },

        getProductBundleInfo(bundleID, cb) {
           if (!bundleID) {
               cb(false)
               return false
           }

           var route = `${this.api.apiv4Route}api/productBundle/componentProductsMetadata?productID=${bundleID}`
           k('getProductBundleInfo req: ', route)

           this.api.get(route, (res) => {
               k('getProductBundleInfo res: ', res)

               if (res.success) {
                   cb(res)
               } else {
                   cb(false)
               }
           })
       },

        removeEnvironmentProductInfo() {
            k('removeEnvironmentProductInfo!')

            this.$store.commit('environmentTags', '')
            this.$store.commit('environmentTagHeadingObj', '')
            this.$store.commit('environmentProducts', '')
            this.$store.commit('environmentProductAndTagState', '')
        },

        removeUserActiveProductInfo() {
            k('removeUserActiveProductInfo!')

            this.$store.commit('userActiveProducts', '')
            this.$store.commit('userActiveProductState', '')
        },

        makeTagObj(tagData) {
            var tagObj = {}
            if (tagData && tagData.length > 0) {
                tagData.forEach((tag) => {
                    // k(tag)
                    if (!tagObj[tag.id]) tagObj[tag.id] = tag
                })
            }

            return tagObj
        },

        makeTagHeadingObj(tagData) {
            var tagHeadingObj = {}

            if (tagData && tagData.length > 0) {

                // sort by tagName
                var catArr = tagData.sort((a, b) => {
                    return this.j_.naturalSorter(a.tagName, b.tagName)
                })

                catArr.forEach((tag) => {
                    tag.selected = false
                    // if (tag.tagHeadingName === 'temp hidden') k('TAG: ', tag)

                    // todo: test excluding tag headings - for ewc
                    if (this.environmentJSON && this.environmentJSON.e.allowedTagHeadings) {
                        if (this.environmentJSON.e.allowedTagHeadings.indexOf(tag.tagHeadingName) === -1) {
                            // k('tagHeading not included: ', tag.tagHeadingName)
                            return false
                        }
                    }

                    var sanitizedTagName = tag.tagName.replace(/[^a-z0-9]/gi, '').toLowerCase()
                    if (tag.tagHeadingName === 'instructor') tag.tagHeadingName = 'instructors'

                    if (!tagHeadingObj[tag.tagHeadingName]) tagHeadingObj[tag.tagHeadingName] = {
                        tagHeadingID: tag.tagHeadingID,
                        opened: false
                    }
                    if (!tagHeadingObj[tag.tagHeadingName].tags) tagHeadingObj[tag.tagHeadingName].tags = {}
                    if (!tagHeadingObj[tag.tagHeadingName].tags[sanitizedTagName]) tagHeadingObj[tag.tagHeadingName].tags[sanitizedTagName] = tag
                })
            }

            // k('makeTagHeadingObj: ', tagHeadingObj)
            return tagHeadingObj
        },

        userHasAccess(productIDArr2Check) {
            // k('check if user has access: ', productIDArr2Check)
            var userHasAccess

            for (var i = 0; i < productIDArr2Check.length; i++) {
                var product = this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', Number(productIDArr2Check[i]))
                var productStatus = product ? product.userActiveProduct : ''

                // k('access to product? ', product, productStatus)
                if (productStatus) {
                    userHasAccess = true
                    break;
                }
            }
            return userHasAccess
        }
    }
}
