export const pvolveShopifyData = {
    data() {
        return {
            shopifyLookupTable: {
                '5485': '832198737977', // ankle weight 1.5 lb
                '5750': '832203685945', // ankle weight 3 lb
                '5486': '30280286221', // pball
                '5487': '30285070349', // hand weights
                '5488': '832212926521', // glider
                '5490': '1304968298553', // light ankle band
                '5693': '1561509986361', // heavy ankle band
                '5509': '30232936461', // form perfect sweatshirt
                '5510': '11126192397', // pvolve pullover hoodie
                '5511': '30260232205', // detroit tank
                '5512': '30265376781', // black pvolve cap
                '5513': '30247649293', // lets get cheeky tank
                '5514': '30249517069', // assletic crop top
                '5515': '30264066061', // pvolve grip socks
                '5516': '11126195533', // navy muscle tank
                '5517': '30251646989', // new york city tank
                '5518': '30261608461', // los angeles tank
                '5519': '30267408397', // grey and white trucker hat
                '5724': '774784548921', // p.band
                '5820': '1568183582777', // slant board
            },
        }
    },

    computed: {
        shopifyProductData() {
            return this.$store.state.shopifyProductData
        },

        currentProduct() {
            return this.$store.state.currentProduct
        },

        equipmentUsed() {
            return this.$store.state.equipmentUsed
        },
    },

    methods: {
        getShopifyProductDataIfNeeded() {
            k('getShopifyProductDataIfNeeded')

            if (!this.shopifyProductData) {
                this.api.get(this.api.apiv4Route + 'api/client/mypvolve/getShopifyProductData', res => {
                    kw('shopify: ', res)

                    // put it in the store
                    if (res.products) {
                        // res.products.forEach(product => {
                        //   k("shopifyProduct: ", product.title, product);
                        // });

                        this.$store.commit('shopifyProductData', res.products)
                        this.createMiniShopArray()
                    }
                })
            } else {
                this.createMiniShopArray()
            }
        },

        createMiniShopArray() {
            // if using channel product scope, there are no library tags
            let equipmentUsed = []

            const thisVideoTags = this.currentProduct.tags.split(',')
            // k('thisVideoTags: ', thisVideoTags)

            thisVideoTags.forEach(tagID => {
                k('looking for', tagID)
                k(this.shopifyLookupTable[tagID])

                if (this.shopifyLookupTable[tagID]) {
                    let product = this.j_.queryArrayFirstMatch(this.shopifyProductData, 'id', Number(this.shopifyLookupTable[tagID]))

                    if (product) {
                        // kw('mini shop product: ', product.title, product)

                        equipmentUsed.push({
                            title: product.title,
                            image: product.image.src,
                            price: product.variants[0].price,
                            link: 'https://www.pvolve.com/products/' + product.handle,
                        })
                    }
                }
            })

            kw('equipmentUsed')
            k(equipmentUsed)
            this.$store.commit('equipmentUsed', equipmentUsed)
        },
    },
}
