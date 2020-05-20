export const mobileMenuTools = {
    computed: {
        appOffline() {
            return this.$store.state.appOffline
        },

        environmentProducts() {
            return this.$store.state.environmentProducts
        },

        authenticated() {
            return this.$store.state.user.authenticated
        },

        isCordovaApp() {
            return this.$store.state.isCordovaApp
        },

        platformID() {
            return this.$store.state.platformID
        },

        showExternalStorageOption() {
            k('showExternalStorageOption: ', this.authenticated, this.isCordovaApp, this.platformID, this.externalStorageOptions, this.currentlyDownloading)
            return this.authenticated && this.isCordovaApp && this.platformID == 'android' && this.externalStorageOptions.length && !this.currentlyDownloading
        },

        useExternalStorage() {
            return this.$store.state.useExternalStorage
        },

        externalStorageOptions() {
            return this.$store.state.externalStorageOptions
        },

        productDownloadQueue() {
            return this.$store.state.productDownloadQueue
        },

        currentlyDownloading() {
            return this.$store.state.currentlyDownloading
        },

        downloadedProducts() {
            return this.$store.state.downloadedProducts
        },

        showDownloadsOnly() {
            return this.$store.state.showDownloadsOnly
        },

        previewUserInfo() {
            return this.$store.state.previewUserInfo
        },

        userLoginTokenParam() {
            return this.userLoginToken && this.userLoginToken !== this.previewUserInfo.userLoginToken ? '?userLoginToken=' + this.userLoginToken : ''
        }
    },

    methods: {
        goToHome() {
            this.$store.commit('showDownloadsOnly', false)
            this.$emit('navigate', '/home')
        },

        goToLibrary() {
            this.$store.commit('showDownloadsOnly', false)
            this.$emit('navigate', '/library')
        },

        goToSupport() {
            this.$emit('close')
            var link = `${this.brand.brandURL}support${this.userLoginTokenParam}`
            this.openWindow(link, "_blank");
        },

        goToAccount() {
            this.$emit('close')
            var link = `${this.brand.brandURL}account${this.userLoginTokenParam}`
            this.openWindow(link, "_blank");
            // window.location.href = link
        },

        signout() {
            this.$root.$emit('signout')
        },

        refresh() {
            this.getUserActiveProductsForEnvironment((res) => {})
            this.$emit('navigate', '/library')
        },

        toggleDownloadsOnly() {
            this.$store.commit('showDownloadsOnly', true)
            this.$emit('navigate', '/library')
        },

        toggleExternalStorage() {
            // check for external storage path
            if (this.isCordovaApp && this.platformID == 'android') {
                k('externalStorageOptions: ', this.externalStorageOptions)

                if (this.useExternalStorage) {

                    this.$q.dialog({
                        title: this.$t('You have selected to stop using external storage.'),
                        message: this.$t('If you have any items that were downloaded externally, you will lose access. Would you like to continue?'),
                        ok: true,
                        cancel: true,
                        preventClose: true
                    }).then(() => {
                        this.$store.commit(
                            'externalStoragePath', '')
                        this.$store.commit('useExternalStorage',
                            false)
                        this.$store.commit('downloadedProducts', [])
                    }).catch(() => {
                        k('cancel internal storage dialog')
                    })

                } else {

                    if (this.externalStorageOptions && this.externalStorageOptions
                        .length) {

                        this.$q.dialog({
                            title: this.$t('You have selected to stop using internal storage.'),
                            message: this.$t('If you have any items that were downloaded internally, you will lose access. Would you like to continue?'),
                            ok: true,
                            cancel: true,
                            preventClose: true
                        }).then(() => {
                            this.$store.commit(
                                'downloadedProducts', [])
                            this.externalOptionsForUser()
                        }).catch(() => {
                            k('cancel external storage dialog')
                        })

                    } else {
                        this.$q.notify({
                            message: 'Unable to find an SD card to use for external storage, please insert one and restart the app.',
                            type: 'negative',
                            icon: 'fas fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                }
            }
        },

        externalOptionsForUser() {
            if (this.externalStorageOptions.length === 1) {
                let externalStoragePath =
                    `${this.externalStorageOptions[0].nativeURL}Android/data/${this.brand.appID}/`
                this.testExternalStoragePath(externalStoragePath, (res) => {
                    if (res) {
                        this.$store.commit(
                            'externalStoragePath',
                            externalStoragePath)
                        this.$store.commit('useExternalStorage',
                            true)
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
            } else {
                this.$emit('showExternalStorageOptionsModal', true)
            }
        },

        clearQueue() {
            this.clearDownloadQueue()
            this.$emit('close')
        }
    }
}
