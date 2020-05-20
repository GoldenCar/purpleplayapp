<template>

    <div style="background: #efefef;">
        <MediaMenu />

        <div class="row well" style="padding: 2rem;">
            <q-list v-if="currentProduct.productJSON.pdf" style="background: white;" class="col-12" separator highlight>
                <q-list-header>
                    <h5>PDFs</h5>
                </q-list-header>

                <q-item v-for="item in currentProduct.productJSON.pdf" :key="item.displayName || item.fileName" style="cursor: pointer;" @click.native="launchPDF(item)">
                    <q-item-side icon="fas fa-file-pdf" />

                    <q-item-main class="item-name">
                        {{item.displayName || item.fileName }}
                    </q-item-main>
                    <q-item-side icon="fas fa-external-link-alt" />
                </q-item>

            </q-list>

        </div>

    </div>

</template>

<script>
    import MediaMenu from './MediaMenu'

    export default {
        components: {
            MediaMenu
        },

        data() {
            return {

            }
        },

        computed: {
            currentProduct() {
                return this.$store.state.currentProduct
            },

            userInfo() {
                return this.$store.state.user.info
            },

            userLoginToken() {
                return this.$store.state.user.userLoginToken
            },

            isCordovaApp() {
                return this.$store.state.isCordovaApp
            },

            platformID() {
                return this.$store.state.platformID
            },

            downloadedProducts() {
                return this.$store.state.downloadedProducts
            },

            productIsDownloaded() {
                return this.downloadedProducts.length ? this.downloadedProducts.filter((item) => {
                    return item.productID == this.currentProduct.productID
                })[0] : false
            }
        },

        methods: {

            launchPDF(fileInfo) {
                k('launchPDF:', fileInfo)

                var theHeight = Math.round(window.screen.availHeight * .9)
                var theWidth = Math.round(theHeight)

                if (this.isCordovaApp) {
                    this.getPDFURL(fileInfo, (url) => {
                        k('getPDFURL: ', url)

                        if (this.platformID == 'android') {
                            if (this.productIsDownloaded) {
                                // the product is downloaded
                                // try to open it with an application from user phone
                                cordova.plugins.fileOpener2.open(
                                    url.replace('file://', ''),
                                    'application/pdf',
                                    {
                                        error : function(e) {
                                            // user does not have an application that can handle pdf's
                                            alert('Please install an application that can open PDF files')
                                        }
                                    }
                                );
                            } else {
                                // the product is not downloaded, which means that user is online
                                // open the file with google docs
                                window.open(`https://docs.google.com/viewer?url=${url}&embedded=true`, '_blank', 'location=yes');
                            }

                        } else {
                            // the safari in app browser can handle pdf files, but only with file prefix
                            window.open(url.replace('http://localhost:8080/_file_', 'file://'), '_blank', 'location=no');
                        }
                    })
                } else {
                    this.getPDFURL(fileInfo, (url) => {
                        kw('url to open in electron new pdf window', url)
                        if (url) this.openElectronPDF(url)
                    })
                }

                var logEventObj = {
                    eventType: 'pdfLaunch',
                    eventDesc: 'launch pdf "' + this.currentProduct.productName + '"',
                    productSKU: this.currentProduct.productSKU,
                    productID: this.currentProduct.productID,
                    fileName: fileInfo.fileName
                }
                this.api.sendEvent(logEventObj)
            },

            getPDFURL(fileInfo, cb) {

                kw('getPDFURL ran')
                if (this.productIsDownloaded) {
                    kw('pdf is downloaded')
                    // new streaming movie; need local path
                    var localURL = this.getLocalURL(this.currentProduct.productSKU, fileInfo.fileName).signedURL

                    cb(localURL)
                } else {
                    kw('getPDFURL', fileInfo)
                    if (fileInfo.remotePath && fileInfo.remotePath.indexOf('directpdf') >= 0) {
                        this.watermarkPDF(fileInfo.remotePath, this.userInfo.userEmail, (url) => {
                            cb(url)
                        })
                    }
                    else if (fileInfo.uri) {
                      cb(fileInfo.uri)
                    }
                    else {
                        this.api.signURL(this.currentProduct.productSKU, fileInfo.fileName, this.userLoginToken, 'pdf', (res) => {
                            if (res.success) {
                                this.$q.notify({
                                    message: 'Opening pdf!',
                                    type: 'positive',
                                    icon: 'fas fa-check-circle',
                                    position: 'bottom-left'
                                })
                                cb(res.signedURL)
                            } else {
                                this.$q.notify({
                                    message: 'Problem getting your pdf. Please try again.',
                                    type: 'negative',
                                    icon: 'fas fa-exclamation-circle',
                                    position: 'bottom-left'
                                })
                                cb(false)
                            }
                        })
                    }

                }
            },

            watermarkPDF(remotePath, userEmail, cb) {
                var req = {
                    "watermarkText": userEmail,
                    "PDF2watermark": remotePath
                }

                k('product watermark req: ', req)

                this.api.post(this.api.apiv3Route + 'product/watermark', req, (pdfURL) => {
                    k('watermark res: ', pdfURL)
                    if (pdfURL.outputURL) {
                        this.$q.notify({
                            message: 'Opening your pdf!',
                            type: 'positive',
                            icon: 'fas fa-check-circle',
                            position: 'bottom-left'
                        })
                        cb(pdfURL.outputURL)
                    } else {
                        this.$q.notify({
                            message: 'Problem getting your pdf. PLease try again.',
                            type: 'negative',
                            icon: 'fas fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                        cb(false)
                    }
                })
            },
        },

        created() {
            k('PDFHold: ', this.currentProduct.productJSON.pdf)
            if (this.currentProduct.productJSON.pdf && this.currentProduct.productJSON.pdf.length === 1) {
                this.launchPDF(this.currentProduct.productJSON.pdf[0])
            }
        }

    }
</script>

<style scoped>
    .item-name {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
</style>
