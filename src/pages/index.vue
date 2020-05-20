<template>

    <q-layout view="lHh Lpr lFf">
        <q-window-resize-observable @resize="onResize" />

        <q-layout-header>
            <!--<q-toolbar :style="'background: ' + brand.brandColor + ';'">-->
            <!--    <q-toolbar-title>-->
            <!--        {{brand.appName}}-->
            <!--    </q-toolbar-title>-->
            <!--</q-toolbar>-->
            <div :is="topNav" @showSidebar="showAppMenu = !showAppMenu"></div>

        </q-layout-header>

        <q-page-container class="mainPage" :style="`padding-top: ${topPadding}px; ${clientFooter && !appOffline && goingTo !== '/signInUp' ? 'padding-bottom: 4rem;' : ''}`">
            <q-page>
                <router-view />
            </q-page>
        </q-page-container>

        <!-- <q-layout-drawer behavior="mobile" no-swipe-open side="right" v-model="sides.right">
            <div :is="clientMenu" @close="sides.right = !sides.right" @navigate="navigate" @showExternalStorageOptionsModal="showExternalStorageOptionsModal = true" />
        </q-layout-drawer> -->

        <q-modal
            v-model="showAppMenu"
            :content-css="{minWidth: '100vw', minHeight: '100vh'}"
        >
            <q-modal-layout>
                <div class="q-layout-header" align="right">
                    <span class="monty" style="color: #bbb; font-size: .8rem; float: left; padding: 1rem;" v-on:click="showPasswordPrompt()">v{{version()}}</span>

                    <q-btn @click="showAppMenu = false" flat style="padding: 1rem;">
                         <q-icon name="fas fa-times" />
                    </q-btn>
                </div>

                <div
                    :is="clientMenu"
                    @close="showAppMenu = !showAppMenu"
                    @navigate="navigate"
                    @showExternalStorageOptionsModal="showExternalStorageOptionsModal = true"
                />
            </q-modal-layout>

        </q-modal>

        <q-modal
            class="product-modal"
            v-if="$store.state.selectedProductModal"
            v-model="showProductModal"
            transition="none"
            minimized
            :content-css="{minWidth: '100vw', minHeight: '100%'}"
            no-backdrop-dismiss
        >
            <super-player :productID2Play="$store.state.selectedProductModal" />
        </q-modal>

        <playerModal />

        <settingsModal v-if="$store.state.showSettingsModal" />

        <q-layout-footer v-if="clientFooter && !appOffline && goingTo !== '/signInUp'">
            <div :is="clientFooter" />
        </q-layout-footer>

        <q-page-sticky position="bottom-right" :offset="[7, 70]">
            <q-btn
                v-back-to-top.animate="{offset: 500, duration: 200}"
                round
                icon="fas fa-chevron-up"
                :style="backToTopStyle"
            />
        </q-page-sticky>

        <q-modal
            v-model="showExternalStorageOptionsModal"
            :content-css="{minWidth: '80vw', minHeight: '80vh'}"
        >
            <q-modal-layout class="bg-grey-3">
                <q-toolbar slot="header" :style="toolbarStyle">
                    <q-toolbar-title>
                       Select external storage:
                    </q-toolbar-title>
                    <q-btn flat @click="showExternalStorageOptionsModal = false">
                        <q-icon name="fas fa-times" />
                    </q-btn>
                </q-toolbar>

                <q-list separator style="padding: 0;">
                    <q-item v-for="item in externalStorageOptions" :key="item.name" @click.native="selectStorageDir(item)">
                        <q-item-side icon="fas fa-folder" />
                        <q-item-main>
                            {{item.name}}
                            {{item.fullPath}}
                        </q-item-main>
                    </q-item>
                </q-list>
            </q-modal-layout>
        </q-modal>

    </q-layout>

</template>

