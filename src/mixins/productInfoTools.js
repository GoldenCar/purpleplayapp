export const productInfoTools = {
    computed: {
        userLoginToken() {
            return this.$store.state.user.userLoginToken
        },
    },

    methods: {
        getProductMetaFromAPI(productID, cb) {
            var req = {
                "userLoginToken": this.userLoginToken,
                "productID": productID
            }

            k('getProductMetaFromAPI req: ', req)

            // this.api.post(this.api.apiv3Route + 'product/mediaMeta', req, (res) => {

            let route = this.api.apiv4Route + 'api/product/metadata4ProductIDAndUserAccess'
            k('getProductMetaFromAPI route: ', route)

            this.api.post(route, req, (res) => {
                k('getProductMetaFromAPI res: ', res)

                if (!res || res.error) {
                    this.$q.notify({
                        message: 'Problem getting product media.',
                        type: 'negative',
                        icon: 'fas fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                }

                cb(res)
            })
        },

        // getProductPreviewDataFromAPI(productID, cb) {
        //     this.api.get(this.api.apiv3Route + 'product/' + productID, (res) => {
        //         k('getProductPreviewDataFromAPI: ', res)
        //         cb(res)
        //     })
        // }
    }
}
