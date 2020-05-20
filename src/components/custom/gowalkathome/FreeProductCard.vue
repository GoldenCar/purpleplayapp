<template>

    <q-card @click.native="launchFreeProduct(componentData)" color="white" style="height: 100%; margin: 0;">
       <img
           :src="coverImageURL"
           style="max-width: 100%; cursor-pointer; margin: 0 auto; display: block;"
       />
       <q-card-main>
           <div class="text-grey-8 monty" align="center">
               {{ componentData.productName }}
           </div>
       </q-card-main>
    </q-card>

</template>

<script>
    import { productCardTools } from '../../../mixins/productCardTools'

    export default {
        props: ['componentData', 'freeProduct'],

        mixins: [productCardTools],

        data() {
            return {

            }
        },

        computed: {
            coverImageURL() {
                return `https://f3r6v6t8.ssl.hwcdn.net/static/previews/${this.componentData.productSKU}/${this.componentData.productSKU}_ws.jpg`
            }
        },

        methods: {

        }
    }
</script>

<style>

</style>
