<template>

    <div id="myTransformation" class="row relative-position justify-center">
        <questionMarkHelp class="col-12" :componentData="{}" :helpContents="`
            <p class='monty'>Here's how to create a visual storybook of your P.volve 90 Day Challenge transformation journey to share with your friends:</p>
            <p class='monty' style='font-size: .9rem'>To add a photo to your story:</p>
            <ol class='monty' style='font-size: .9rem'>
                <li>First, select the date your photo was taken.</li>
                <li>Then drag or select your photo in the drop zone. Do this with as many photos as you wish.</li>
                <li>Use 'Choose Image' to select a progress image to use for your current challenge day.</li>
                <li>New day slots will become available as the challenge progresses.</li>
            </ol>
            <p class='monty' style='font-size: .9rem'>To share your storybook:</p>
            <ol class='monty' style='font-size: .9rem'>
                <li>When available, click 'SHARE YOUR STORY', crop your photos to fit, and then click 'Create Your Story' to save your storybook image.</li>
                <li>Write a brief comment and share it to Facebook!</li>
            </ol>
        `"
            style="margin-top: 1rem; padding: 1rem 0;"
        />

        <div class="col-12" align="center" style="padding: 1rem 0;">

            <div class="row items-stretch">
                <div class="col-md-6 col-lg-3 col-xl-2" style="padding: .5rem;">
                    <div class="bg-white shadow-2" align="left" style="color: black !important; height: 100%; padding: 1rem;">
                        <h5 align="center" :style="`color: ${highlightColor};`">Upload a photo</h5>

                        <q-datetime color="grey-7" float-label="Select date" format="M/DD/YY" v-model="transformationDate" type="date" />

                        <div align="center" style="border: 4px #eee dashed; margin-top: .5rem; min-height: 2rem;">
                            <Resumabledropzone ref="resumableRef" :class="{hidden: !transformationDate}"  @fileAdded="createResumableFileObj" @uploadComplete="uploadComplete" />
                            <h6 v-if="!transformationDate" class="text-grey-8" style="margin: 1rem 0;">Select date to upload an image</h6>
                        </div>
                    </div>
                </div>

                <div v-for="(image, index) in progressImages" :key="image.imageURL" class="col-md-6 col-lg-3 col-xl-2 relative-position" style="padding: .5rem;">
                    <div class="bg-white shadow-2" style="color: black !important; height: 100%;">
                        <q-btn round flat size="sm" @click="removeImage(image, index)" style="background: white; color: red; z-index: 99; position: absolute; top: 0; right: 0; padding: 0 0.5rem;">
                            <q-icon name="fas fa-times" style="font-size: 1rem; margin: 0;" />
                        </q-btn>

                        <img crossorigin="anonymous" :src="image.imageURL" style="max-width: 100%;" :id="`image-${image.id}`" />

                        <div style="padding: .5rem">
                            <q-btn v-if="showImageSelectForSlot" class="full-width" size="sm" outline @click="selectImageForSlot(image)" :style="`background: #fff !important; color: #333; padding: 0; margin: .25rem 0;`">
                                <!--<q-icon :name="slot.imageData.id === image.id ? 'fas fa-check-circle' : 'far fa-circle'" :style="`font-size: 1rem; margin-left: 0;`" />-->
                                <h6 class="thickHeader" style="font-size: .7rem; letter-spacing: 1px;">
                                    select image
                                </h6>
                            </q-btn>

                            <p class="monty" style="font-size: .8rem; letter-spacing: 1px;">uploaded on: {{moment(image.displayDateTimeStamp).format('M/DD/YY')}}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div class="col-12" align="center" style="padding: 1rem 0;">
            <h2 :style="`color: ${pvolveMintBG};`">90 Day Challenge Transformation</h2>
            <h5 style="margin: 1rem;">Select your photos and share your transformation!</h5>

            <div class="row items-stretch">
                <div v-for="(slot, index) in transformationSlots" class="col-xs-12 col-sm-6 col-md-3" style="padding: .5rem;">
                    <div class="bg-white shadow-1 relative-position" :disabled="disableTransformationSlot(slot, index)" style="height: 100%; padding: 1rem;">
                        <h5 class="monty text-grey-8" style="margin-bottom: 1rem;">{{slot.title}}</h5>

                        <div v-if="slot.imageData">
                            <img :src="slot.imageData.imageURL" style="max-width: 100%;" />
                        </div>

                        <div v-if="withinTimeParams(slot) && !shareUserStory && progressImages.length" style="padding: .5rem;">
                            <q-btn v-if="!showImageSelectForSlot" outline @click="enableImageSelectForSlot(slot, index)" color="green">
                                <h6 style="font-size: .8rem; letter-spacing: 1px;">Choose image</h6>
                            </q-btn>

                            <q-btn v-if="showImageSelectForSlot && imageSelectSlotIndex === index" outline @click="resetImageSelectForSlot()" color="red">
                                <h6 style="font-size: .8rem; letter-spacing: 1px;">Cancel</h6>
                            </q-btn>

                            <h6 v-if="showImageSelectForSlot && imageSelectSlotIndex === index" style="margin-top: .5rem; font-size: .8rem;">Choose from progress images above</h6>
                        </div>

                        <div v-if="!withinTimeParams(slot)" class="absolute-bottom" style="padding: 1rem;">
                            <h6 class="text-grey-8">available {{moment(slot.startMS).format('MM/DD/YY')}}</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="ninetyDayChallengeImages.length > 1" class="col-12" align="center" style="padding: 1rem 0;">
            <q-btn outline @click="showShareStory()" style="background: #fff !important; color: #333;">
                <h6 style="letter-spacing: 1px;">{{shareUserStory ? 'Close sharing' : 'Share your story!'}}</h6>
            </q-btn>
        </div>

        <div v-if="shareUserStory" class="col-12 bg-white row" style="border-top: 1px solid #999; margin-top: 1rem;">
            <div class="col-md-12" style="padding: 1rem;">

                <h5>{{shareTitle ? shareTitle : 'Share your story'}}</h5>
                <p>Select images above and write a brief comment about your transformation journey to share with your friends! *</p>

                <div class="text-center">
                    <canvas id="transformationCanvas" ref="transformationCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
                </div>

                <q-input
                    v-model="sharedText"
                    type="textarea"
                    float-label="Your Story"
                    :max-height="100"
                    :min-rows="7"
                    color="grey-7"
                    @input="sharedTextError = false"
                />

                <p v-if="sharedTextError" style="color: red;">
                    <q-icon name="fa-warning" />
                    Please enter text to share your story.
                </p>
                <p v-if="selectProgressImageError" style="color: red;">
                    <q-icon name="fa-warning" />
                    Please select images above to share your story.
                </p>
            </div>

            <div class="col-md-12" style="padding: 1rem;">
                <p style="font-size: .8rem;">{{disclaimer}}</p>
            </div>

            <div class="col-12" align="center">
                <q-btn outline @click="shareTransformation()" class="full-width" style="background: #fff !important; color: #333;">
                    <h6 style="letter-spacing: 1px;">{{facebookShareImageUrl ? 'Share to facebook' : 'Create your story image'}}</h6>
                </q-btn>
            </div>

        </div>

        <q-modal v-model="showCropperModal" minimized no-backdrop-dismiss>
            <div class="q-pa-sm" >
                <vue-cropper
                    style="max-height: 300px"
                    v-if="cropperImageIndex || cropperImageIndex === 0"
                    ref="cropper"
                    :src="transformationSlots[cropperImageIndex].imageData.imageURL"
                    alt="Source Image"
                    :viewMode="1"
                    :aspectRatio="cropperAspectRatio"
                    :zoomOnWheel="false"
                    :background="false"
                />

                <div class="q-mt-md text-center">
                    <q-btn @click="cancelCrop()" flat style="background: #fff !important; color: #333;">
                        <h6 style="font-size: .8rem; letter-spacing: 1px;">Cancel</h6>
                    </q-btn>

                    <q-btn @click="setImageFromCropper()" flat :style="`background: ${highlightColor}; color: white;`">
                        <h6 style="font-size: .8rem; letter-spacing: 1px;">Save</h6>
                    </q-btn>
                </div>
            </div>

        </q-modal>

    </div>