<script>
    import UAParser from 'ua-parser-js'
    import { userAndProductInfo } from '../mixins/userAndProductInfo'
    import { authentication } from '../mixins/authentication'
    import { globalComputedData } from '../mixins/globalComputedData'
    import { firebasePushNotifications } from '../mixins/firebasePushNotifications'

    import DefaultTopNav from '../components/common/TopNav'
    import RightMenu from '../components/common/RightMenu'
    import SuperPlayer from '../components/common/SuperPlayer'
    import playerModal from '../components/common/playerModal'
    import settingsModal from '../components/common/settingsModal'
    import discoveryAdminModal from '../mixins/discoveryAdminModal'

    export default {
        name: 'LayoutDefault',

        data() {
            return {
                sides: {
                    left: false,
                    right: false
                },
                version() {
                    return vNumber()
                },
                showAppMenu: false,
                showExternalStorageOptionsModal: false,
                showSettingsModal: false,
                iosNotchModels: ['iPhone10,3', 'iPhone10,6', 'iPhone11,8', 'iPhone11,2', 'iPhone11,6']
            }
        },

        mixins: [userAndProductInfo, authentication, globalComputedData, discoveryAdminModal, firebasePushNotifications],

        components: {
            DefaultTopNav,
            RightMenu,
            SuperPlayer,
            playerModal,
            settingsModal
        },

        computed: {
            platformID() {
                return this.$store.state.platformID
            },

            externalStorageOptions() {
                return this.$store.state.externalStorageOptions
            },

            topNav() {
                return this.brand.customTopNav || DefaultTopNav
            },

            clientMenu() {
                return this.brand.clientMenu || RightMenu
            },

            clientFooter() {
                return this.brand.clientFooter || false
            },

            showProductModal: {
                set(value) {
                    this.$store.commit('addKeyPathInStore', {
                        keyPath: 'selectedProductModal',
                        value: value,
                    })
                },
                get() {
                    return this.$store.state.selectedProductModal !== null
                }
            },

            showDownloadsOnly() {
                return this.$store.state.showDownloadsOnly
            },

            comingFrom() {
                return this.$store.state.comingFrom
            },

            productDownloadQueue() {
                return this.$store.state.productDownloadQueue
            },

            backToTopStyle() {
                return (this.brand.brandColor ? 'background: ' + this.brand.brandColor + ';' : 'background: #564F8A !important;') + ' margin: 0px 1rem 1rem 0px; color: white;'
            },

            topPadding() {
                if (this.brand.appName === 'discoveryekb' && this.$q.platform.is.electron &&  this.productDownloadQueue.length) {
                    return 87;
                }

                return 50;
            }
        },

        created() {
            this.setupConnectionCheck()

            if (!!window.cordova) {
                this.initCordova()
            }

            if (navigator && navigator.userAgent && navigator.userAgent.toLowerCase().indexOf(' electron/') > -1) {
                this.initElectron()
            }

            this.initDownloads()
            this.initGeneralApp()

            this.$root.$on('signout', () => {
                k('user signout!')

                if (window.FirebasePlugin && this.user.subscribedToUserPushNotifications && this.userInfo.userID) this.unsubscribeToUserPushNotifications()

                this.$store.commit('userLoginToken', '')
                this.fileManager.writeToFile('userLoginToken.js', '')

                this.$store.commit('authenticated', false)
                this.$store.commit('environmentProducts', '')
                this.$store.commit('environmentProductAndTagState', '')
                this.$store.commit('userInfo', '')
                this.localStorage.set('userInfo', '')
                this.$store.commit('userPreferences', '')
                this.$store.commit('userPreferencesState', '')
                this.$store.commit('saveSearchString', '')
                this.$store.commit('setUserSelectedTags', '')

                if (this.showDownloadsOnly) this.$store.commit('showDownloadsOnly', false)
                if (this.userSubscriptionProductStatusHistory) this.$store.commit('userSubscriptionProductStatusHistory', false)

                this.setupSessionLogObj()

                this.navigate('/signInUp')
            })
        },

        methods: {
            onResize(size) {
                this.$store.commit('windowWidth', size.width)
                this.$store.commit('windowHeight', size.height)
            },

            setEnvironmentVisitVar() {
                var environmentHasBeenVisited = this.localStorage.get(this.brand.environmentName + 'Visit')
                k('environmentHasBeenVisited: ', environmentHasBeenVisited)

                this.$store.commit('firstVisitToEnvironment', environmentHasBeenVisited ? false : true)
                if (!environmentHasBeenVisited) this.localStorage.set(this.brand.environmentName + 'Visit', true)
            },

            setupSessionLogObj() {
                // setup sessionInfoEvent

                var logEventObj = {
                    eventType: 'sessionInfo',
                    environment: this.brand.environmentName,
                    sessionGroup: this.sessionGroup,
                    browser: this.userAgentInfo.browser.name,
                    os: this.userAgentInfo.os.name,
                    osVersion: this.userAgentInfo.os.version,
                    browserVersion: this.userAgentInfo.browser.version,
                    device: this.userAgentInfo.device,
                    referrer: document.referrer,
                    cpu: this.userAgentInfo.cpu ? this.userAgentInfo.cpu : null,
                    anonymousUserID: this.anonymousUserID ? this.anonymousUserID : null
                }

                k('sessionInfo obj: ', logEventObj)
                this.$store.commit('sessionLogObj', logEventObj)

                this.api.sendEvent({
                    ...logEventObj,
                    firstVisitToEnvironment: this.firstVisitToEnvironment ? true : false,
                })
            },

            navigate(route) {
                // this.sides.right = !this.sides.right
                this.showAppMenu = !this.showAppMenu
                this.$router.push(route)
            },

            initCordova() {
                k('INIT CORDOVA')
                this.$store.commit('isCordovaApp', true)
                this.$store.commit('platformID', window.cordova.platformId)
                window.open = cordova.InAppBrowser.open

                if (window.useCodePushUpdates) {
                    if (!window.codePush) {
                        k("CODEPUSH NOT RDY")

                        var updateInterval = setInterval(() => {
                            if (window.codePush) {
                                clearInterval(updateInterval)
                                window.checkForUpdate()
                            } else {
                                k("CODEPUSH STILL NOT RDY")
                            }
                        }, 1000)
                    } else {
                        k("CODEPUSH RDY")
                        window.checkForUpdate()
                    }
                } else {
                    k('no code push')
                }

                if (window.FirebasePlugin) {
                    this.initFirebasePushNotifications()
                }

                document.addEventListener("resume", () => {
                    // Handle the resume event
                    k('app resume')

                    if (window.useCodePushUpdates && window.codePush) window.checkForUpdate()

                    k('re verify user info and products: ', this.userLoginToken, this.authenticated)
                    if (this.userLoginToken && this.authenticated && !this.appOffline) {
                        this.initUser(() => {
                            if (window.FirebasePlugin) this.subscribeToUserPushNotifications()
                        })
                    }
                }, false);

                // iPhoneX specific css
                if (this.iosNotchModels.includes(window.device.model)) this.injectiPhoneXCSS()

                // android specific code
                if (this.platformID && this.platformID == 'android') {
                    document.addEventListener("backbutton", (e) => {
                        e.preventDefault();
                        k('prevent back button! ', e)

                        k('goingTo: ', this.goingTo)
                        k('comingFrom: ', this.comingFrom)
                        if (this.comingFrom === '/signInUp') {
                            this.$root.$emit('signout')
                        }
                    }, false );

                    this.saveExternalStorageOptions((sdOptions) => {
                        k('externalStorageOptions: ', sdOptions)
                    })

                    // look for externalStoragePath before initing app
                    this.fileManager.readFromFile('externalStoragePath.js', (res) => {
                        k('externalStoragePath from file: ', res)

                        if (res) {
                            this.$store.commit('useExternalStorage', true)
                            this.$store.commit('initExternalStoragePath', res)
                        }
                    })
                }
            },

            initElectron() {
                k('INIT ELECTRON')
                this.$store.commit('isElectronApp', true)
                this.$store.commit('currentBrand', this.brand)
                this.ipcRenderer.send('set-brand', this.brand)
                this.fileManager.init()
            },

            initDownloads() {
                // look for productDownloadQueue
                this.fileManager.readFromFile('productDownloadQueue.js', (productDownloadQueue) => {
                    k('productDownloadQueue from file: ', productDownloadQueue)

                    if (productDownloadQueue) {
                        this.$store.commit('productDownloadQueue', productDownloadQueue)
                    }

                    // look for productFileDownloads
                    this.fileManager.readFromFile('productFileDownloads.js', (productFileDownloads) => {
                        k('productFileDownloads from file: ', productFileDownloads)

                        if (productFileDownloads && productFileDownloads.length) {
                            this.$store.commit('initialProductFileDownloads', productFileDownloads)
                            this.startProductDownload()
                        } else if (productDownloadQueue && productDownloadQueue.length) {
                            this.startDownloadQueue()
                        }
                    })
                })

                // look for downloadedProducts before initing app
                this.fileManager.readFromFile('downloadedProducts.js', (res) => {
                    k('downloadedProducts from file: ', res)

                    if (res) {
                        this.$store.commit('downloadedProducts', res)
                    }
                })
            },

            initGeneralApp() {
                this.$store.commit('windowWidth', window.innerWidth)
                this.$store.commit('windowHeight', window.innerHeight)
                this.$store.commit('userAgentInfo', new UAParser().getResult())
                this.$store.commit('sessionGroup', this.j_.uaid('s'))
                this.$store.commit('saveEnvironmentName', this.brand.environmentName)
                this.$store.commit('currentBrand', this.brand)
                this.setEnvironmentVisitVar()
                this.setupSessionLogObj()

                // todo: setting userlogintoken for dev
                // look for userLoginToken before initing app
                this.fileManager.readFromFile('userLoginToken.js', (res) => {
                    k('userLoginToken from file: ', res)

                    if (res) {
                        this.$store.commit('userLoginToken', res)
                        this.$store.commit('authenticated', true)

                        this.initUser(() => {
                            if (window.FirebasePlugin) this.subscribeToUserPushNotifications()
                        })

                        this.$router.push(this.brand && this.brand.appStartRoute && !this.appOffline ? this.brand.appStartRoute : '/library')
                    } else {
                        this.$router.push('/signInUp')
                    }
                })

                // check for this.brand.freeBundleID and load productInfo
                this.getProductBundleInfo(this.brand.freeBundleID, (res) => {
                    if (res) this.$store.commit('freeProducts', res.products)
                })

                this.getProductBundleInfo(this.brand.previewBundleID, (res) => {
                    if (res) this.$store.commit('previewProducts', res.products)
                })
            },

            setupConnectionCheck() {
                const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

                k('CONNECTION TYPE: ', connection.effectiveType)
                this.$store.commit('appOffline', !navigator.onLine)

                window.addEventListener("offline", () => {
                    kw('app has gone offline')
                    this.$store.commit('appOffline', !navigator.onLine)
                    this.$store.commit('setUserSelectedTags', '')
                    this.$store.commit('saveSearchString', '')
                }, false);

                window.addEventListener("online", () => {
                    kw('app has gone online')
                    this.$store.commit('appOffline', !navigator.onLine)

                    if (this.userLoginToken && this.authenticated) {
                        this.initUser(() => {
                            if (window.FirebasePlugin) this.subscribeToUserPushNotifications()
                        })
                    }
                }, false);
            },

            selectStorageDir(storageItem) {
                k('selectStorageDir: ', storageItem)

                let externalStoragePath = `${storageItem.nativeURL}Android/data/${this.brand.appID}/`
                this.testExternalStoragePath(externalStoragePath, (res) => {
                    if (res) {
                        this.$store.commit('externalStoragePath', externalStoragePath)
                        this.$store.commit('useExternalStorage', true)
                        this.showExternalStorageOptionsModal = false
                    } else {
                        kw('external storage test failed!')
                        this.$q.notify({
                            message: 'Unable to find an SD card to use for external storage, please insert one and restart the app.',
                            type: 'negative',
                            icon: 'fas fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            },

            injectiPhoneXCSS() {
                k('injectiPhoneXCSS!')
                this.injection.injectCSSFileIntoDOM({
                    id: 'iPhoneXCSS',
                    headOrBody: 'head',
                    url: 'statics/iPhoneX.css'
                })
            },
        }
    }
</script>

<style>
    .q-input input {
      height: 100%;
    }
</style>
