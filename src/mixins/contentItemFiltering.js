// import store from './../main';
// import Vue from 'vue'
// import store from './store'
// import api from './api'
// import j_ from '@jmellicker/j_'
// const s = store._modules.root.state

export const contentItemFiltering = {
    computed: {
        environmentProducts() {
            return this.$store.state.environmentProducts
        },

        environmentTags() {
            return this.$store.state.environmentTags
        },

        userActiveProducts() {
            return this.environmentProducts ? this.environmentProducts.filter(product => {
                return product.userActiveProduct && product.webplayer
            }) : ''
        },
    },

    methods: {
        getProductsThatMatchTags(userSelectedTagsArr, productSelectionToFilter, strictThreshold) {
            // k('get products that match tags: ', userSelectedTagsArr)
            if (!userSelectedTagsArr || !productSelectionToFilter) return []
            if (!strictThreshold) strictThreshold = 0
            k('strictThreshold: ', strictThreshold)

            userSelectedTagsArr = userSelectedTagsArr.map(tag => {
                return Number(tag)
            })

            var filters
            if (this.brand.customTagFilterMethod) {
                filters = this[this.brand.customTagFilterMethod](userSelectedTagsArr, productSelectionToFilter, strictThreshold)
            } else {
                filters = this.defaultProductsThatMatchTags(userSelectedTagsArr, productSelectionToFilter, strictThreshold)
            }

            var strictFilter = filters.strictFilter
            var lenientFilter = filters.lenientFilter

            // to check if strcitFilter is working
            // var strictFilterNames = strictFilter.map((product) => {
            //     return product.productName
            // })
            // kw('strictFilter productNames: ', strictFilterNames)

            var results
            if (strictFilter.length && strictFilter.length >= strictThreshold) {
                results = strictFilter
            } else {
                results = lenientFilter
            }

            k('tag results: ', strictFilter.length ? 'strict' : 'lenient', results)
            return results
        },

        defaultProductsThatMatchTags(userSelectedTagsArr, productSelectionToFilter, strictThreshold) {
            var strictFilter = this.strictProductToTagMatch(userSelectedTagsArr, productSelectionToFilter)
            var lenientFilter = this.lenientProductToTagMatch(userSelectedTagsArr, productSelectionToFilter)
            kw('strictFilter: ', strictFilter)
            kw('lenientFilter: ', lenientFilter)

            return {
                strictFilter: strictFilter,
                lenientFilter: lenientFilter,
            }
        },

        getProductsThatMatchTagsPvolve(userSelectedTagsArr, productSelectionToFilter, strictThreshold) {
            var tagsToMatch = this.j_.cloneObject(userSelectedTagsArr)

            // if any equipment tags are selected, include 'No Equipment' 5542
            var userSelectedTagsArrContainsEquipmentTags = userSelectedTagsArr.filter(tagID => {
                var fullTag = this.environmentTags[String(tagID)]
                // k('tagID: ', tagID, this.environmentTags, fullTag)
                return fullTag && fullTag.tagHeadingID == 44
            }).length
                ? true
                : false
            k('userSelectedTagsArrContainsEquipmentTags: ', userSelectedTagsArrContainsEquipmentTags)

            if (userSelectedTagsArr.length && userSelectedTagsArrContainsEquipmentTags) {
                // no equipment
                if (!userSelectedTagsArr.includes(5542)) tagsToMatch.push(5542)

                // p.step
                if (!userSelectedTagsArr.includes(5758)) tagsToMatch.push(5758)
            }
            k('tagsToMatch: ', tagsToMatch)

            var strictFilter = this.strictProductToTagMatchPvolve(tagsToMatch, productSelectionToFilter)
            var lenientFilter = this.lenientProductToTagMatch(tagsToMatch, productSelectionToFilter)
            kw('strictFilter: ', strictFilter)
            kw('lenientFilter: ', lenientFilter)

            k('tagsToMatch: ', tagsToMatch)
            if (tagsToMatch.includes(5542) && tagsToMatch.includes(5758) && tagsToMatch.length === 2) {
                strictFilter = lenientFilter
            }

            return {
                strictFilter: strictFilter,
                lenientFilter: lenientFilter,
            }
        },

        strictProductToTagMatchPvolve(userSelectedTagsArr, productSelectionToFilter) {
            k('strictProductToTagMatchPvolve: ', userSelectedTagsArr, this.environmentTags)

            // get userSelectedTagsArr with full tag info
            var fullTagArr = userSelectedTagsArr
                .filter(tagID => {
                    return this.environmentTags[String(tagID)]
                })
                .map(tagID => {
                    return this.environmentTags[String(tagID)]
                })
            k('fullTagArr: ', fullTagArr)

            // gather allUnqiueTagHeadingIDs for comparison
            var allUnqiueTagHeadingIDs = this.j_.queryArrayAllUniqueValues(fullTagArr, 'tagHeadingID')
            k('allUnqiueTagHeadingIDs: ', allUnqiueTagHeadingIDs)

            var userSelectedTagsArrContainsEquipmentTags = userSelectedTagsArr.filter(tagID => {
                var fullTag = this.environmentTags[String(tagID)]
                // k('tagID: ', tagID, this.environmentTags, fullTag)
                return fullTag && fullTag.tagHeadingID == 44
            }).length
                ? true
                : false
            k('userSelectedTagsArrContainsEquipmentTags: ', userSelectedTagsArrContainsEquipmentTags)

            // make arr of all equipment tags that are disallowed if any equipment tags are selected
            var disallowedEquipmentTagIDArr = userSelectedTagsArrContainsEquipmentTags
                ? this.j_
                      .convertObj2array(this.j_.cloneObject(this.environmentTags))
                      .filter(tag => {
                          // k('disallowTag? ', tag, String(tag.id), userSelectedTagsArr.includes(String(tag.id)))
                          return tag.tagHeadingID == 44 && !userSelectedTagsArr.includes(tag.id)
                      })
                      .map(tag => {
                          return tag.id
                      })
                : []
            k('disallowedEquipmentTagIDArr: ', disallowedEquipmentTagIDArr)

            // filter product productSelectionToFilter by their productTagIDArr matching at least one tag in each allUnqiueTagHeadingIDs
            var matchesStrict = productSelectionToFilter.filter(product => {
                // k('~~~~~~~~~~~~~~~~~~')
                // k('for product ', product.productName)

                // get productTagIDArr from comma deliniated list
                var productTagIDArr = product.tags.includes(',') ? product.tags.split(',') : product.tags
                // k('productTagIDArr: ', productTagIDArr)

                // filter all of the equipment tags present in product tags, if any match disallowed, product is disallowed
                var productContainsDisallowedTags = false
                if (disallowedEquipmentTagIDArr.length)
                    productTagIDArr.forEach(productTagID => {
                        // k('checking product tag id: ', productTagID, disallowedEquipmentTagIDArr.includes(productTagID))
                        if (disallowedEquipmentTagIDArr.includes(Number(productTagID))) productContainsDisallowedTags = true
                    })

                // get productMatchedTagHeadings
                var productMatchedTagHeadings = allUnqiueTagHeadingIDs.filter(tagHeadingID => {
                    // k('tagHeadingID: ', tagHeadingID)

                    // does product match at least one tag in each tagHeading ID
                    var tagsForHeading = fullTagArr.filter(tag => {
                        return String(tag.tagHeadingID) === tagHeadingID
                    })
                    // k('tagsForHeading: ', tagsForHeading)

                    // get productMatchedTagsForHeading based on tag ids
                    var productMatchedTagsForHeading = tagsForHeading.filter(tag => {
                        return productTagIDArr.includes(String(tag.id))
                    })
                    // k('productMatchedTagsForHeading: ', productMatchedTagsForHeading)

                    return productMatchedTagsForHeading.length ? tagHeadingID : false
                })
                // k('product matches strict: ', productMatchedTagHeadings.length, allUnqiueTagHeadingIDs.length)
                // k('allUserSelectedEquipmentTagsAreIncludedInProductTags: ', allUserSelectedEquipmentTagsAreIncludedInProductTags)

                return productMatchedTagHeadings.length === allUnqiueTagHeadingIDs.length && !productContainsDisallowedTags
            })
            // k('matchesStrict: ', matchesStrict)

            return matchesStrict
        },

        strictProductToTagMatch(userSelectedTagsArr, productSelectionToFilter) {
            // k('strictProductToTagMatch: ', userSelectedTagsArr, this.environmentTags)

            // get userSelectedTagsArr with full tag info
            var fullTagArr = userSelectedTagsArr
                .filter(tagID => {
                    return this.environmentTags[String(tagID)]
                })
                .map(tagID => {
                    return this.environmentTags[String(tagID)]
                })
            k('fullTagArr: ', fullTagArr)

            // gather allUnqiueTagHeadingIDs for comparison
            var allUnqiueTagHeadingIDs = this.j_.queryArrayAllUniqueValues(fullTagArr, 'tagHeadingID')
            k('allUnqiueTagHeadingIDs: ', allUnqiueTagHeadingIDs)

            // filter product productSelectionToFilter by their productTagIDArr matching at least one tag in each allUnqiueTagHeadingIDs
            var matchesStrict = productSelectionToFilter.filter(product => {
                // get productTagIDArr from comma deliniated list
                var productTagIDArr = product.tags.includes(',') ? product.tags.split(',') : product.tags
                // k('productTagIDArr: ', productTagIDArr)

                // get productMatchedTagHeadings
                var productMatchedTagHeadings = allUnqiueTagHeadingIDs.filter(tagHeadingID => {
                    // does product match at least one tag in each tagHeading ID
                    var tagsForHeading = fullTagArr.filter(tag => {
                        return String(tag.tagHeadingID) === tagHeadingID
                    })
                    // k('tagsForHeading: ', tagsForHeading)

                    // get productMatchedTagsForHeading based on tag ids
                    var productMatchedTagsForHeading = tagsForHeading.filter(tag => {
                        return productTagIDArr.includes(String(tag.id))
                    })
                    // k('productMatchedTagsForHeading: ', productMatchedTagsForHeading)

                    return productMatchedTagsForHeading.length ? tagHeadingID : false
                })
                // k('product matches strict: ', productMatchedTagHeadings.length, allUnqiueTagHeadingIDs.length)

                return productMatchedTagHeadings.length === allUnqiueTagHeadingIDs.length
            })
            // k('matchesStrict: ', matchesStrict)

            return matchesStrict
        },

        lenientProductToTagMatch(userSelectedTagsArr, productSelectionToFilter) {
            var results = {}
            userSelectedTagsArr.forEach(tagID => {
                // k('for tag: ', tagID)
                productSelectionToFilter.forEach(product => {
                    // k('productTags: ', product.productName, product.tags, product.tags.indexOf(String(tagID)))
                    var productTagArr = product.tags.includes(',') ? product.tags.split(',') : product.tags
                    if (productTagArr.includes(String(tagID))) results[product.productID] = product
                })
            })

            var resultArr = this.j_.convertObj2array(results)
            return resultArr
        },

        wordToNumber(word) {
            var words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen']
            return words.indexOf(word)
        },

        specificProducts(section) {
            var products = []
            section.productIDs.forEach(pid => {
                var product = this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', Number(pid))
                // console.log('PRODUCT: ', product, pid)
                if (product) products.push(product)
            })

            return products
        },

        randomProducts(section) {
            var productNumber = this.wordToNumber(section.columnsPerRow) || 6
            var moreProductsThanLimit = this.environmentProducts.length > productNumber
            return moreProductsThanLimit ? this.randomProductsFromSelection(productNumber, this.environmentProducts) : this.environmentProducts.slice(0, productNumber)
        },

        ownedProducts(section) {
            var productNumber = this.wordToNumber(section.columnsPerRow) || 6
            // todo: ~ need to make this a mixin to have access to computed
            var moreProductsThanLimit = this.userActiveProducts.length > productNumber
            return moreProductsThanLimit ? this.randomProductsFromSpecificScope(productNumber, this.userActiveProducts) : this.userActiveProducts.slice(0, productNumber)
        },

        randomFromTagProducts(section) {
            var products = this.getProductsThatMatchTags(section.categories, this.environmentProducts, 6)
            // k('randomFromTagProducts: ', products)

            // filter selection: available4Sale
            products = products.filter(product => {
                return product.available4Sale
            })
            // k('randomFromTagProducts available4Sale: ', products)

            return this.j_.shuffleArray(products).slice(0, this.wordToNumber(section.columnsPerRow) || 6)
        },

        randomProductsFromSelection(numProducts, selection) {
            var randomProducts = []
            var randomIntegers = []

            // filter selection: available4Sale
            selection = selection.filter(product => {
                return product.available4Sale
            })

            if (selection.length <= numProducts) {
                randomProducts = selection
            } else {
                var i = 0
                while (randomProducts.length < numProducts) {
                    // only repeat until desired amount and not trying more than there are products
                    var randomInteger = this.j_.randomInteger(0, selection.length - 1)
                    if (randomIntegers.indexOf(randomInteger) === -1) {
                        // check for duplicate random number
                        var randomProduct = selection[randomInteger]
                        randomProducts.push(randomProduct)
                        randomIntegers.push(randomInteger)
                        i++
                    }
                }
            }
            // k('randomProducts: ', randomProducts)
            return randomProducts
        },

        generateTagsArrUnderTagHeadings(tagsArr) {
            var tagsArrUnderTagHeadings = {}
            // k('generate tags under tag headings', tagsArr)
            var tagsArrByHeading = tagsArr.map(tagID => {
                // k(tagID)
                var fullTag = this.allShopTags[tagID]
                if (!tagsArrUnderTagHeadings[fullTag.tagHeadingID]) {
                    tagsArrUnderTagHeadings[fullTag.tagHeadingID] = {
                        tagHeadingID: fullTag.tagHeadingID,
                        tagHeadingName: fullTag.tagHeadingName,
                        tags: [],
                    }
                }
                if (tagsArrUnderTagHeadings[fullTag.tagHeadingID].tags.indexOf(tagID) === -1) {
                    tagsArrUnderTagHeadings[fullTag.tagHeadingID].tags.push(tagID)
                }
            })

            // k('tagsArrUnderTagHeadings: ', tagsArrUnderTagHeadings)
            return tagsArrUnderTagHeadings
        },
    },
}
