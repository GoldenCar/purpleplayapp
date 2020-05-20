<template>
    <div>
        <!-- <div :style="`background: ${heroComponentData.backgroundColor || '#fff'};`">
            <div id="hero" :class="`row ${windowWidth < 768 ? 'angled' : ''}`" @click="goToHeroLink" :style="heroStyle">
                <div class="color-overlay" :style="overlayStyle"></div>

                <div id="headerColor" class="well" :style="innerHeroStyle">
                    <h6 align="center" class="text-white thickHeader" style="text-transform: uppercase; letter-spacing: 1px; font-size: .8rem;">welcome to p.volve for beginners</h6>

                    <h1 align="center":style="`color: ${heroComponentData.textColor}; font-size: 3rem; margin: 2rem;`">Tutorials, beginner <br /> workout plans & more.</h1>
                    <h6 align="center" class="text-white thinHeader" style="letter-spacing: 1px;">Take your workouts on the go with the P.volve App.</h6>

                    <div align="center" style="margin: 2rem;">
                        <q-btn outline @click="$root.$emit('openMobileAppModal', true)" size="lg" :style="`background: #fff !important; color: #333;`">
                            <h6 style="font-size: .8rem; letter-spacing: 1px;">Download the P.volve app</h6>
                        </q-btn>
                    </div>
                </div>
            </div>
        </div> -->

        <div :style="productSectionStyle">

            <div class="row well">
                <div class="col-md-7 col-sm-12" align="center" style="padding: 1rem;">
                    <img src="https://vault.platformpurple.com/static/previews/bodi4453_15daybegin-897/bodi4453_15daybegin-897_500px_cover.png" style="max-width: 100%;" />
                </div>

                <div class="col-md-5 col-sm-12" style="padding: 1rem;">
                    <h3 class="thinHeader">2 Week Beginner Program</h3>

                    <p style="color: #545454;">New here? You’re in the right place. This 2 week program was designed with the P.volve beginner in mind. As a revolutionary fitness method based in functional science, even the most seasoned fitness fiends should start their P.volve evolution from the ground up. <br /> <br /> The only way to reach your full fitness potential is to start with a solid foundation and master the fundamentals. You’ve got to start somewhere — that somewhere is here.</p>

                    <q-btn outline @click="route('/beginner-series')" :style="`background: #fff !important; color: #333;`">
                        <h6 style="font-size: .8rem; letter-spacing: 1px;">Start now</h6>
                    </q-btn>
                </div>
            </div>

            <div align="center" style="margin-top: 2rem;">
                <h2 class="text-grey-9" >Tutorials</h2>
            </div>

            <productSection :componentData="tutorialSectionComponentData" :homePageSectionIndex="-1" />

            <div align="center" style="margin-top: 2rem;">
                <h2 class="text-grey-9" ><img src="https://vault.platformpurple.com/static/clients/mypvolve/PLV157-18_StreamingUpdates_Icons_Bar_Beginner.png" style="max-width: 3rem; vertical-align: bottom; margin: -0.3rem;" /> Beginner workouts</h2>
            </div>

            <productSection :componentData="beginnerSectionComponentData" :homePageSectionIndex="-1" />

            <div align="center" style="margin-top: 2rem;">
                <h2 class="text-grey-9" ><img src="https://vault.platformpurple.com/static/clients/mypvolve/PLV157-18_StreamingUpdates_Icons_Bar_Beginner.png" style="max-width: 3rem; vertical-align: bottom; margin: -0.3rem;" /> P's structured plans for beginners</h2>
            </div>

            <pvolveStructuredProducts :componentData="beginnerStructuredProductComponentData" />

        </div>
    </div>

</template>

<script>
    import pvolveStructuredProducts from './pvolveStructuredProducts'
    import productSection from '../../common/showcase/productSection'

    import { pvolveColors } from './pvolveColors'
    import { pvolveProductSectionTools } from './pvolveProductSectionTools'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { designTools } from '../../../mixins/designTools'

    export default {
        props: ['componentData'],

        mixins: [userAndProductInfo, designTools, pvolveColors, pvolveProductSectionTools],

        components: {
            productSection,
            pvolveStructuredProducts
        },

        data() {
            return {

            }
        },

        computed: {
            productSectionStyle() {
                return 'background: #fff; padding: 0;'
            },

            heroImageSrc() {
                return 'https://vault.platformpurple.com/static/clients/' + this.heroComponentData.backgroundImageURL
            },

            logoSrc() {
                return this.heroComponentData.logoURL + '?t=' + Date.now()
            },

            windowWidth() {
                return this.$root.$store.state.windowWidth
            },

            heroStyle() {
                var styleStr = ""
                styleStr += this.heroComponentData.backgroundImageURL ? "background: url(" + this.heroImageSrc + "); " : ""
                styleStr += this.heroComponentData.headerColor ? "background-color: " + this.heroComponentData.headerColor + "; " : ""
                styleStr += `background-position: ${this.windowWidth < 768 ? '50% 0%' : '50% 0%'};`
                styleStr += "background-size: " + (this.heroComponentData.backgroundSize || 'cover') + "; "
                styleStr += "background-repeat: no-repeat; "
                styleStr += "padding: " + (this.windowWidth > 992 ? this.heroComponentData.padding ? this.heroComponentData.padding : "3rem" : "1rem") + ";"
                // k('styleStr: ', styleStr)
                return styleStr
            },

            overlayStyle() {
                let overlayColor = this.heroComponentData.overlayColor
                let overlayOpacity = this.heroComponentData.overlayOpacity

                let styleStr = ''
                styleStr += overlayColor ? `background-color: ${overlayColor};`: ''
                styleStr += overlayOpacity ? `opacity: ${this.windowWidth < 768 ? '.5' : overlayOpacity};` : ''

                return styleStr
            },

            innerHeroStyle() {
                var styleStr = "z-index: 1; width: 100%;"
                    styleStr += (this.heroComponentData.padding && this.windowWidth > 767 ? 'padding: ' + this.heroComponentData.padding + ' 0;' : this.heroComponentData.mobilePadding && this.windowWidth < 768 ? 'padding: ' + this.heroComponentData.mobilePadding + ' 0;' : '')
                    styleStr += (this.heroComponentData.margin && this.windowWidth > 767 ? 'margin: ' + this.heroComponentData.margin + ' 0;' : this.heroComponentData.mobileMargin && this.windowWidth < 768 ? 'margin: ' + this.heroComponentData.mobileMargin + ' 0;' : '')
                return styleStr
            }
        },

        methods: {
            goToHeroLink() {
                if (this.heroComponentData.logoLink) window.open(this.heroComponentData.logoLink, '_blank')
            }
        },

        watch: {

        },

        created() {
            // k('componentData: ', this.componentData)

        }
    }
</script>

<style scoped>
    #hero {
        position: relative;
    }

    .color-overlay {
        position: absolute;
        content: "";
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .angled {
        clip-path: polygon(-300% 0%, 400% 0%, 50% 100%, 50% 100%);
        -webkit-clip-path: polygon(-300% 0%, 400% 0%, 50% 100%, 50% 100%);
    }
</style>
