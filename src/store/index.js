import Vue from 'vue'
import Vuex from 'vuex'
import j_ from '@jmellicker/j_'
import fileManager from '../js/fileManager'
import VueScrollTo from 'vue-scrollto'

// import example from './module-example'

Vue.use(Vuex)
Vue.use(VueScrollTo)

const store = new Vuex.Store({
    state: {
        isCordovaApp: false,
        isElectronApp: false,
        platformID: '',
        appOffline: '',

        goingTo: '',
        comingFrom: '',

        windowWidth: '',
        windowHeight: '',

        sessionGroup: '',
        sessionLogObj: '',
        userAgentInfo: '',

        firstVisitToEnvironment: true,

        user: {
            userLoginToken: '',
            anonymousUserID: '',
            authenticated: false,
            info: '',
            preferences: '',
            preferencesState: '',
            locale: '',
            subscribedToUserPushNotifications: false
        },

        previewUserInfo: {
            userLoginToken: '3Rr11f8ZBVQOcNTO4xv9j7Wq',
            info: {
                userID: 630621,
                userEmail: 'freeappuser@platformpurple.com'
            }
        },

        environment: {
            name: '',
            data: '',
            json: ''
        },

        searchString: '',
        userSelectedTags: [],

        sortLibraryTopRated: '',
        sortLibraryMostRecent: '',
        showFavoritesOnly: '',
        showExclusiveContentOnly: '',

        chapterIndexToStartFrom: '',
        chapterStartSecondsToPlayFrom: '',

        environmentProducts: '',
        environmentTags: '',
        environmentTagHeadingObj: '',
        environmentProductAndTagState: '',

        userSubscriptionProductStatusHistory: '',

        useExternalStorage: false,
        externalStorageOptions: '',
        localStoragePath: '',
        externalStoragePath: '',

        productDownloadQueue: [],
        productFileDownloads: [],
        writableProductFileDownloads: [],
        downloadedProducts: [],
        currentlyDownloading: false,
        showDownloadsOnly: false,

        currentProduct: '',
        currentChapter: '',
        currentChapterIndex: '',
        currentMediaType: '',
        productID2Preview: '',
        productPreviewData: '',

        freeProducts: [],
        previewProducts: [],
        currentBrand: '',

        selectedProductModal: null,
        waitForMutationToExitMedia: false,
        resumableDropZone: {
            uploadNow: false,
            query: '',
            fileName: '',
            fileInfo: '',
            imageSrc: '',
            pdfSrc: '',
            droppedImageSrc: '',
            mediaDropped: '',
            mediaUploading: '',
            mediaUploadProgress: 0,
            fileTypesAllowed: '',
            fileExtensionsAllowed: '',
            mediaPurpose: '',
            target: '',
            fileSizeLimit: ''
        },

        showSettingsModal: false,
        shopifyProductData: '',
        equipmentUsed: '',
        globalVideoLock: false,

        productFormats: {
            '4143': 'eBook',
            '4144': 'pdf',
            '4145': 'video',
            '4146': 'audio',
            '4285': 'supplemental',
            '4430': 'zip'
        }
    },

    mutations: {
        addKeyPathInStore(state, obj) {
            // send a keyPath, e.g. 'environment.data.affiliateID' and i will add it
            // the path must exist (for now, will add .set to make dynamic generation of reactive keypaths possible in the future)
            switch (typeof obj.value) {
                case 'string':
                    eval(`state.${obj.keyPath} = "${obj.value}"`)
                    break
                case 'object':
                    eval(`state.${obj.keyPath} = ${JSON.stringify(obj.value)}`)
                    break
                default:
                    eval(`state.${obj.keyPath} = ${obj.value}`)
                    break
            }
        },

        deleteKeyPathInStore(state, keyPath) {
            // send a keyPath, e.g. 'environment.data.affiliateID' and i will delete it
            eval('delete state.' + keyPath)
        },

        appOffline(state, val) {
            state.appOffline = val
        },

        isCordovaApp(state, val) {
            state.isCordovaApp = val
        },

        isElectronApp(state, val) {
            state.isElectronApp = val
        },

        platformID(state, val) {
            state.platformID = val
        },

        windowWidth(state, width) {
            state.windowWidth = width
        },

        windowHeight(state, height) {
            state.windowHeight = height
        },

        chapterIndexToStartFrom(state, index) {
            state.chapterIndexToStartFrom = index
        },

        sessionGroup(state, id) {
            state.sessionGroup = id
        },

        sessionLogObj(state, obj) {
            state.sessionLogObj = obj
        },

        userAgentInfo(state, obj) {
            state.userAgentInfo = obj
        },

        authenticated(state, boolean) {
            state.user.authenticated = boolean
        },

        userInfo(state, info) {
            state.user.info = info
        },

        userFirstName(state, data) {
            state.user.info.firstName = data
        },

        userLastName(state, data) {
            state.user.info.lastName = data
        },

        userEmail(state, data) {
            state.user.info.userEmail = data
        },

        userPreferences(state, data) {
            state.user.preferences = data
        },

        userPreferencesState(state, data) {
            state.user.preferencesState = data
        },

        userLocaleInfo(state, locale) {
            state.user.locale = locale
        },

        goingTo(state, route) {
            state.goingTo = route
        },

        userLoginToken(state, token) {
            state.user.userLoginToken = token
        },

        anonymousUserID(state, token) {
            state.user.anonymousUserID = token
        },

        saveEnvironmentName(state, data) {
            state.environment.name = data
        },

        saveEnvironmentData(state, data) {
            state.environment.data = data
        },

        saveHomePageJSON(state, data) {
            state.environment.json = data
        },

        saveNavBarData(state, data) {
            state.navBarData = data
        },

        setCurrentProduct(state, data) {
            state.currentProduct = data
        },

        setProductID2Preview(state, data) {
            state.productID2Preview = data
        },

        setProductPreviewData(state, data) {
            state.productPreviewData = data
        },

        setCurrentChapter(state, data) {
            state.currentChapter = data
        },

        setCurrentChapterIndex(state, data) {
            state.currentChapterIndex = data
        },

        nestedChapters(state, data) {
            state.nestedChapters = data
        },

        saveSearchString(state, str) {
            state.searchString = str
        },

        userSelectedTag(state, id) {
            if (state.userSelectedTags.includes(id)) {
                state.userSelectedTags.splice(state.userSelectedTags.indexOf(id), 1)
            }
            else {
                state.userSelectedTags.push(id)
            }
        },

        setUserSelectedTags(state, tagIDs) {
            if (tagIDs) {
                state.userSelectedTags = tagIDs.includes(',') ? tagIDs.split(',') : [tagIDs]
            }
            else {
                state.userSelectedTags = []
            }
        },

        sortLibraryTopRated(state, data) {
            state.sortLibraryTopRated = data
        },

        sortLibraryMostRecent(state, data) {
            state.sortLibraryMostRecent = data
        },

        setShowFavoritesOnly(state, data) {
            state.showFavoritesOnly = data;
        },

        setShowExclusiveContentOnly(state, data) {
            state.showExclusiveContentOnly = data;
        },

        userSubscriptionProductStatusHistory(state, data) {
            state.userSubscriptionProductStatusHistory = data
        },

        environmentProducts(state, data) {
            state.environmentProducts = data
        },

        userActiveProducts(state, data) {
            state.userActiveProducts = data
        },

        environmentTags(state, data) {
            state.environmentTags = data
        },

        environmentTagHeadingObj(state, data) {
            state.environmentTagHeadingObj = data
        },

        environmentProductAndTagState(state, data) {
            state.environmentProductAndTagState = data
        },

        userActiveProductState(state, data) {
            state.userActiveProductState = data
        },

        currentMediaType(state, type) {
            state.currentMediaType = type
        },

        freeProducts(state, data) {
            state.freeProducts = data
        },

        previewProducts(state, data) {
            state.previewProducts = data
        },

        productDownloadQueue(state, data) {
            state.productDownloadQueue = data
        },

        initialProductFileDownloads(state, data) {
            state.writableProductFileDownloads = j_.cloneObject(data)
            state.productFileDownloads = j_.cloneObject(data)
        },

        clearProductFileDownloads(state) {
            state.writableProductFileDownloads = []
            state.productFileDownloads = []

            fileManager.writeToFile('productFileDownloads.js', state.writableProductFileDownloads)
        },

        newProductFileDownloadStatusToWrite(state, data) {
            k('newProductFileDownloadStatusToWrite: ', data)
            if (data.index && state.writableProductFileDownloads[data.index]) state.writableProductFileDownloads[data.index].status = data.status

            k('newProductFileDownloadStatusToWrite writableProductFileDownloads: ', state.writableProductFileDownloads)
            fileManager.writeToFile('productFileDownloads.js', state.writableProductFileDownloads)
        },

        clearCurrentProductInQueue(state) {
            state.productDownloadQueue.shift()
            fileManager.writeToFile('productDownloadQueue.js', state.productDownloadQueue)
        },

        addProductToDownloadQueue(state, data) {
            if (data) state.productDownloadQueue.push(data)
            fileManager.writeToFile('productDownloadQueue.js', state.productDownloadQueue)
        },

        productCompletedDownloading(state, data) {
            if (state.productDownloadQueue[0]) state.downloadedProducts.push(state.productDownloadQueue[0])
            fileManager.writeToFile('downloadedProducts.js', state.downloadedProducts)

            state.productDownloadQueue.shift()
            fileManager.writeToFile('productDownloadQueue.js', state.productDownloadQueue)
        },

        removeDownloadedProduct(state, downloadIndex) {
            state.downloadedProducts.splice(downloadIndex, 1)
            fileManager.writeToFile('downloadedProducts.js', state.downloadedProducts)
        },

        clearProductDownloadQueue(state, data) {
            state.productDownloadQueue = []
            fileManager.writeToFile('productDownloadQueue.js', state.productDownloadQueue)
        },

        downloadedProducts(state, data) {
            state.downloadedProducts = data
        },

        currentlyDownloading(state, data) {
            state.currentlyDownloading = data
        },

        showDownloadsOnly(state, data) {
            state.showDownloadsOnly = data
        },

        useExternalStorage(state, data) {
            state.useExternalStorage = data
            // mobileLib.writeToFile('useExternalStorage.js', state.useExternalStorage)
        },

        initExternalStoragePath(state, data) {
            state.externalStoragePath = data
        },

        externalStoragePath(state, data) {
            state.externalStoragePath = data
            fileManager.writeToFile('externalStoragePath.js', state.externalStoragePath)
        },

        currentBrand(state, data) {
            state.currentBrand = data
        },

        waitForMutationToExitMedia(state, data) {
            state.waitForMutationToExitMedia = data
        },

        chapterStartSecondsToPlayFrom(state, val) {
            state.chapterStartSecondsToPlayFrom = val
        },

        dropZoneTarget(state, val) {
            state.resumableDropZone.target = val
        },

        dropZoneFileTypesAllowed(state, val) {
            state.resumableDropZone.fileTypesAllowed = val
        },

        dropZoneFileExtensionsAllowed(state, val) {
            state.resumableDropZone.fileExtensionsAllowed = val
        },

        dropZoneMediaDropped(state, val) {
            state.resumableDropZone.mediaDropped = val
        },

        dropZoneFileName(state, val) {
            state.resumableDropZone.fileName = val
        },

        dropZoneImageSrc(state, val) {
            state.resumableDropZone.imageSrc = val
        },

        dropZonepdfSrc(state, val) {
            state.resumableDropZone.pdfSrc = val
        },

        dropZoneDroppedImageSrc(state, val) {
            state.resumableDropZone.droppedImageSrc = val
        },

        dropZoneFileInfo(state, val) {
            state.resumableDropZone.fileInfo = val
        },

        dropZoneQuery(state, val) {
            state.resumableDropZone.query = val
        },

        dropZoneUploadNow(state, val) {
            state.resumableDropZone.uploadNow = val
        },

        dropZoneMediaUploading(state, val) {
            state.resumableDropZone.mediaUploading = val
        },

        dropZoneMediaUploadProgress(state, val) {
            state.resumableDropZone.mediaUploadProgress = val
        },

        toggleSettingsModal(state) {
            state.showSettingsModal = !state.showSettingsModal;
        },

        shopifyProductData(state, val) {
            state.shopifyProductData = val
        },

        equipmentUsed(state, val) {
            state.equipmentUsed = val
        },

        firstVisitToEnvironment(state, val) {
            state.firstVisitToEnvironment = val
        },

        globalVideoLock(state, val) {
            state.globalVideoLock = val
        },

        setProductLaunchContext(state, data) {
            state.productLaunchContext = data
        },

        subscribedToUserPushNotifications(state, data) {
            state.user.subscribedToUserPushNotifications = data
        }
    }
})

export default store
