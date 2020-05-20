<template>

    <div class="shadow-4 bg-white relative-position" style="height: 100%; padding-bottom: 3rem; border-radius: .25rem;">

        <div class="topRightHeader">
            <q-btn :color="productIsDownloading ? 'grey' : productIsQueued ? 'orange' : productIsDownloaded ? 'green' : ''" v-if="productIsDownloading || productIsDownloaded || productIsQueued" size="xs">
                <!-- {{productIsDownloading ? 'DOWNLOADING: ' + (currentProductFileDownloadingIndex + 1) + '/' + (productFileDownloads.length) : productIsQueued ? 'QUEUED' : productIsDownloaded ? 'DOWNLOADED' : ''}}
                {{productIsDownloading && currentProductFileDownloadingProgress ? ' - ' + currentProductFileDownloadingProgress.toFixed(0) + '%' : ''}} -->
                <h6 style="margin: 0; font-size: .7rem;" v-if="productIsQueued && !productIsDownloading">
                    <span class="gt-md">QUEUED</span>
                    <span class="lt-lg">
                        <q-icon name="fas fa-download" style="margin: 0;" />
                    </span>
                </h6>
                <h6 style="margin: 0; font-size: .7rem;" v-if="productIsDownloading">
                    <span class="gt-md">DOWNLOADING</span>
                    <span class="lt-lg">
                        <q-icon name="fas fa-download" style="margin: 0 .5rem 0 0;" />
                        <q-spinner />
                    </span>
                </h6>
                <h6 style="margin: 0; font-size: .7rem;" v-if="productIsDownloaded">
                    <span class="gt-md">DOWNLOADED</span>
                    <span class="lt-lg">
                        <q-icon name="fas fa-download" style="margin: 0;" />
                    </span>
                </h6>
            </q-btn>
        </div>

        <img :src="productIsDownloaded ? `${downloadedImageURL}` : coverImageURL" style="max-width: 100%; margin: 0 auto; display: block;" />

        <p style="padding: .5rem; line-height: 20px; margin: 0;">{{componentData.productName}}</p>

        <div class="row actions">
            <div class="col-12" v-if="productIsDownloading && currentProductFileDownloadingProgress" style="padding: .5rem 0;">
                <q-progress
                    color="green"
                    height="10px"
                    :percentage="Number(currentProductFileDownloadingProgress)"
                />
            </div>

            <div :class="downloadAllowed ? 'col-6' : 'col-12'">
                <q-btn class="full-width" flat style="padding: 0 .5rem;">
                    <q-icon color="grey-5" :style="playChipStyle" name="fas fa-play-circle" />
                </q-btn>
            </div>

            <div v-if="downloadAllowed" class="col-6 relative-position">
                <q-inner-loading :visible="downloadLoader" />

                <q-btn v-if="!productIsDownloading && !productIsDownloaded && !productIsQueued" class="full-width" flat @click.stop="downloadItem(componentData)" style="padding: 0 .5rem;">
                    <q-icon color="grey" name="fas fa-download" />
                </q-btn>

                <q-btn v-if="productIsDownloading" flat size="sm" @click.stop="cancelProductDownload()" style="padding: 0 .5rem;">
                    <span v-if="currentProductFileDownloadingIndex && productFileDownloads" style="font-size: 0.59rem;">File: {{currentProductFileDownloadingIndex + 1}}/{{productFileDownloads.length}}</span>
                    <br />
                    <q-icon color="red" name="fas fa-ban" />
                </q-btn>

                <q-btn v-if="productIsDownloaded" class="full-width" flat @click.stop="deleteLocalProduct(componentData.productSKU)" style="padding: 0 .5rem;">
                    <q-icon color="red" name="fas fa-times" />
                </q-btn>

            </div>
        </div>
    </div>

</template>

<script>
    import { productCardTools } from '../../mixins/productCardTools'
    import { productCardDownloadTools } from '../../mixins/productCardDownloadTools'

    export default {
        props: ['componentData'],

        mixins: [productCardTools, productCardDownloadTools]
    }
</script>

<style>
    .actions {
        width: 100%;
        bottom: 0;
        position: absolute;
    }

    .topRightHeader {
        background: #444;
        text-align: right;
        font-size: .8rem;
        color: #fff;
        vertical-align: middle;
        position: absolute;
        top: .5rem;
        right: 0;
    }

    .pchip {
        /* width: fit-content; */
        color: #fff;
        padding: .25rem .5rem;
        margin: 0;
    }
</style>