</template>

<script>
    import Resumabledropzone from '../../common/Resumabledropzone'
    import questionMarkHelp from '../../common/questionMarkHelp'
    import VueCropper from 'vue-cropperjs'

    import { pvolveColors } from './pvolveColors'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { transformationImageTools } from '../../../mixins/transformationImageTools'

    export default {
        props: ['highlightColor', 'disclaimer', 'shareTitle', 'customCanvasWidth', 'customCanvasHeight', 'customCanvasPadding'],

        mixins: [ pvolveColors, userAndProductInfo, globalComputedData, transformationImageTools],

        components: {
            questionMarkHelp,
            Resumabledropzone,
            VueCropper
        },

        data() {
            return {
                customImageType: 'ninetyDayChallengeProgressImage',
                ninetyDayChallengeImages: [],

                transformationSlots: [{
                    id: 'day1',
                    title: 'Day 1',
                    startMS: 1547004226000, // Tuesday, January 8, 2019 7:23:46 PM
                    endMS: 1547787600000, // Thursday, January 17, 2019 9:00:00 PM
                    imageData: null
                }, {
                    id: 'day30',
                    title: 'Day 30',
                    startMS: 1549688400000, // Friday, February 8, 2019 9:00:00 PM
                    endMS: 1550293200000, // Friday, February 15, 2019 9:00:00 PM
                    imageData: null
                }, {
                    id: 'day60',
                    title: 'Day 60',
                    startMS: 1552194000000, // Saturday, March 9, 2019 9:00:00 PM
                    endMS: 1552795200000, // Saturday, March 16, 2019 9:00:00 PM
                    imageData: null
                }, {
                    id: 'day90',
                    title: 'Day 90',
                    startMS: 1554782400000, // Monday, April 8, 2019 9:00:00 PM
                    ensMS: 1555387200000, // Monday, April 15, 2019 9:00:00 PM
                    imageData: null
                }]
            }
        },

        computed: {
            slotWidth() {
                // return this.canvasWidth / (this.transformationSlots.length + 1)
                return (this.canvasWidth - this.canvasPadding) / (this.transformationSlots.length)
            },

            slotHeight() {
                return this.canvasHeight - (this.canvasTextTopPadding + this.canvasTextBottomPadding + (this.canvasPadding * 2))
            },

            cropperAspectRatio() {
                return (this.slotWidth - this.canvasPadding) / this.slotHeight
            },

            canvasTextTopPadding() {
                // return (this.canvasPadding * 2)
                return (this.canvasPadding * 3)
            },

            canvasTextBottomPadding() {
                // return (this.canvasPadding * 2)
                return (this.canvasPadding * 4)
            },

            // canvasTextPadding() {
            //     // return (this.canvasPadding * 2)
            //     return (this.canvasPadding * 4)
            // },

            // canvasWidth() {
            //     return this.slotWidth * (this.transformationSlots.length + 1)
            // },

            // canvasHeight() {
            //     return this.canvasWidth - ((this.transformationSlots.length + 1) * (this.slotWidth / 1.75))
            // }
        },

        methods: {

            selectImageForSlot(imageObj) {
                k('selectImageForSlot: ', imageObj, this.imageSelectSlotIndex)
                this.transformationSlots[this.imageSelectSlotIndex].imageData = imageObj

                if (this.shareUserStory) {
                    this.selectImageForSharing(imageObj, this.imageSelectSlotIndex)
                }

                this.sendNinetyDayChallengeImageInfoToAPI(this.imageSelectSlotIndex)

                this.resetImageSelectForSlot()
            },

            displayNinetyDayChallengeImages() {
                k('display progress images')
                // k('userPreferences: ', this.userPreferences)

                this.ninetyDayChallengeImages = []

                this.userPreferences.forEach((stat) => {
                    if (stat.type === this.customImageType) {
                        this.ninetyDayChallengeImages.push(stat)

                        var slotIndex = this.transformationSlots.findIndex((slot) => {
                            return stat.ninetyDayProgressDayNumber === slot.id
                        })
                        k('slotIndex: ', slotIndex)
                        if (slotIndex || slotIndex === 0) this.transformationSlots[slotIndex].imageData = stat
                    }
                })

                this.ninetyDayChallengeImages.sort((a, b) => {
                    return a.displayDateTimeStamp - b.displayDateTimeStamp
                })
                // k('ninetyDayChallengeImages: ', this.ninetyDayChallengeImages)
            },

            coordinatesForSlotIndex(slotIndex) {
                k('get coordinatesForSlotIndex: ', slotIndex, this.slotWidth, this.slotHeight)
                let slotNumber = slotIndex + 1

                let xStart = (this.slotWidth * slotIndex) + this.canvasPadding
                let xDraw = this.slotWidth - this.canvasPadding
                let yStart = this.canvasPadding + this.canvasTextTopPadding
                let yDraw = this.slotHeight

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

                let textStart = coordinatesForSlotIndex.xStart + (this.slotWidth / 2 - this.canvasPadding / 2)
                let text = this.transformationSlots[slotIndex].title

                ctx.fillStyle = "#333"
                ctx.font = "25px Montserrat"
                ctx.textAlign = "center"
                ctx.fillText(text, textStart, this.slotHeight + this.canvasTextTopPadding + (this.canvasPadding * 2.5))
            },

            drawBlankCanvasSlot(slotIndex, image) {
                k('drawBlankCanvasSlot: ', slotIndex, this.transformationSlots[slotIndex])

                const ctx = this.getCtx();

                let coordinatesForSlotIndex = this.coordinatesForSlotIndex(slotIndex)
                k('drawBlankCanvasSlot coordinatesForSlotIndex: ', coordinatesForSlotIndex)

                // blank rect
                ctx.rect(coordinatesForSlotIndex.xStart, coordinatesForSlotIndex.yStart, coordinatesForSlotIndex.xDraw, coordinatesForSlotIndex.yDraw);
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#999";
                ctx.stroke();

                if (image) ctx.drawImage(image, coordinatesForSlotIndex.xStart, coordinatesForSlotIndex.yStart, coordinatesForSlotIndex.xDraw, coordinatesForSlotIndex.yDraw);

                let textStart = coordinatesForSlotIndex.xStart + (this.slotWidth / 2 - this.canvasPadding / 2)
                let text = this.transformationSlots[slotIndex].title

                ctx.fillStyle = "#333"
                ctx.font = "25px Montserrat"
                ctx.textAlign = "center"
                ctx.fillText(text, textStart, this.slotHeight + this.canvasTextTopPadding + (this.canvasPadding * 2.5))
            },

            drawPvolveText() {
                k('drawPvolveText')

                this.draw90DayChallengeText()
                this.draw90DayChallengeTag()
                this.drawLogo()
            },

            drawLogo() {
                k('drawLogo')
                const ctx = this.getCtx();

                // todo: if we remove the footer logo or its class this will break?
                const image = document.querySelector('.pvolveFooterLogo');
                let logoWidth = 80
                // ctx.drawImage(image, 0, 0, 1100, 1100, coordinatesForLastSlotIndex.xStart + ((this.slotWidth - logoWidth) / 2) - this.canvasPadding, this.canvasHeight - 155, logoWidth, logoWidth)
                ctx.drawImage(image, 0, 0, 1100, 1100, this.canvasWidth - (logoWidth + this.canvasPadding / 2), this.canvasHeight - logoWidth, logoWidth, logoWidth)
            },

            draw90DayChallengeText() {
                const ctx = this.getCtx();

                let textX = this.canvasWidth / 2
                let textY = (this.canvasTextTopPadding / 2) + (this.canvasPadding * 1.5)

                ctx.fillStyle = "#81c9ac"
                ctx.font = "40px Montserrat"
                ctx.textAlign = "center"

                ctx.fillText(`MY 90 DAY CHALLENGE JOURNEY`, textX, textY)

                // ctx.fillText(`MY`, textStart, 110)
                // ctx.fillText(`STORY`, textStart, 260)

                // ctx.fillStyle = "#333"
                // ctx.fillText(`90 DAY`, textStart, 160)
                // ctx.fillText(`CHALLENGE`, textStart, 210)
            },

            draw90DayChallengeTag() {
                const ctx = this.getCtx();

                let textX = this.canvasPadding
                let textY = this.canvasHeight - (this.canvasTextBottomPadding / 2) + this.canvasPadding

                ctx.fillStyle = "#81c9ac"
                ctx.font = "25px Montserrat"
                ctx.textAlign = "left"

                ctx.fillText(`#Pvolve90Day #EvolveWithPvolve`, textX, textY)
            },

            showCropperForPreselectedImage() {
                k('showCropperForPreselectedImage')

                let nextSlotWithPreselectedImageIndex = this.transformationSlots.findIndex((slot) => {
                    return slot.imageData && !slot.imageCropped
                })
                k('nextSlotWithPreselectedImageIndex: ', nextSlotWithPreselectedImageIndex, this.transformationSlots[nextSlotWithPreselectedImageIndex])

                // reset vars to refresh image within modal
                this.cancelCrop()

                if (nextSlotWithPreselectedImageIndex > -1) {
                    // if data, show next image to crop
                    this.$nextTick(() => {
                        this.imageSelectSlotIndex = nextSlotWithPreselectedImageIndex
                        this.selectImageForSlot(this.transformationSlots[nextSlotWithPreselectedImageIndex].imageData)
                    })
                } else {
                    // if no nextSlotWithPreselectedImageIndex, draw blank slots
                    this.drawBlankCanvasSlots()
                }
            },

            drawBlankCanvasSlots() {
                k('drawBlankCanvasSlots')

                var image = new Image();
                image.onload = () => {
                    for (var i = 0; i < this.transformationSlots.length; i++) {
                        let slot = this.transformationSlots[i]
                        k('blank canvas slot: ', slot)

                        if (!slot.imageData && !slot.imageCropped) {

                            // todo: find why this breaks sharing the image
                            // this.drawBlankCanvasSlot(i, image)

                            this.drawBlankCanvasSlot(i)
                        }
                    }
                };
                image.src = 'https://vault.platformpurple.com/static/clients/mypvolve/vector_girl_grey.jpg'
            },

            createResumableFileObj(file) {
                k('createResumableFileObj 90 day: ', this.uploadingCanvasImage)
                this.newProgressImageFileName = `progressImage_${this.userInfo.userID}_${Date.now()}.jpg`

                var fileInfo = {}
                fileInfo[file.uniqueIdentifier] = {
                    'purpleFileName': this.newProgressImageFileName,
                    'filePurpose': 'progressImage'
                }
                // k('fileInfo: ', fileInfo)

                this.$store.commit('dropZoneFileInfo', fileInfo)
                this.uploadImage()
            },

            sendImageInfoToAPI() {
                // also send regular progressPic record
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

            sendNinetyDayChallengeImageInfoToAPI(slotIndex) {
                k('sendNinetyDayChallengeImageInfoToAPI: ', slotIndex)

                let index = this.userPreferences.findIndex((preference) => {
                    k('type: ', preference.type, this.customImageType)
                    k('id: ', preference.ninetyDayProgressDayNumber, this.transformationSlots[slotIndex].id)
                    return preference.type === this.customImageType && preference.ninetyDayProgressDayNumber === this.transformationSlots[slotIndex].id
                })
                k('sendNinetyDayChallengeImageInfoToAPI index: ', index)
                let preferenceID = index > -1 ? this.userPreferences[index].id : ''

                var req = {
                    userID: this.userInfo.userID,
                    userLoginToken: this.userLoginToken,
                    type: this.customImageType,
                    ninetyDayProgressDayNumber: this.transformationSlots[slotIndex].id,
                    environment: this.environmentName,
                    displayDateTimeStamp: this.moment(this.transformationDate).valueOf(),
                    imageURL: this.transformationSlots[slotIndex].imageData.imageURL
                }
                k('sendNinetyDayChallengeImageInfoToAPI req: ', req)

                this.saveUserPreferenceToAPI(preferenceID, req, (res) => {
                    k('sendNinetyDayChallengeImageInfoToAPI res: ', res)
                    if (!res.success) this.$q.notify({
                        message: 'Could not save image to account. Please try again.',
                        type: 'negative',
                        icon: 'fas fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                    if (res.success) this.imageInfoSavingComplete = true
                })
            },

            replaceOrAddLocalUserPreference(newPreference) {
                if (!this.userPreferences) {
                    this.$store.commit('userPreferences', []);
                }

                let cloneUserPreferences = this.j_.cloneObject(this.userPreferences)
                let index = cloneUserPreferences.findIndex(preference => preference['type' || 'userInfoType'] === newPreference['type' || 'userInfoType'] && preference.ninetyDayProgressDayNumber === newPreference.ninetyDayProgressDayNumber)
                k('replaceOrAddLocalUserPreference index: ', index)

                if (index > -1) {
                    cloneUserPreferences[index] = newPreference;
                } else {
                    cloneUserPreferences.push(newPreference)
                }

                this.$store.commit('userPreferences', cloneUserPreferences)
            },

            resetAllTransformationSlots() {

                // do not reset slots on removal of image from progress images
                // for (var i = 0; i < this.transformationSlots.length; i++) {
                //     let slot = this.transformationSlots[i]
                //     if (slot.imageData) {
                //       this.resetTransformationSlot(i)
                //     }
                // }
            },
        },

        watch: {
            userPreferences() {
                this.displayProgressImages()
                this.displayNinetyDayChallengeImages()
            },

            shareUserStory() {
                k('watch shareUserStory')

                if (this.shareUserStory) {
                    setTimeout(() => {
                        this.drawCanvas()
                    })

                    if (this.transformationSlots && this.transformationSlots[0] && this.transformationSlots[0].imageData) {
                        this.showCropperForPreselectedImage()
                    }
                }
            }
        },

        created() {
            this.$store.commit('dropZoneMaxFiles', 1)
            this.$store.commit('dropZoneTarget', this.api.bigRoute + 'upload/progressImages')
            this.$store.commit('dropZoneFileTypesAllowed', ['image/png', 'image/jpeg'])

            if (this.userPreferences) {
                this.displayProgressImages()
                this.displayNinetyDayChallengeImages()
            } else if (this.userInfo && this.userInfo.userID) this.getUserPreferences(() => {})
        }
    }
</script>

<style scoped>
    .productCard {
        height: 100%;
    }
    .padded {
        padding: 2rem;
    }
    #transformationCanvas {
        width: 100%;
        max-width: 750px;
        border: 1px solid rgb(153, 153, 153);
    }
    .img-container {
        height: 300px;
    }
</style>
