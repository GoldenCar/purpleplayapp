export const pvolveLibrarySortTools = {
    computed: {
        environmentProducts() {
            return this.$store.state.environmentProducts
        },

        userPreferences() {
            return this.$store.state.user.preferences
        },

        sortLibraryTopRated() {
            return this.$store.state.sortLibraryTopRated
        },

        sortLibraryMostRecent() {
            return this.$store.state.sortLibraryMostRecent
        },

        showFavoritesOnly() {
            return this.$store.state.showFavoritesOnly
        },

        showExclusiveContentOnly() {
            return this.$store.state.showExclusiveContentOnly
        },

        mediaFavoritesPreference() {
            return this.userPreferences ? this.userPreferences.find(preference => preference.type === 'mediaFavorites') : null
        },

        favoritedProductIDs() {
            return this.mediaFavoritesPreference && this.mediaFavoritesPreference.favorites ? this.mediaFavoritesPreference.favorites : []
        },

        exclusiveProducts() {
            return this.environmentProducts ? this.environmentProducts.filter((product) => {
                // k('exclusiveProduct: ', product.productName, product)
                return product.productType === 'exclusiveContent' && product.userActiveProduct && product.webplayer
            }) : []
        }
    },

    methods: {
        sortLibrary(type) {
            switch (type) {
                case 'exclusiveContent':
                    this.$store.commit('setShowExclusiveContentOnly', !this.showExclusiveContentOnly)
                    this.$store.commit('setShowFavoritesOnly', false)
                    this.$store.commit('sortLibraryTopRated', false)
                    this.$store.commit('sortLibraryMostRecent', false)
                    break;

                case 'favorites':
                    this.$store.commit('setShowExclusiveContentOnly', false)
                    this.$store.commit('setShowFavoritesOnly', !this.showFavoritesOnly)
                    this.$store.commit('sortLibraryTopRated', false)
                    this.$store.commit('sortLibraryMostRecent', false)
                    break;

                case 'topRated':
                    this.$store.commit('setShowExclusiveContentOnly', false)
                    this.$store.commit('setShowFavoritesOnly', false)
                    this.$store.commit('sortLibraryTopRated', !this.sortLibraryTopRated)
                    this.$store.commit('sortLibraryMostRecent', false)
                    break;

                case 'mostRecent':
                    this.$store.commit('setShowExclusiveContentOnly', false)
                    this.$store.commit('setShowFavoritesOnly', false)
                    this.$store.commit('sortLibraryTopRated', false)
                    this.$store.commit('sortLibraryMostRecent', !this.sortLibraryMostRecent)
                    break;

                default:
                    this.$store.commit('setShowExclusiveContentOnly', false)
                    this.$store.commit('setShowFavoritesOnly', false)
                    this.$store.commit('sortLibraryTopRated', false)
                    this.$store.commit('sortLibraryMostRecent', false)
            }
        }
    }
}
