// import something here
import api from '../js/api'
import fileManager from '../js/fileManager'
import j_ from '@jmellicker/j_'

import { Notify, Platform, Dialog } from 'quasar'

import { EKBTools } from '../components/custom/discoveryekb/EKBTools'

// libraries specific to electron application
if (Platform.is.electron) {
    var fs = require('fs')
    var DecompressZip = require('decompress-zip')
    var jetpack = require('fs-jetpack')
    var electron = require('electron')
    var fileMutationLib = require('../plugins/fileMutation').default
    var remote = electron.remote
    var ipcRenderer = electron.ipcRenderer
    var desktopLib = require('../js/desktopLib').default
    var path = require('path')
    var app = remote.app
}

// leave the export, even if you don't use it
export default ({ vueApp, router, Vue, store }) => {

    Vue.prototype.openWindow = (link, type) => {
        let options = ''
        if (type === '_blank') {
            options = 'toolbar=yes,closebuttoncolor=#ffffff,navigationbuttoncolor=#ffffff,toolbarcolor=#000000,location=no'
            // options = `toolbar=yes,closebuttoncolor=#ffffff,navigationbuttoncolor=#ffffff,toolbarcolor=#000000${!Platform.is.android ? ',location=no' : ''}`
        }

        k('openWindow: ', link, type, options)
        window.open(link, type, options)
    }

    Vue.prototype.scrollIt = (id, selectorToScroll, offset) => {
        var element = document.getElementById(id)
        k('element: ', element)

        var elementToScroll = selectorToScroll ? document.querySelector(selectorToScroll) : window
        k('elementToScroll: ', elementToScroll)
        elementToScroll.scrollTo(0, element.offsetTop - (offset || 25));
    }

    Vue.prototype.route = (route) => {
        routeHelper(route)
    }

    let routeHelper = (route) => {
        // for keeping params around on the url for refreshing
        var routeObj = { path: route }
        // k('routing: ', routeObj)
        router.push(routeObj)
    }

    let loadItHelper = (name, path) => {
        Vue.component(name, require('../components/' + path + '.vue').default)
    }

    Vue.prototype.loadIt = (name, path) => {
        console.warn('loadIt ', name, path)
        loadItHelper(name, path)
    }

    Vue.prototype.launchProduct = (product) => {
        k('watch me! ', product)
        k('authenticated? ', store.state.user.authenticated)

        if (product.productSKU) {
            if (store.state.user.authenticated) {
                // getProductMetaHelper(product, () => {
                store.commit('setCurrentProduct', product)
                routeHelper('/play/' + product.productID)
                // })
            } else {
                // Notify.create({
                //     message: 'Please sign up for our newsletter to enjoy these videos!',
                //     type: 'positive',
                //     icon: 'fas fa-check-circle',
                //     position: 'bottom-left'
                // })
                k('not authenticated')
            }
        }
    }

    Vue.prototype.launchFreeProduct = (product) => {
        k('watch me! ', product)
        k('authenticated? ', store.state.user.authenticated)

        if (product.productSKU) {
            store.commit('setCurrentProduct', product)
            // preview app user login token
            routeHelper('/play/' + product.productID)
        }
    }

    // Vue.prototype.getProductMeta = (product, cb) => {
    //     var req = {
    //         "userLoginToken": store.state.user.userLoginToken,
    //         "productSKU": product.productSKU,
    //         "apiKey": "player"
    //     }
    //
    //     k('getProductMeta req: ', req)
    //
    //     api.post(api.apiv3Route + 'product/mediaMeta', req, (res) => {
    //         k('getProductMeta res: ', res)
    //
    //         if (!res || res.error) {
    //             Notify.create({
    //                 message: 'Problem getting product media.',
    //                 type: 'negative',
    //                 icon: 'fas fa-exclamation-circle',
    //                 position: 'bottom-left'
    //             })
    //         }
    //
    //         cb(res)
    //     })
    // }

    const sendSuccessMutationEventToApi = (name, sku) => {
        api.sendEvent({
            eventType: 'videoFileMutated',
            eventDesc: name + ' has been mutated',
            fileName: name,
            productSKU: sku,
        })
    }

    Vue.prototype.startDownloadQueue = () => {
        k('startDownloadQueue: ', store.state.currentlyDownloading)
        if (!store.state.currentlyDownloading) downloadOneProduct()
    }

    Vue.prototype.startProductDownload = () => {
        k('startProductDownload: ', store.state.currentlyDownloading)
        if (!store.state.currentlyDownloading) downloadNextFile()
    }

    Vue.prototype.clearDownloadQueue = () => {
        clearDownloadQueueHelper()
    }

    Vue.prototype.getDownloadsPath = () => {
        let downloadsPath = path.join(app.getPath('appData'), store.state.currentBrand.appName, 'downloads');
        if (localStorage.getItem("downloadsLocation")) {
            downloadsPath = localStorage.getItem("downloadsLocation");
        }
        return downloadsPath;
    }

    let clearDownloadQueueHelper = () => {
        stopCurrentDownload(true)
        store.commit('clearProductFileDownloads')
        store.commit('clearProductDownloadQueue')
        store.commit('currentlyDownloading', false)
    }

    Vue.prototype.cancelProductDownload = () => {
        stopCurrentDownload(true)
        store.commit('clearProductFileDownloads')
        store.commit('clearCurrentProductInQueue')

        k('cancelProductDownload: ', store.state.productDownloadQueue.length)
        if (store.state.productDownloadQueue.length) {
            downloadOneProduct()
        } else {
            store.commit('currentlyDownloading', false)
        }
    }

    Vue.prototype.deleteLocalProduct = (productSKU) => {
        deleteLocalProductHelper(productSKU)
    }

    let deleteLocalProductHelper = (productSKU) => {
        k('deleteLocalProductHelper: ', productSKU)

        if (store.state.isCordovaApp) {
            deleteLocalProductWithCordova(productSKU)        }

        if (store.state.isElectronApp) {
            deleteFolderWithElectron(productSKU);
        }

        deleteAllLocalStorageMutationKeysForSKU(productSKU)
    }

    let deleteFolderWithElectron =  (productSKU) => {
        const folderPath = path.join(Vue.prototype.getDownloadsPath(), productSKU);
        if (fs.existsSync(folderPath)) {
            jetpack.remove(folderPath);
        }
        var downloadIndex = j_.indexFromArray(store.state.downloadedProducts, 'productSKU', productSKU)
        if (downloadIndex > -1) store.commit('removeDownloadedProduct', downloadIndex)
    }

    let deleteAllLocalStorageMutationKeysForSKU = (productSKU) => {
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i)
            // k('localStorage key: ', key, localStorage.getItem(key));
            if (key.indexOf(productSKU) > -1 && key.indexOf('mutated') > -1) {
                k('remove localStorage key: ', key);
                localStorage.removeItem(key)
            }
        }
    }

    // cordova url with ionic webview prefix
    Vue.prototype.getCordovaFileURL = (productSKU, fileName) => {
        let localFilePath = store.state.useExternalStorage ? store.state.externalStoragePath : cordova.file.dataDirectory
        return localFilePath + productSKU + '/' + fileName
    }

    function getCordovaLocalURL(productSKU, fileName) {
        let localURL = Vue.prototype.getCordovaFileURL(productSKU, fileName)
        if (window.Ionic && window.Ionic.WebView && !Platform.is.android) {
            return window.Ionic.WebView.convertFileSrc(localURL)
        }
        return localURL
    }

    function getElectronLocalURL(productSKU, fileName) {
        let filePath = path.join(Vue.prototype.getDownloadsPath(), productSKU, fileName);
        return `${process.env.PROD ? '' : 'file://'}${filePath}`;
    }

    Vue.prototype.getLocalURL = (productSKU, fileName) => {
        k('getLocalURL: ', productSKU, fileName)

        var localURL = ''

        if (store.state.isCordovaApp) {
            localURL = getCordovaLocalURL(productSKU, fileName)
        }

        if (store.state.isElectronApp) {
            localURL = getElectronLocalURL(productSKU, fileName)
        }

        k('getLocalURL: ', localURL)

        // todo: add subtitle files
        return {
            signedURL: localURL,
            subtitles: ''
        }
    }

    let createDownloadItem = (item) => {
        return {
            productName: item.productName,
            productSKU: item.productSKU,
            fileName: item.fileName,
            type: item.type,
            uri: item.uri || '',
            progress: '',
            status: 'queued'
        }
    }

    let generateRemoteURIForProductType = (item, cb) => {
        var productToDownload = store.state.productDownloadQueue[0]
        if (item.uri) {
            cb(item.uri)
        } else {
            if (item.type === 'coverImage') {
                // https://f3r6v6t8.ssl.hwcdn.net/static/previews/iisp3410_jeetkunedo-445/iisp3410_jeetkunedo-445_image_cover.png
                cb('https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + productToDownload.productSKU + '/' + item.fileName)
            } else {
                api.signURL(productToDownload.productSKU, item.fileName, store.state.user.userLoginToken, item.type, (res) => {
                    k('sign url res: ', res)
                    // if (item.type === 'subtitle') {
                    //     if (res.subtitles) cb(res.subtitles)
                    // } else {
                    if (res.signedURL) cb(res.signedURL)
                    // }
                })
            }
        }
    }

    let downloadOneProduct = (product) => {
        k('downloadOneProduct! ', store.state.productDownloadQueue)
        store.commit('currentlyDownloading', true)

        var productToDownload = store.state.productDownloadQueue[0]
        k('productToDownload: ', productToDownload)

        //create productFileDownloads
        var allMediaItems = []
        var mediaFileNames = []
        var mediaTypesForProduct = Object.keys(productToDownload.productJSON)
        mediaTypesForProduct.forEach((type) => {
            if (type !== 'subtitleFiles') {
                if (Array.isArray(productToDownload.productJSON[type])) {
                    productToDownload.productJSON[type].forEach((mediaItem) => {
                        if (mediaItem.fileName && !mediaFileNames.includes(mediaItem.fileName)) {
                            mediaItem.productSKU = productToDownload.productSKU
                            mediaFileNames.push(mediaItem.fileName)
                            mediaItem.type = type
                            allMediaItems.push(mediaItem)
                        }
                    })
                }
            } else {
                // todo: turn on subtitle download

                Object.keys(productToDownload.productJSON[type]).forEach((fileName) => {
                    let subtitlesForProductFile = productToDownload.productJSON[type][fileName]
                    subtitlesForProductFile.forEach((subtitleItem) => {
                        subtitleItem.productSKU = productToDownload.productSKU
                        subtitleItem.type = 'subtitle'
                        allMediaItems.push(subtitleItem)
                    })
                })
            }
        })
        k('allMediaItems: ', allMediaItems)

        var productFileDownloads = allMediaItems.map((item) => {
            item.productName = productToDownload.productName
            return createDownloadItem(item)
        })

        // add cover image to beginning of productFileDownloads
        if (!productToDownload.noCoverImage) {
            let coverImageFileName = productToDownload.localCoverImageFileName || productToDownload.productSKU + '.png'
            k('coverImageFileName: ', coverImageFileName)

            if (productToDownload.remoteCoverImageURL) {
                productFileDownloads.unshift(createDownloadItem({
                    productName: productToDownload.productName,
                    productSKU: productToDownload.productSKU,
                    uri: productToDownload.remoteCoverImageURL,
                    fileName: coverImageFileName,
                    type: 'coverImage'
                }))
            } else {
                productFileDownloads.unshift(createDownloadItem({
                    productName: productToDownload.productName,
                    productSKU: productToDownload.productSKU,
                    fileName: coverImageFileName,
                    type: 'coverImage',
                }))
            }
        }

        k('productFileDownloads: ', productFileDownloads)
        store.commit('initialProductFileDownloads', productFileDownloads)

        downloadNextFile()
    }

    let downloadNextFile = () => {
        let inProgressDownloadIndex = j_.indexFromArray(store.state.productFileDownloads, 'status', 'inProgress')
        let queuedDownloadIndex = j_.indexFromArray(store.state.productFileDownloads, 'status', 'queued')
        k('inProgressDownloadIndex index: ', inProgressDownloadIndex)
        k('queuedDownloadIndex index: ', queuedDownloadIndex)

        let downloadNextFileIndex = inProgressDownloadIndex !== -1 ? inProgressDownloadIndex : queuedDownloadIndex
        k('downloadNextFile index: ', downloadNextFileIndex)

        if (downloadNextFileIndex !== -1) {
            startDownload(store.state.productFileDownloads[downloadNextFileIndex])
        } else {
            kw('all files for product download finished: ', store.state.productFileDownloads)
            completeProductDownload()
        }
    }

    let currentProductFormat = (product) => {
        let currentProductFormat
        let currentProductTagIDArr

        if (product && product.tags) {
            if (product.tags.indexOf(',') > -1) {
                currentProductTagIDArr = product.tags.split(',')
            } else {
                currentProductTagIDArr = [product.tags]
            }
        }

        if (currentProductTagIDArr && currentProductTagIDArr.length) {
            currentProductFormat = currentProductTagIDArr.filter((tagID) => {
                return store.state.productFormats[String(tagID)]
            })[0]
        }

        k('currentProductTagIDArr: ', currentProductTagIDArr)
        k('currentProductFormat: ', currentProductFormat)

        return currentProductFormat
    }

    let completeProductDownload = () => {
        var product = store.state.productDownloadQueue[0]
        store.commit('clearProductFileDownloads')
        store.commit('productCompletedDownloading')

        let contentType = product.group ? product.group : currentProductFormat(product) ? currentProductFormat(product) : ''

        api.sendEvent({
            eventType: 'productDownloadComplete',
            eventDesc: product.productName + ' has completed downloading',
            productID: product.productID,
            productSKU: product.productSKU,
            productName: product.productName,
            publisherID: product.publisherID,
            contentType: contentType,
            sceneContext: EKBTools.methods.sceneContext(router.currentRoute.fullPath),
        })

        if (store.state.productDownloadQueue.length) {
            downloadOneProduct()
        } else {
            kw('all products downloaded!')
            store.commit('currentlyDownloading', false)
        }
    }

    let startDownload = (downloadItem) => {
        k('START DOWNLOAD: ', downloadItem)

        api.sendEvent({
            eventType: 'downloadingProductFile',
            eventDesc: 'downloading file ' + downloadItem.fileName,
            productSKU: downloadItem.productSKU
        })

        if (store.state.isCordovaApp) {
            startCordovaDownload(downloadItem)
        }

        if (store.state.isElectronApp) {
            startElectronDownload(downloadItem)
        }
    }

    let startElectronDownload = (downloadItem) => {
        kw('got to startElectronDownload', downloadItem)

        generateRemoteURIForProductType(downloadItem, (uri) => {
            downloadItem.uri = uri
            downloadItem.status = 'inProgress'

            updateDownloadItemStatus(downloadItem, 'inProgress')

            k('downloading Item Via Electron: ', downloadItem)

            downloadFileWithElectron(downloadItem)
        })
    }

    let startCordovaDownload = (downloadItem) => {
        var productToDownload = store.state.productDownloadQueue[0]
        var localFilePath = store.state.useExternalStorage ? store.state.externalStoragePath : cordova.file.dataDirectory
        k('localFilePath: ', localFilePath)

        window.resolveLocalFileSystemURL(localFilePath, (dirEntry) => {
            k('requestFileSystem dirEntry: ', dirEntry)
            dirEntry.getDirectory(productToDownload.productSKU, { create: true }, (dirEntry) => {
                k('getDirectory dirEntry: ', dirEntry)

                dirEntry.getFile(downloadItem.fileName, { create: true }, (targetFile) => {
                    downloadItem.targetFile = targetFile;

                    // get uri for file type
                    generateRemoteURIForProductType(downloadItem, (uri) => {
                        downloadItem.uri = uri
                        downloadItem.status = 'inProgress';

                        updateDownloadItemStatus(downloadItem, 'inProgress')

                        k('downloading Item: ', downloadItem)

                        downloadFileWithCordova(downloadItem);
                    })

                }, error => {
                    k('getFile err: ', error);
                });
            }, error => {
                k('getDirectory err: ', error);
            });
        }, (error) => {
            k('requestFileSystem err: ', error);
        });
    }

    let downloadFileWithCordova = (downloadItem) => {
        k('downloadFileWithCordova: ', downloadItem)

        var complete = () => {
            fileDownloadComplete(downloadItem)
        };

        var error = (err) => {
            ke('downloadError! ')
            k(err)

            downloadItem.status = 'error';

            if (!err) {
                downloadItem.error = 'Download error';
            } else if (err instanceof Error) {
                downloadItem.error = err.message;
            } else {
                downloadItem.error = err;
            }

            if (err) {
                if (err === 'ERROR_INSUFFICIENT_SPACE') {
                    clearDownloadQueueHelper()

                    Dialog.create({
                        title: `There is not enough storage space to download this item.`,
                        message: `Your download queue has been reset. Please free up some space and try again.`,
                        ok: 'Ok'
                    }).then(() => {

                    }).catch(() => {

                    })
                } else if (err !== 'Error: Cancelled') {
                    // todo: is there a good way to modularize this?
                    // stopCurrentDownload()
                    // store.commit('clearProductFileDownloads')
                    // store.commit('clearCurrentProductInQueue')
                    //
                    // k('cancelProductDownload: ', store.state.productDownloadQueue.length)
                    // if (store.state.productDownloadQueue.length) {
                    //     downloadOneProduct()
                    // } else {
                    //     store.commit('currentlyDownloading', false)
                    // }
                    // //
                    //
                    // Dialog.create({
                    //     title: `There was a problem downloading ${downloadItem.productName}.`,
                    //     message: `Please try resuming your download and if you continue to have trouble contact support.`,
                    //     ok: 'Ok'
                    // }).then(() => {
                    //
                    // }).catch(() => {
                    //
                    // })
                }
            }

            api.sendEvent({
                eventType: 'downloadFailed',
                eventDesc: 'user download has failed: ' + downloadItem.fileName,
                productSKU: downloadItem.productSKU,
                fileName: downloadItem.fileName,
                errorCode: error.code
            })

        };

        var progress = (progress) => {
            downloadItem.progress = progress.message
            ? progress.message
            : (100 * progress.bytesReceived / progress.totalBytesToReceive) + '%';
        };

        let inProgressIndex = j_.indexFromArray(store.state.productFileDownloads, 'status', 'inProgress')
        k('inProgressIndex: ', inProgressIndex)
        let queuedIndex = j_.indexFromArray(store.state.productFileDownloads, 'status', 'queued')
        k('queuedIndex: ', queuedIndex)
        let currentProductFileDownloadingIndex = inProgressIndex !== -1 ? inProgressIndex : queuedIndex
        k('currentProductFileDownloadingIndex: ', currentProductFileDownloadingIndex)
        let downloadTitle = `File ${currentProductFileDownloadingIndex + 1}/${store.state.productFileDownloads.length} - ${downloadItem.productName}`
        k('downloadTitle: ', downloadTitle)

        try {
            // var downloader = new BackgroundTransfer.BackgroundDownloader();
            var downloader = new BackgroundTransfer.BackgroundDownloader('^[^?]+');

            // Create a new download operation.
            var download = downloader.createDownload(downloadItem.uri, downloadItem.targetFile, downloadTitle);

            // Start the download and persist the promise to be able to cancel the download.
            k('download.startAsync: ', downloadItem.uri, downloadItem.targetFile, downloadItem.fileName)
            downloadItem.downloadPromise = download.startAsync().then(complete, error, progress);
        } catch(err) {
            k('downloadFileWithCordova err: ', err);
        }
    }

    let downloadFileWithElectron = (downloadItem) => {
        console.log('downloadItem in downloadfilewithelectron', downloadItem)

        var productToDownload = store.state.productDownloadQueue[0]
        desktopLib.createProductFolder(productToDownload.productSKU, (localPath) => {
            console.log('filePath for download:')
            console.log(localPath)

            ipcRenderer.send('download', { url: downloadItem.uri, productSKU: downloadItem.productSKU, fileName:  downloadItem.fileName, uploadDir: localPath})
            ipcRenderer.setMaxListeners(999)
            ipcRenderer.on('download-progress', (event, state) => {
                downloadItem.progress = (100 * state.progress / state.total) + '%'
            })

            ipcRenderer.once('download-done', (event, status) => {
                if (status.state === 'completed') {
                    fileDownloadComplete(downloadItem)
                }
            })
        })
    }

    let fileDownloadComplete = (downloadItem) => {
        k('download.complete downloadItem: ', downloadItem);
        downloadItem.status = 'complete';
        updateDownloadItemStatus(downloadItem, 'complete')

        // code for unzipping a product

        if (downloadItem.type === 'zip') {
            // this is a zip file, unzip it
            const zipLocation = Vue.prototype.getLocalURL(downloadItem.productSKU, downloadItem.fileName).signedURL;
            const unzippedLocation = zipLocation.replace('.zip', '');
            if (store.state.isCordovaApp) {
                zip.unzip(
                    zipLocation,
                    unzippedLocation,
                    (status) => {
                        kw('UNZIP STATUS', status)
                    }
                );
            } else if(store.state.isElectronApp) {
                var unzipper = new DecompressZip(zipLocation.replace('file://', ''));

                unzipper.on('error', function (err) {
                    console.log('Caught an error');
                    console.log(err.message);
                });

                unzipper.on('extract', function (log) {
                    console.log('Finished extracting');
                });
                unzipper.extract({
                    path: unzippedLocation.replace('file://', '')
                });

            }
        }

        api.sendEvent({
            eventType: 'downloadedProductFile',
            eventDesc: 'downloading file ' + downloadItem.fileName,
            productSKU: downloadItem.productSKU,
            fileName: downloadItem.fileName,
            contentType: downloadItem.type
        })

        k('downloadItem before encrypt: ', downloadItem)

        if (downloadItem.type === 'video') {
            k('downloadItem type is video')
            Vue.prototype.mutate(downloadItem.productSKU, downloadItem.fileName, (res) => {
                k('after mutate downloadNextFile: ', res)
                if (res) {
                    sendSuccessMutationEventToApi(downloadItem.productSKU, downloadItem.fileName)
                }
            }, true)
            downloadNextFile()
        } else {
            downloadNextFile()
        }
    }

    let updateDownloadItemStatus = (downloadItem, newStatus) => {
        k('updateDownloadItemStatus: ', downloadItem, newStatus)
        var downloadItemStatusIndex = j_.indexFromArray(store.state.productFileDownloads, 'fileName', downloadItem.fileName)
        k('downloadItemStatusIndex: ', downloadItemStatusIndex)

        store.commit('newProductFileDownloadStatusToWrite', {
            index: downloadItemStatusIndex,
            status: newStatus
        })
    }

    let deleteLocalProductWithCordova = (productSKU) => {
        window.resolveLocalFileSystemURL(store.state.useExternalStorage ? store.state.externalStoragePath : cordova.file.dataDirectory, (dirEntry) => {
            k('requestFileSystem dirEntry: ', dirEntry)
            dirEntry.getDirectory(productSKU, { create: false }, (dirEntry) => {
                k('getDirectory dirEntry: ', dirEntry)
                dirEntry.removeRecursively(() => {
                    k(productSKU, ' removed successfully')

                    var downloadIndex = j_.indexFromArray(store.state.downloadedProducts, 'productSKU', productSKU)
                    if (downloadIndex > -1) store.commit('removeDownloadedProduct', downloadIndex)
                }, error => {
                    k('removeRecursively err: ', error);
                });
            }, error => {
                k('getDirectory err: ', error);
            });
        }, (error) => {
            k('requestFileSystem err: ', error);
        });
    }

    let stopCurrentDownload = (deleteProductFiles) => {
        var inProgressDownloadIndex = j_.indexFromArray(store.state.productFileDownloads, 'status', 'inProgress')
        k('stopCurrentDownload inProgressDownloadIndex: ', inProgressDownloadIndex)

        if (inProgressDownloadIndex === -1) {
            kw('no inProgress downloadItem')
        } else {
            var downloadItem = store.state.productFileDownloads[inProgressDownloadIndex]
            k('downloadItem to stop: ', inProgressDownloadIndex, downloadItem)

            if (downloadItem) {
                k('stopDownload: downloadItem', downloadItem);
                cancelDownload(downloadItem)

                //todo: test delete productSKU folder
                if (deleteProductFiles) deleteLocalProductHelper(downloadItem.productSKU)
            }
        }
    }

    let cancelDownload = (downloadItem) => {
        api.sendEvent({
            eventType: 'downloadAborted',
            eventDesc: 'user download has failed: ' + downloadItem.fileName,
            productSKU: downloadItem.productSKU,
            fileName: downloadItem.fileName,
            errorCode: 'aborted'
        })

        if (store.state.isCordovaApp && downloadItem.downloadPromise) {
            kw('cordova download cancelled')
            downloadItem.downloadPromise.cancel();
        }

        if (store.state.isElectronApp) {
            kw('electron download cancelled')
            ipcRenderer.send('cancel-download', downloadItem.productSKU)
        }
    }

    Vue.prototype.saveExternalStorageOptions = (cb) => {
        window.resolveLocalFileSystemURL('file:///storage/', (fs) => {
            k('ROOT FILESYSTEM: ', fs)

            var reader = fs.createReader();
            reader.readEntries(entries => {
                k('ROOT ENTRIES: ', entries);

                var sdOptions = []
                entries.forEach((e) => {
                    if (e.name.indexOf('Usb') === -1
                    && e.name.indexOf('USB') === -1
                    && e.name.indexOf('usb') === -1
                    && e.name.indexOf('sdcard0') === -1
                    && e.name.indexOf('emulated') === -1
                    && e.name.indexOf('Private') === -1
                    && e.name.indexOf('self') === -1) {
                        sdOptions.push(e)
                    }
                })

                store.state.externalStorageOptions = sdOptions
                cb(sdOptions)
            },
            error => {
                k('read root entries err: ', error);
            });
        }, error => {
            k('external fs err: ', error);
        });
    }

    Vue.prototype.testExternalStoragePath = (externalDownloadPath, cb) => {
        k('TEST EXTERNAL STORAGE PATH: ', externalDownloadPath)
        window.resolveLocalFileSystemURL(externalDownloadPath, (externalFS) => {
            externalFS.getDirectory("downloads", {
                create: true
            }, (dirEntry) => {
                //success
                k('externaldownloads: ', dirEntry)
                cb(true)
            }, (err) => {
                //error
                k('external fs creating downloads error: ', err)
                cb(false)
            })
        }, (err) => {
            k('external fs error: ', err)
            cb(false)
        })
    }

    let randString = (len) => {
        if (!len) len = 8
        var s = "";
        while (s.length < len && len > 0) {
            var r = Math.random();
            s += String.fromCharCode(Math.floor(r * 26) + (r > 0.5 ? 97 : 65));
        }
        return s;
    }

    Vue.prototype.openElectronPDF = (pdfURL) => {
        ipcRenderer.send('open-pdf', pdfURL)
    }
}
