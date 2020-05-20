<template>

    <div class="pvolveCard">
        <div class="topRightHeader">
            <div v-if="productIsQueued || productIsDownloading || productIsDownloaded" class="pchip" :style="'background: ' + pvolveSalmon + ';'">
                <h6 style="margin: 0; font-size: .7rem;" v-if="productIsQueued && !productIsDownloading">QUEUED</h6>
                <h6 style="margin: 0; font-size: .7rem;" v-if="productIsDownloading">DOWNLOADING</h6>
                <h6 style="margin: 0; font-size: .7rem;" v-if="productIsDownloaded">DOWNLOADED</h6>
            </div>
        </div>

        <img style="max-width: 100%;" :src="coverImageURL" />

        <h6 style="margin: .5rem 0; color: #524F4C;">{{ componentData.productName }}</h6>

        <div v-if="downloadAllowed" class="bottomHeader" align="center">
            <q-inner-loading :visible="downloadLoader" />

            <q-progress
                color="green"
                height="10px"
                v-if="productIsDownloading && currentProductFileDownloadingProgress"
                :percentage="Number(currentProductFileDownloadingProgress)"
                :style="`color: ${pvolveMintTitle} !important;`"
            />

            <q-btn v-if="!productIsDownloading && !productIsDownloaded && !productIsQueued" outline size="sm" class="full-width" @click.stop="downloadItem(componentData)" style="padding: 0 .5rem; background: #fff !important; color: #333;">
                <q-icon name="fas fa-download" style="font-size: .7rem;" />
                <h6 style="font-size: .7rem; margin: 0; letter-spacing: 1px;">Download</h6>
            </q-btn>

            <q-btn v-if="productIsDownloading" outline size="sm" class="full-width" @click.stop="cancelProductDownload()" style="padding: 0 .5rem; background: #fff !important; color: #333;">
                <span v-if="currentProductFileDownloadingIndex && productFileDownloads">File: {{currentProductFileDownloadingIndex + 1}}/{{productFileDownloads.length}}</span>
                <q-icon color="red" name="fas fa-ban" style="font-size: .7rem;" />
                <h6 style="font-size: .7rem; margin: 0; letter-spacing: 1px;">Cancel</h6>
            </q-btn>

            <q-btn v-if="productIsDownloaded" outline size="sm" class="full-width" @click.stop="deleteLocalProduct(componentData.productSKU)" style="padding: 0 .5rem; background: #fff !important; color: #333;">
                <q-icon color="red" name="fas fa-times" style="font-size: .7rem;" />
                <h6 style="font-size: .7rem; margin: 0; letter-spacing: 1px;">Delete</h6>
            </q-btn>

        </div>
    </div>

</template>

<script>

    import { pvolveColors } from './pvolveColors'
    import { productCardTools } from '../../../mixins/productCardTools'
    import { productCardDownloadTools } from '../../../mixins/productCardDownloadTools'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['componentData', 'notSelectable', 'freeProduct'],

        mixins: [pvolveColors, productCardTools, productCardDownloadTools, userAndProductInfo, globalComputedData],

        data() {
            return {

            }
        },

        computed: {
            coverImageURL() {
                return 'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + this.componentData.productSKU + '/' + this.coverImageFileName
            },

            coverImageFileName() {
                return this.componentData.productSKU + '_500px_cover.png'
            },
        },

        methods: {

        },

        watch: {

        },

        created() {

        }
    }
</script>

<style scoped>
    .pvolveCard {
        /*background-size: cover !important;*/
        /*background-position: 50% !important;*/
        background: #f5f5f5;
        position: relative;
        height: 100%;
        padding: .5rem;
        /*border: 1px solid #c7c7c7;*/
        cursor: pointer;
        padding-bottom: 2.5rem;
    }

    .topRightHeader {
        /* background: rgba(0, 0, 0, .4); */
        text-align: right;
        font-size: .9rem;
        color: #fff;
        vertical-align: middle;
        position: absolute;
        top: 1rem;
        right: 0;
    }

    .pchip {
        /* width: fit-content; */
        color: #fff;
        padding: .25rem .5rem;
        margin: 0;
    }

    .bottomHeader {
        /* background: rgba(0, 0, 0, .5); */
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        /* padding: .25rem 0; */
        display: inline;
        word-wrap: break-word;
    }

</style>
