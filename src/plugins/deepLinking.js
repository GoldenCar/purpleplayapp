import api from '../js/api'
import {
    Platform
}
from 'quasar'
import {
    EKBTools
}
from '../components/custom/discoveryekb/EKBTools'

// libraries specific to electron application
if (Platform.is.electron) {
    var electron = require('electron')
    var ipcRenderer = electron.ipcRenderer
}

// leave the export, even if you don't use it
export default ({
    vueApp, router, Vue, store
}) => {

    let getProductIdFromUrl = (url) => {
        return url.substring(url.indexOf('://') + 3, url.length).replace(
            'download/', '')
    }

    let openProductByUrl = (url) => {
        if (process.env.CURRENT_BRAND === 'discoveryekb') {
            api.get(`${api.apiv3Route}discovery/asset/${getProductIdFromUrl(url)}`, (res) => {
                if (!res || !res.asset) {
                    Vue.prototype.$q.notify({
                        message: 'Could not download the product',
                        type: 'negative',
                        icon: 'fas fa-exclamation-circle',
                        position: 'bottom-left'
                    });
                    return;
                }
                let product = EKBTools.methods.conformEKBAsset(res.asset)

                let productThumbnail = false
                if (product.thumbnail) {
                    if (product.thumbnail.startsWith('http')) productThumbnail = product.thumbnail
                }
                if (product.thumbnails && product.thumbnails.length > 0) {
                    productThumbnail = product.thumbnails.find(thumbnail => thumbnail.size === 'player').url
                }

                if (productThumbnail) {
                    product.remoteCoverImageURL = productThumbnail
                } else {
                    product.noCoverImage = true
                }

                const downloadedProductsIds = store.state.downloadedProducts.map(product => product.id);
                const queuedProductsIds = store.state.productDownloadQueue.map(product => product.id);
                if (!downloadedProductsIds.includes(product.id) && !queuedProductsIds.includes(product.id)) {
                    store.commit('addProductToDownloadQueue', product)
                    kw('product added to download queue', product)
                    Vue.prototype.startDownloadQueue()
                } else {
                    Vue.prototype.$q.notify({
                        message: 'The product is already downloaded',
                        type: 'positive',
                        icon: 'fas fa-check-circle',
                        position: 'bottom-left'
                    });
                }
                router.push(`/downloads`);
            })
        } else {
            // api.get(`${api.apiv3Route}discovery/asset${getProductIdFromUrl(url)}`, (res) => {
            //     const asset = EKBTools.methods.conformEKBAsset(res.asset);
            //     Vue.prototype.launchProduct(asset);;
            // })
            // router.push(`/downloads`);
        }
    }

    if (Platform.is.electron) {
        ipcRenderer.on('setRoute', (event, url) => {
            openProductByUrl(url);
        });
    }

    if (Platform.is.cordova) {
        window.handleOpenURL = (url) => {
            setTimeout(() => {
                openProductByUrl(url);
            }, 0);
        }
    }
}
