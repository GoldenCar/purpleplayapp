export const pvolveProductSectionTools = {

    data() {
        return {
            levelImageSrc(level) {
                let fileName
                if (level === 'beginner') fileName = `PLV157-18_StreamingUpdates_Icons_Bar_Beginner.png`
                if (level === 'intermediate') fileName = `PLV157-18_StreamingUpdates_Icons_Bar_Intermediate.png`
                if (level === 'advanced') fileName = `PLV157-18_StreamingUpdates_Icons_Bar_Advanced.png`
                return `https://vault.platformpurple.com/static/clients/mypvolve/${fileName}`
            },

            environmentProductFilterForTags(tagArr) {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    return tagArr.every((tag) => {
                        return product.tags.split(',').includes(tag)
                    })
                }) : []
            }
        }
    },

    computed: {
        // bundleProducts() {
        //     // kw('get bundle products')
        //     var channelProduct = this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', 148014)
        //     // k('channelProduct: ', channelProduct)
        //     return this.environmentProducts && channelProduct ? this.environmentProducts.filter((product) => {
        //         var includes = (channelProduct.bundleProducts.split(',').includes(String(product.productID)) && product.productType == 'bundleProduct') || (product.productType === 'exclusiveContent' && product.userActiveProduct)
        //         // var includes = channelProduct.bundleProducts.split(',').includes(String(product.productID)) && product.productType == 'bundleProduct'
        //         // k('includes: ', includes, channelProduct.bundleProducts.split(','), String(product.productID))
        //         return includes
        //     }) : ''
        // },

        homePageSections() {
            return this.$store.state.environment.json.homePageSections
        },

        beginnerHomePageSectionInfo() {
            return this.homePageSections.find((section) => { return section.id === 'beginners' })
        },

        tutorialProductOrder() {
            return [148818, 151688, 148822, 149438]
        },

        beginnerStructuredProducts() {
            return this.environmentProductFilterForTags(['5763', '15'])
        },

        intermediateStructuredProducts() {
            return this.environmentProductFilterForTags(['5763', '59'])
        },

        advancedStructuredProducts() {
            return this.environmentProductFilterForTags(['5763', '60'])
        },

        tutorialWorkouts() {
            let tutorialWorkouts = this.environmentProductFilterForTags(['5494'])
            return tutorialWorkouts.map((product) => {
                let productIndex = this.tutorialProductOrder.findIndex((item) => { return product.productID === item })
                product.productOrder = productIndex > -1 ? productIndex : tutorialWorkouts.length

                return product
            }).sort((a, b) => {
                return a.productOrder - b.productOrder
            })
        },

        tutorialWorkoutIDs() {
            return this.tutorialWorkouts ? this.tutorialWorkouts.map((workout) => workout.productID) : []
        },

        beginnerWorkouts() {
            return this.environmentProducts ? this.environmentProducts.filter((product) => {
                return product.tags.split(',').includes('15') && !product.tags.split(',').includes('5763')
            }).sort((a, b) => { return b.productID - a.productID }) : []
        },

        beginnerWorkoutIDs() {
            k('beginnerWorkouts: ', this.beginnerWorkouts)
            return this.beginnerWorkouts ? this.beginnerWorkouts.map((workout) => workout.productID) : []
        },

        intermediateWorkouts() {
            return this.environmentProducts ? this.environmentProducts.filter((product) => {
                return product.tags.split(',').includes('59') && !product.tags.split(',').includes('5763')
            }) : []
        },

        intermediateWorkoutIDs() {
            return this.intermediateWorkouts ? this.intermediateWorkouts.map((workout) => workout.productID) : []
        },

        advancedWorkouts() {
            return this.environmentProducts ? this.environmentProducts.filter((product) => {
                return product.tags.split(',').includes('60') && !product.tags.split(',').includes('5763')
            }) : []
        },

        advancedWorkoutIDs() {
            return this.advancedWorkouts ? this.advancedWorkouts.map((workout) => workout.productID) : []
        },

        heroComponentData() {
            return {
                "id": "beginnerHero",
                "component": "pvolveHero",
                "componentPath": "mypvolve/pvolveHero.html",
                "backgroundImageURL": "mypvolve/beginner_page_header.jpg",
                "backgroundColor": "#fff",
                // "heroTitle": "<span class='thinHeader' style='margin: 0;'>Tutorials, beginner <br /> workout plans & more.</span>",
                "textColor": "#fff",
                "padding": "2rem",
                "mobilePadding": "2rem",
                "overlayColor": "#522b23",
                "overlayOpacity": "0.5",
                "visibility": {}
            }
        },

        tutorialSectionComponentData() {
            return {
                "id": "tutorialProducts",
                "component": "productSection",
                "content": "specificProducts",
                "rowID": "tutorials",
                // "heading": "Tutorials",
                // "headingColor": "#555",
                "backgroundColor": "#fff",
                "productIDs": this.tutorialWorkoutIDs,
                "animated": true,
                "productDisplayLimit": 4,
                "columnCount": "four",
                "columnClass": "col-xs-12 col-sm-6 col-md-4 col-lg-3",
                "products": this.tutorialWorkouts,
                "useHorizontalScrolling": true
            }
        },

        beginnerSectionComponentData() {
            return {
                "id": "beginnerProducts",
                "component": "productSection",
                "content": "specificProducts",
                "rowID": "beginners",
                // "heading": "Beginner workouts",
                // "headingColor": "#555",
                "backgroundColor": "#fff",
                "productIDs": this.beginnerWorkoutIDs,
                "animated": true,
                "productDisplayLimit": 4,
                "columnCount": "four",
                "columnClass": "col-xs-12 col-sm-6 col-md-4 col-lg-3",
                "products": this.beginnerWorkouts,
                "useHorizontalScrolling": true
            }
        },

        intermediateSectionComponentData() {
            return {
                "id": "beginnerProducts",
                "component": "productSection",
                "content": "specificProducts",
                "rowID": "intermediateWorkouts",
                // "heading": "Beginner workouts",
                // "headingColor": "#555",
                "backgroundColor": "#fff",
                "productIDs": this.intermediateWorkoutIDs,
                "animated": true,
                "productDisplayLimit": 4,
                "columnCount": "four",
                "columnClass": "col-xs-12 col-sm-6 col-md-4 col-lg-3",
                "products": this.intermediateWorkouts,
                "useHorizontalScrolling": true
            }
        },

        advancedSectionComponentData() {
            return {
                "id": "beginnerProducts",
                "component": "productSection",
                "content": "specificProducts",
                "rowID": "advancedWorkouts",
                // "heading": "Beginner workouts",
                // "headingColor": "#555",
                "backgroundColor": "#fff",
                "productIDs": this.advancedWorkoutIDs,
                "animated": true,
                "productDisplayLimit": 4,
                "columnCount": "four",
                "columnClass": "col-xs-12 col-sm-6 col-md-4 col-lg-3",
                "products": this.advancedWorkouts,
                "useHorizontalScrolling": true
            }
        },

        beginnerStructuredProductComponentData() {
            return {
                "id": "pvolveBeginnerStructuredProducts",
                "component": "pvolveStructuredProducts",
                "componentPath": "mypvolve/pvolveStructuredProducts.html",
                // "heading": "P's structured plans for beginners",
                // "headingColor": "#555",
                "backgroundColor": "#fff",
                "columnClass": "col-xs-12 col-sm-6 col-md-4 col-lg-3",
                "customStructuredProductsStringForDisplay": "beginnerStructuredProducts",
                "visibility": {}
            }
        },

        intermediateStructuredProductComponentData() {
            return {
                "id": "pvolveIntermediateStructuredProducts",
                "component": "pvolveStructuredProducts",
                "componentPath": "mypvolve/pvolveStructuredProducts.html",
                // "heading": "P's structured plans for beginners",
                // "headingColor": "#555",
                "backgroundColor": "#fff",
                "columnClass": "col-xs-12 col-sm-6 col-md-4 col-lg-3",
                "customStructuredProductsStringForDisplay": "intermediateStructuredProducts",
                "visibility": {}
            }
        },

        advancedStructuredProductComponentData() {
            return {
                "id": "pvolveAdvancedStructuredProducts",
                "component": "pvolveStructuredProducts",
                "componentPath": "mypvolve/pvolveStructuredProducts.html",
                // "heading": "P's structured plans for beginners",
                // "headingColor": "#555",
                "backgroundColor": "#fff",
                "columnClass": "col-xs-12 col-sm-6 col-md-4 col-lg-3",
                "customStructuredProductsStringForDisplay": "advancedStructuredProducts",
                "visibility": {}
            }
        }
    }
}
