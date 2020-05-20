export const globalComputedData = {
    computed: {
        windowWidth() {
            return this.$store.state.windowWidth
        },

        goingTo() {
            return this.$store.state.goingTo
        },

        brandColor() {
            return this.brand.brandColor
        },

        toolbarStyle() {
            return this.brandColor ? 'background: ' + this.brandColor + ' !important ;' : ''
        },

        initialParameters() {
            return this.$store.state.initialParameters
        },

        currentView() {
            return this.$store.state.currentView
        },

        authenticated() {
            return this.$store.state.user.authenticated
        },

        userInfo() {
            return this.$store.state.user.info
        },

        userPreferences() {
            return this.$store.state.user.preferences
        },

        userPreferencesState() {
            return this.$store.state.user.preferencesState
        },

        userLoginToken() {
            return this.$store.state.user.userLoginToken
        },

        environment() {
            return this.$store.state.environment
        },

        environmentName() {
            return this.$store.state.environment.name
        },

        environmentData() {
            return this.$store.state.environment.data
        },

        environmentJSON() {
            return this.$store.state.environment.json
        },

        organizationID() {
            return this.$store.state.environment.data.organizationID
        },

        environmentProducts() {
            return this.$store.state.environmentProducts
        },

        environmentProductAndTagState() {
            return this.$store.state.environmentProductAndTagState
        },

        environmentTags() {
            return this.$store.state.environmentTags
        },

        environmentTagHeadingObj() {
            return this.$store.state.environmentTagHeadingObj
        },

        userSelectedTags() {
            return this.$store.state.userSelectedTags
        },

        userActiveProducts() {
            return this.environmentProducts ? this.environmentProducts.filter((product) => {
                return product.userActiveProduct
            }) : ''
        },

        forSaleProducts() {
            return this.environmentProducts ? this.environmentProducts.filter((product) => {
                return product.available4Sale
            }) : ''
        },

        currentProduct() {
            return this.$store.state.currentProduct
        },

        cart() {
            return this.$store.state.cart
        },

        userSubscriptionProductStatusHistory() {
            return this.$store.state.userSubscriptionProductStatusHistory
        }
    }
}
