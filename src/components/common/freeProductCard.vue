<template>

    <q-card @click.native="launchFreeProduct(componentData)" color="white" style="height: calc(100% - .5rem); margin: 0;">
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
    import { productCardTools } from '../../mixins/productCardTools'

    export default {
        props: ['componentData', 'freeProduct'],

        mixins: [productCardTools],

        data() {
            return {

            }
        },

        computed: {

        },

        methods: {

        }
    }
</script>

<style>

</style>
