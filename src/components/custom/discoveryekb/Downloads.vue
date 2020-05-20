<template>
    <div class="q-pt-sm">
        <div v-if="productsList.length > 0" class="row">
            <div
                v-for="(item, index) in productsList"
                :key="index"
                class="col-xs-6 col-sm-4 col-md-3 col-lg-2"
                style="color: white; padding: .5rem;"
            >
                <!-- <div class="cardw"> -->
                    <product-card :componentData="item" />
                <!-- </div> -->
            </div>
        </div>
        <template v-else>
            <p class="text-white text-center" style="margin-top: 25px;">{{ notFoundMessage }}</p>
        </template>
    </div>

</template>

<script>
    import ProductCard from 'components/custom/discoveryekb/ProductCard'

    export default {
        props: ['searchTerm'],
        data: function() {
            return {
                localSearchTerm: null,
            }
        },
        watch: {
            searchTerm(){
                this.localSearchTerm = this.searchTerm;
            }
        },
        computed: {
            appOnline() {
                return !this.$store.state.appOffline
            },

            productsList() {
                let products = this.downloadedProducts;
                if (this.appOnline) {
                    products = products.concat(this.productDownloadQueue)
                }
                return products.filter(product => {
                    if (!this.localSearchTerm) {
                        return true;
                    }
                    return product.title.toLowerCase().includes(this.localSearchTerm.toLowerCase());
                });
            },
            productDownloadQueue() {
                return this.$store.state.productDownloadQueue;
            },
            downloadedProducts() {
                return this.$store.state.downloadedProducts;
            },
            notFoundMessage() {
                if(this.localSearchTerm) {
                    return `${this.$t('no_results_found_for')} ${this.localSearchTerm}`
                }
                return this.$t('no_downloads_yet');
            }
        },
        components: {
            ProductCard
        },
    }
</script>

<style scoped>
    .cards {
      text-align: center;
    }
    .cardw {
      display: inline-block;
      margin-left: 8px;
      margin-right: 8px;
      margin-top: 16px;
      width: 100%;
    }
</style>
