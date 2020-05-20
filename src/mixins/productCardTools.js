export const productCardTools = {
    props: ['componentData', 'notSelectable'],

    computed: {
        coverImageURL() {
            return 'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + this.componentData.productSKU + '/' + this.coverImageFileName
        },

        coverImageFileName() {
            return this.componentData.coverImageFileName ? this.componentData.coverImageFileName : this.componentData.productSKU + '_image_cover.png'
        },

        owned() {
            return this.componentData.userActiveProduct
        },

        canBePlayed() {
            return this.componentData.webplayer
        },

        brandColor() {
            return this.brand.brandColor
        },

        playChipStyle() {
            return this.brandColor ? 'color: ' + this.brandColor + ' !important ;' : ''
        },

        ownedChipStyle() {
            return 'margin-top: .5rem;' + (this.brandColor ? 'background: ' + this.brandColor + ' !important ; color: #fff;' : '')
        },

        giftable() {
            return this.componentData.productType !== 'test_bundleProduct' && this.componentData.productType !== 'bundleProduct'
        },

        currentView() {
            return this.$store.state.currentView
        },

        cart() {
            return this.$root.$store.state.cart
        },

        inCart() {
            var product = this.componentData
            var inCart = false
            this.cart.forEach((item) => {
                if (item.productID == product.productID && !item.recipientName) {
                    inCart = true
                }
            })
            if (product.recipientName) inCart = false
            return inCart
        },
    },

    created() {
        // k('is ' + this.componentData.productName + ' owned: ', this.owned)
        // k('is ' + this.componentData.productName + ' in cart: ', this.inCart)
    },

    methods: {

        // should these actions emit so the parent component can run a function? instead of passing in "notSelectable"
        selectItem() {
            k('selectItem: ', this.componentData)
            k('canBePlayed: ', this.canBePlayed)
            k('owned: ', this.owned)
            k('notSelectable: ', this.notSelectable)


            if (this.notSelectable) return false

            // if (this.currentView == 'myLibrary' && !this.canBePlayed) {
            //     k('item cannot be played')
            // }

            if (this.owned && this.canBePlayed) {
                this.$store.commit('setProductLaunchContext', 'productCard')
                this.route('/play/' + this.componentData.productID)
            } else {
                this.$store.commit('setProductID2Preview', this.componentData.productID)

                if (this.currentView === 'productPreview') {
                    this.route('/shop/' + this.componentData.productID)
                } else {
                    this.$root.$emit('openProductPreview', true)
                }
            }
        },

        giftItem() {
            k('giftItem: ', this.componentData)
            if (this.notSelectable) return false

            // this.route('/shop/' + this.componentData.productID)
            this.$store.commit('setProductID2Preview', this.componentData.productID)
            this.$root.$emit('openProductPreview', true)
        }
    },
}
