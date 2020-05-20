export const transformationImageTools = {

    data() {
        return {
            showCropperModal: false,

            uploadURL: this.api.apiv4Route + 'upload/progressImages',
            transformationDate: Date.now(),
            imageType: 'progressPic',

            progressImages: [],
            newProgressImageFileName: '',

            transformationSlots: [{
                id: 'beforeImage',
                title: 'before',
                imageData: null
            }, {
                id: 'afterImage',
                title: 'after',
                imageData: null
            }],

            cropperImageIndex: null,
            showImageSelectForSlot: false,
            imageSelectSlotIndex: null,

            uploadingCanvasImage: false,
            facebookShareImageUrl: null,

            shareUserStory: false,
            sharedText: '',

            sharedTextError: false,
            selectProgressImageError: false,

            imageUploadComplete: false,
            imageInfoSavingComplete: false,

            defaultCanvasWidth: 1200,
            defaultCanvasHeight: 630,
            defaultCanvasPadding: 20,

            withinTimeParams(slot) {
                k('withinTimeParams: ', Date.now(), slot.id, slot, Date.now() > slot.startMS, Date.now() < slot.endMS)
                return slot.startMS && slot.endMS
                    && Date.now() > slot.startMS
                    // && Date.now() < slot.endMS
            },

            disableTransformationSlot(slot, index) {
                // return (!slot.imageData && this.nextSlotToUploadIndex !== index) || !this.withinTimeParams(slot)
                return !this.withinTimeParams(slot)
            }
        }
    },

    computed: {

        canvasWidth() {
            return this.customCanvasWidth ? this.customCanvasWidth : this.defaultCanvasWidth
        },

        canvasHeight() {
            return this.customCanvasHeight ? this.customCanvasHeight : this.defaultCanvasHeight
        },

        canvasPadding() {
            return this.customCanvasPadding ? this.customCanvasPadding : this.defaultCanvasPadding
        },

        dropZoneFileInfo() {
            return this.$store.state.resumableDropZone.fileInfo
        },

        productSectionStyle() {
            return 'background: ' + (this.componentData.backgroundColor || '#efefef') + '; padding: 2rem 1rem;'
        },

        transformationSlotsWithImageData() {
            return this.transformationSlots.filter((slot) => slot.imageData)
        },

        slotWidth() {
            // return this.canvasWidth / (this.transformationSlots.length + 1)
            return (this.canvasWidth - this.canvasPadding) / (this.transformationSlots.length + 1)
        },

        cropperAspectRatio() {
            return (this.slotWidth - this.canvasPadding) / (this.canvasHeight - (this.canvasPadding * 2))
        },

        nextSlotToUploadIndex() {
            return this.transformationSlots.findIndex((slot) => {
                return !slot.imageData
            })
        },

        beforeImage() {
            return this.transformationSlots.find((slot) => {
                return slot.id === 'beforeImage'
            })
        },

        afterImage() {
            return this.transformationSlots.find((slot) => {
                return slot.id === 'afterImage'
            })
        }
    },

    methods: {
        showShareStory() {
            this.shareUserStory = !this.shareUserStory;
            this.resetAllTransformationSlots()
            this.resetImageCroppedMarkers()
        },

        beforeDateIsActive(imageObj) {
            let imageIndex = this.progressImages.findIndex(image => image.id === imageObj.id)
            if (imageIndex === this.progressImages.length - 1) {
                return false;
            }
            return this.afterImage && this.afterImage.imageData ? this.moment(this.afterImage.imageData.displayDateTimeStamp).isAfter(this.moment(imageObj.displayDateTimeStamp)) : true
        },

        afterDateIsActive(imageObj) {
            k('afterDateIsActive: ', imageObj, this.beforeImage)

            return this.beforeImage && this.beforeImage.imageData ? this.moment(this.beforeImage.imageData.displayDateTimeStamp).isBefore(this.moment(imageObj.displayDateTimeStamp)) : true
        },

        getCtx() {
            const canvas = document.getElementById('transformationCanvas')
            return canvas.getContext("2d")
        },

        displayProgressImages() {
            k('display progress images')
            // k('userPreferences: ', this.userPreferences)

            this.progressImages = []

            this.userPreferences.forEach((stat) => {
                if (stat.type === 'progressPic') {
                    this.progressImages.push(stat)
                }
            })

            this.progressImages.sort((a, b) => {
                return a.displayDateTimeStamp - b.displayDateTimeStamp
            })
            // k('progressImages: ', this.progressImages)
        },

        createResumableFileObj(file) {
            k('createResumableFileObj: ', file)

            this.newProgressImageFileName = 'progressImage_' + this.userInfo.userID + '_' + Date.now() + '.jpg'

            var fileInfo = {}
            fileInfo[file.uniqueIdentifier] = {
                'purpleFileName': this.newProgressImageFileName,
                'filePurpose': 'progressImage'
            }
            // k('fileInfo: ', fileInfo)

            this.$store.commit('dropZoneFileInfo', fileInfo)
            this.uploadImage()
        },

        removeImage(imageObj, index) {
            // k('removeImage: ', imageObj)

            this.api.delete(this.api.ioRoute + 'userInfo/' + imageObj.id, (res) => {
                // k('removeImage res: ', res)

                if (res.success) {
                    this.$q.notify({
                        message: 'Your image has been removed!',
                        type: 'positive',
                        icon: 'fas fa-check-circle',
                        position: 'bottom-left'
                    })
                    this.progressImages.splice(index, 1)

                    // check if user has less than 2 images left
                    if (this.progressImages.length < 2) {
                        this.shareUserStory = false;
                    }

                    if (this.transformationSlots) {
                        this.resetAllTransformationSlots()
                    }
                }  else {
                    this.$q.notify({
                        message: 'Could not delete the image!',
                        type: 'negative',
                        icon: 'fas fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                }

            })
        },

        enableImageSelectForSlot(slot, index) {
            this.showImageSelectForSlot = true
            this.imageSelectSlotIndex = index
        },

        resetImageSelectForSlot() {
            this.showImageSelectForSlot = false
            this.imageSelectSlotIndex = null
        },

        selectImageForSlot(imageObj) {
            k('selectImageForSlot: ', imageObj, this.imageSelectSlotIndex)
            this.transformationSlots[this.imageSelectSlotIndex].imageData = imageObj

            if (this.shareUserStory) {
                this.selectImageForSharing(imageObj, this.imageSelectSlotIndex)
            }

            this.resetImageSelectForSlot()
        },

        selectImageForSharing(imageObj, slotIndex) {
            k('selectImageForSharing: ', imageObj, slotIndex)

            this.facebookShareImageUrl = null
            this.cropperImageIndex = slotIndex

            this.showCropperModal = true
        },

        drawCanvas() {
            const ctx = this.getCtx();

            ctx.beginPath();
            ctx.rect(0, 0, this.canvasWidth, this.canvasHeight);
            ctx.fillStyle = "#ffffff";
            ctx.fill();

            this.drawPvolveText();
        },

        coordinatesForSlotIndex(slotIndex) {
            k('get coordinatesForSlotIndex: ', slotIndex)
            let slotNumber = slotIndex + 1

            let xStart = (this.slotWidth * slotIndex) + this.canvasPadding
            let yStart = this.canvasPadding
            let xDraw = this.slotWidth - this.canvasPadding
            let yDraw = this.canvasHeight - (this.canvasPadding * 2)

            k('coordinatesForSlotIndex: ', xStart, yStart, xDraw, yDraw)

            return {
                xStart,
                yStart,
                xDraw,
                yDraw
            }
        },

        drawCanvasSlot(slotIndex, image) {
            const ctx = this.getCtx();

            let coordinatesForSlotIndex = this.coordinatesForSlotIndex(slotIndex)
            k('drawCanvasSlot coordinatesForSlotIndex: ', coordinatesForSlotIndex)

            ctx.drawImage(image, coordinatesForSlotIndex.xStart, coordinatesForSlotIndex.yStart, coordinatesForSlotIndex.xDraw, coordinatesForSlotIndex.yDraw);

            let textStart = coordinatesForSlotIndex.xStart + (this.slotWidth / 2 - this.canvasPadding)
            let text = this.transformationSlotsWithImageData[slotIndex].title

            // ctx.fillStyle = "#333"
            // ctx.font = "30px Montserrat"
            // ctx.textAlign = "center"
            // ctx.fillText(text, textStart, this.canvasTextPadding)
        },

        drawPvolveText() {
            k('drawPvolveText')
            const ctx = this.getCtx();

            // reset last slot of canvas
            let coordinatesForLastSlotIndex = this.coordinatesForSlotIndex(this.transformationSlots.length)
            ctx.beginPath();
            ctx.rect(coordinatesForLastSlotIndex.xStart, coordinatesForLastSlotIndex.yStart, coordinatesForLastSlotIndex.xDraw, coordinatesForLastSlotIndex.yDraw);
            ctx.fillStyle = "#ffffff";
            ctx.fill();

            if (this.transformationSlots[0].imageData && this.transformationSlots[this.transformationSlots.length - 1].imageData) {
                let firstDate = this.moment(this.transformationSlotsWithImageData[0].imageData.displayDateTimeStamp)
                let lastDate = this.moment(this.transformationSlotsWithImageData[this.transformationSlotsWithImageData.length - 1].imageData.displayDateTimeStamp)
                let daysDiff = lastDate.diff(firstDate, 'days') + 1
                k('firstDate: ', firstDate)
                k('lastDate: ', lastDate)
                k('daysDiff: ', daysDiff)

                let textStart = coordinatesForLastSlotIndex.xStart + (this.slotWidth / 2 - (this.canvasPadding / 2))

                // let textX = this.canvasWidth / 2
                // let textY = this.canvasTextPadding / 2

                // ctx.fillStyle = "#81c9ac"
                // ctx.font = "40px Montserrat"
                // ctx.textAlign = "center"

                // ctx.fillText(`MY P.VOLVE JOURNEY - DAY ${ daysDiff }`, textX, textY)

                ctx.fillStyle = "#81c9ac"
                ctx.font = "55px Montserrat"
                ctx.textAlign = "center"
                ctx.fillText(`MY`, textStart, 130)
                ctx.fillText(`P.VOLVE`, textStart, 200)
                ctx.fillText(`JOURNEY,`, textStart, 270)

                ctx.fillStyle = "#333"
                ctx.font = "55px Montserrat"
                ctx.fillText(`DAY ${ daysDiff }`, textStart, 340)
            }

            this.drawLogo()
        },

        drawLogo() {
            k('drawLogo')
            const ctx = this.getCtx();

            let coordinatesForLastSlotIndex = this.coordinatesForSlotIndex(this.transformationSlots.length)

            // todo: if we remove the footer logo or its class this will break?
            const image = document.querySelector('.pvolveFooterLogo');
            let logoWidth = 150
            ctx.drawImage(image, 0, 0, 1100, 1100, coordinatesForLastSlotIndex.xStart + (this.slotWidth / 2 - (this.canvasPadding / 2) - (logoWidth / 2)), this.canvasHeight - (logoWidth + this.canvasPadding), logoWidth, logoWidth)
            // ctx.drawImage(image, 0, 0, 1100, 1100, this.canvasWidth - (logoWidth + this.canvasPadding), this.canvasPadding, logoWidth, logoWidth)
        },

        resetAllTransformationSlots() {
            for (var i = 0; i < this.transformationSlots.length; i++) {
                let slot = this.transformationSlots[i]
                if (slot.imageData) {
                   this.resetTransformationSlot(i)
                }
            }
        },

        resetTransformationSlot(slotIndex) {
            this.transformationSlots[slotIndex].imageData = null;
        },

        resetCanvasSlot(slotIndex) {
            const ctx = this.getCtx();
            ctx.beginPath();

            let coordinatesForSlotIndex = this.coordinatesForSlotIndex(slotIndex)

            ctx.rect(coordinatesForSlotIndex.xStart, coordinatesForSlotIndex.yStart, coordinatesForSlotIndex.xEnd, coordinatesForSlotIndex.yEnd);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
        },

        setImageFromCropper() {

            // get image url
            const url = this.$refs.cropper.getCroppedCanvas().toDataURL('image/jpeg');

            var image = new Image();
            image.onload = () => {
                // set url to canvas slot
                this.drawCanvasSlot(this.cropperImageIndex, image)

                // mark image as cropped
                this.transformationSlots[this.cropperImageIndex].imageCropped = true

                // draw text slot
                this.drawPvolveText();

                // check next slot for existing image data
                this.showCropperForPreselectedImage()
            };
            image.src = url
        },

        showCropperForPreselectedImage() {
            k('showCropperForPreselectedImage')

            let nextSlotWithPreselectedImageIndex = this.transformationSlots.findIndex((slot) => {
                return slot.imageData && !slot.imageCropped
            })
            k('nextSlotWithPreselectedImageIndex: ', nextSlotWithPreselectedImageIndex, this.transformationSlots[nextSlotWithPreselectedImageIndex])

            // reset vars to refresh image within modal
            this.cancelCrop()

            if (nextSlotWithPreselectedImageIndex || nextSlotWithPreselectedImageIndex === 0) {
                // if data, show next image to crop
                this.$nextTick(() => {
                    this.imageSelectSlotIndex = nextSlotWithPreselectedImageIndex
                    this.selectImageForSlot(this.transformationSlots[nextSlotWithPreselectedImageIndex].imageData)
                })
            } else {
                // if no nextSlotWithPreselectedImageIndex, draw blank slots
                // this.drawBlankCanvasSlots()
            }
        },

        cancelCrop() {
            // this.transformationSlots[this.cropperImageIndex].imageData = null;
            this.cropperImageIndex = null
            this.showCropperModal = false
        },

        resetImageCroppedMarkers() {
            for (var i = 0; i < this.transformationSlots.length; i++) {
                this.transformationSlots[i].imageCropped = false
            }
        },

        uploadImage() {
            var queryObj = {
                userLoginToken: this.userLoginToken,
                filesInBatch: JSON.stringify(this.dropZoneFileInfo),
                batchID: this.j_.uaid('b')
            }

            k('queryObj: ', queryObj)

            this.$store.commit('dropZoneQuery', queryObj)
            this.$store.commit('dropZoneUploadNow', true)

            if (!this.uploadingCanvasImage) {
                this.sendImageInfoToAPI()
            }
        },

        uploadComplete(data) {
            this.$q.notify({
                message: 'Your image has been saved!',
                type: 'positive',
                icon: 'fas fa-check-circle',
                position: 'bottom-left'
            })

            this.imageUploadComplete = true

            if (this.uploadingCanvasImage) {
                this.facebookShareImageUrl = `http://vault.platformpurple.com/static/progressImages/${data.fileInfo[Object.keys(data.fileInfo)[0]].purpleFileName}`
            }
            this.uploadingCanvasImage = false;
        },

        sendImageInfoToAPI() {
            var req = {
                userID: this.userInfo.userID,
                userLoginToken: this.userLoginToken,
                type: this.imageType,
                environment: this.environmentName,
                displayDateTimeStamp: this.moment(this.transformationDate).valueOf(),
                imageURL: `http://vault.platformpurple.com/static/progressImages/${this.newProgressImageFileName}?t=${Date.now()}`
            }

            k('sendImageInfoToAPI req: ', req)

            this.api.post(this.api.ioRoute + 'userInfo', req, (res) => {
                k('sendImageInfoToAPI res: ', res)

                if (!res.success) this.$q.notify({
                    message: 'Could not save image to account. Please try again.',
                    type: 'negative',
                    icon: 'fas fa-exclamation-circle',
                    position: 'bottom-left'
                })
                if (res.success) this.imageInfoSavingComplete = true
            })
        },

        getNewImagesOnUpload() {
            k('getNewImagesOnUpload:')

            this.imageUploadComplete = false
            this.imageInfoSavingComplete = false

            // this is for ES delay
            setTimeout(() => {
                this.getUserPreferences(() => {}, true)
            }, 1000)
        },

        shareTransformation() {
            if (this.facebookShareImageUrl) {
                this.openFacebookModal()

                this.shareTransformationWithPvolve()
            } else {
                this.uploadTransformationImage();
            }
        },

        uploadTransformationImage() {
            let imageCroppedForAtLeastOneSlot = this.transformationSlots.filter((slot) => { return slot.imageCropped }).length > 0
            k('uploadTransformationImage: ', this.sharedText, imageCroppedForAtLeastOneSlot)

            if (!this.sharedText || !imageCroppedForAtLeastOneSlot) {
                if (!this.sharedText) this.sharedTextError = true
                if (!imageCroppedForAtLeastOneSlot) this.selectProgressImageError = true

                k('share errors!')
                return false
            }

            const canvas = this.$refs.transformationCanvas

            const transformationImage = this.dataURItoBlob(canvas.toDataURL("image/jpeg"));
            transformationImage.name = "image.jpeg";

            this.uploadingCanvasImage = true;
            this.$refs.resumableRef.addFileBlob(transformationImage)
        },

        openFacebookModal() {
            facebookConnectPlugin.showDialog({
                method: 'share_open_graph',
                action: 'apps.saves',
                object: JSON.stringify({
                    'og:url': 'https://www.pvolve.com',
                    'og:title': 'My P.volve Transformation',
                    'og:description': this.sharedText,
                    'og:image': `https://vault.platformpurple.com/static/progressImages/${this.facebookShareImageUrl}`,
                    'og:type': 'website'
                })
            }, successResponse => {
                k('success ' + successResponse)
            }, errorResponse => {
                k('error ' + errorResponse)
            });
        },

        dataURItoBlob(dataURI) {
            var byteString = atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: mimeString });
        },

        shareTransformationWithPvolve() {
            var imageLinks = []

            // add imageURLs from transformationslots
            this.transformationSlots.forEach((slot) => {
                if (slot.imageData) imageLinks.push(slot.imageData.imageURL)
            })
            if (this.facebookShareImageUrl) imageLinks.push(this.facebookShareImageUrl)
            k('shareTransformationWithPvolve: ', this.userInfo.firstName, this.userInfo.lastName, this.userInfo.userEmail, this.sharedText, imageLinks)

            // send email with pix and text
            var req = {
                userEmail: this.userInfo.userEmail,
                story: this.sharedText,
                images: imageLinks
            }
            k('shareTransformationWithPvolve req: ', req)

            this.api.post(this.api.apiv4Route + 'api/client/' + this.environmentName + '/shareTransformation', req, (res) => {
                k('shareTransformationWithPvolve res: ', res)
                this.shareUserStory = false

                if (res.success) {
                    this.$q.notify({
                        message: 'Your image has been shared!',
                        type: 'positive',
                        icon: 'fas fa-check-circle',
                        position: 'bottom-left'
                    })
                } else {
                    this.$q.notify({
                        message: 'Your transformation could not be shared. Please try again or contact support.',
                        type: 'negative',
                        icon: 'fas fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                }
            })
        }
    },

    watch: {
        shareUserStory() {
            k('watch shareUserStory')

            if (this.shareUserStory) {
                setTimeout(() => {
                    this.drawCanvas()
                })
            }
        },

        userInfo() {
            this.getUserPreferences(() => {})
        },

        userPreferences() {
            this.displayProgressImages()
        },

        imageUploadComplete() {
            // k('imageUploadComplete: ', this.imageUploadComplete)
            if (this.imageUploadComplete && this.imageInfoSavingComplete) this.getNewImagesOnUpload()
        },

        imageInfoSavingComplete() {
            // k('imageInfoSavingComplete: ', this.imageInfoSavingComplete)
            if (this.imageUploadComplete && this.imageInfoSavingComplete) this.getNewImagesOnUpload()
        },

        transformationSlots() {
            k('transformationSlots: ', this.transformationSlots)
        },

        nextSlotToUploadIndex() {
            k('nextSlotToUploadIndex: ', this.nextSlotToUploadIndex)
        }
    }
}
