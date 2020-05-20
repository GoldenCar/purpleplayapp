import { globalComputedData } from '../../../mixins/globalComputedData'
import { authentication } from '../../../mixins/authentication'

export const pvolveSignUpTools = {
    data() {
        return {
            subscribeRoute: 'api/client/mypvolve/subscribeUser2MailingList',
            
            showGeoBlock: false,
            
            userEmailInput: '',
            fieldError: {
                userEmail: false
            },
            
            userIPInfo: ''
        }
    },
    
    mixins: [ globalComputedData, authentication ],
    
    computed: {
        
    },
    
    methods: {
        // checkIfUserOwnsProduct() {
        //     k('checkIfUserOwnsProduct pvolveSignUp')
        //     k(this.environmentProducts)
            
        //     // now have environmentProducts
        //     this.$q.loading.hide()
            
        //     if (this.environmentJSON.e.validSubscriptionProductIDs && this.userHasAccess(this.environmentJSON.e.validSubscriptionProductIDs)) {
        //         kw('user has access')   

        //         this.redirectUserThatHasAccess()
        //     } else {
        //         if (this.previouslyOwnedTrial) {
        //             //user had previously had trial
        //             k('userPreviouslyOwned')
                    
        //             this.redirectUserThatPreviouslyHadAccess()
        //         } else {
        //             // user has not previosuly had trial
        //             k('user needs to checkout')
        //         }
        //     }
        // },
        
        redirectUserThatHasAccess() {
            if (this.signUpModalOpen) this.signUpModalOpen = false
            this.route('/library')
            
            this.$q.notify({
                message: 'You are already subscribed! Redirecting you to your library.',
                type: 'positive',
                icon: 'fas fa-check-circle',
                position: 'bottom-left'
            })
        },
        
        redirectUserThatPreviouslyHadAccess() {
            if (this.signUpModalOpen) this.signUpModalOpen = false
            this.goToSignUpNow()
            
            this.$q.notify({
                message: 'Your trial has ended. Redirecting you to sign up for the subscription.',
                type: 'positive',
                icon: 'fas fa-check-circle',
                position: 'bottom-left'
            })
        },
        
        goToSignUpNow() {
            this.$store.commit('addKeyPathInStore', { keyPath: 'initialParameters.signUpNow', value: true })
            this.route('/offer/special?signUpNow=true')
        },
                
        addUserToEmailList(userEmail, listName, mergeFields, cb) {
            // https://api-v4-dev2.platformpurple.com/api/client/mypvolve/subscribeUser2MailingList

            var req = {
                userEmail: userEmail,
                listName: listName
            }
            
            if (mergeFields) req.mergeFields = mergeFields
            
            k('addUserToEmailList req: ', req)
            
            this.api.post(this.api.apiv4Route + this.subscribeRoute, req, (res) => {
                k('addUserToEmailList res: ', res)
                
                cb(res.success)
            })
        },
        
        checkGeoBlocking(cb) {
            this.api.get(this.api.ioRoute + 'events/userIPInfo', (res) => {
                k('checkGeoBlocking res: ', res)
                
                if (res) {
                    this.userIPInfo = res
                    
                    // todo: for testing 
                    // if (res.country_code && res.country_code === 'US') {
                        
                    if (res.country_code && res.country_code === 'AU' || res.country_code === 'NZ') {
                        cb(true)
                    } else {
                        cb(false)
                    }
                } else {
                    cb(false)
                }
            })
        },
        
        geoBlockedUserToEmailList() {
            if (this.userEmailInput) {
                this.addUserToEmailList(this.userEmailInput, '6ba594722b', { MMERGE6: this.userIPInfo.country_code }, (success) => {
                    // alert user
                    this.$q.notify({
                        message: success ? 'You have been added to our email list!' : 'There was an issue, please try again.',
                        type: success ? 'positive' : 'negative',
                        icon: success ? 'fas fa-check-circle' : 'fas fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                })
            } else {
                this.fieldError.userEmail = true
            }
        },
    }
}