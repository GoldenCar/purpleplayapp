<template>
  <div class="home-background">
    <div style="max-width: 1200px; margin: auto;">
      <img
        src="statics/ekb/EKB-logo-white.svg"
        style="max-height: 225px; max-width: 100%;" />
      <p style="font-size: 2em; margin-top: -15px; color: white;">{{ $t('presents') }}</p>
      <img
        src="statics/ekb/discovery-education-offline-logo.png"
        style="max-height: 75px; max-width: 100%;" />
      <p class="section_title">{{ $t('howToUseSectionTitle') }}</p>
      <div class="row gutter-sm">
        <div v-for="step in $t('steps')" class="col-sm-12 col-md-4">
          <div class="home_card" :style="{ 'backgroundColor': step.backgroundColor }">
            <h2 class="home_card__header">{{ step.header }}</h2>
            <div class="home_card__body">
              <p class="home_card__title">{{ step.title }}</p>
              <p class="home_card__text">{{ step.text }}</p>
              <div class="home_card__img_container">
                <img class="home_card__img" :src="'statics/ekb/' + step.screenshot" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="section_title">{{ $t('moreInfoSectionTitle') }}</p>
      <div class="half_image_section row items-center" v-for="section in $t('halfImageSections')">
        <div class="col-sm-12 col-md-6">
          <p class="half_image_section_title" style="line-height: 1.25;">{{section.title}}</p>
          <p class="half_image_section_text">{{section.text}}</p>
          <div>
            <div class="home_btn" @click="openURL(section.button.link)">{{section.button.label}}</div>
          </div>
        </div>
        <div class="order-first-sm col-sm-12 col-md-6">
          <div class="half_image_section_image">
            <img :src="'statics/ekb/' + section.image" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    openURL(url) {
      window.open(url, '_blank')
    }
  },

  beforeMount() {
    if (!navigator.onLine) {
      this.$router.push('/downloads');
    }
  }
}
</script>
<style scoped>
.home-background {
  background-color: #0F1C24;
  color: #fff;
  text-align: center;
  padding-left: 25px;
  padding-right: 25px;
  padding-bottom: 25px;
}

.home_btn {
  background-color: #efad4f;
  color: #fff;
  display: inline-block;
  padding: 15px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.home-background .half_image_section {
  text-align: initial;
}

.section_title {
  font-size: 1.45em;
  color: #fff;
  text-align: center;
  font-weight: 600;
  margin-top: 35px;
  margin-bottom: 35px;
}

.home_card {
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 10px;
  padding: 25px;
  width: 100%;
}

.home_card__header {
  text-align: center;
  padding-bottom: 25px;
  margin-top: 25px;
  margin-bottom: 0px;
  font-size: 5em;
  font-weight: 600;
  color: #fff;
}

.home_card__body {
  position: relative;
  padding-left: 15px;
  padding-right: 15px;
  min-height: 350px;
}

.home_card__title {
  color: #fff;
  text-align: center;
  margin-top: 0px;
  font-weight: 600;
  font-size: 1.5em;
}

.home_card__text {
  color: #fff;
}

.home_card__img_container {
  position: absolute;
  width: 100%;
  left: 0px;
  bottom: 0px;
  text-align: center;
}

.home_card__img {
  border-radius: 4px;
  border: 3px solid white;
  margin-top: 5px;
  max-width: 400px;
  width: 100%;
}

.half_image_section {
  margin-bottom: 35px;
  background-color: #fff;
  border-radius: 10px;
  padding: 25px;
}

.half_image_section_title {
  font-size: 2em;
  font-weight: 400;
  color: #333;
  margin-top: 0px;
}

.half_image_section_text {
  color: #333;
}

.half_image_section_image {
    text-align: center;
}

.vertical_align_middle {
  vertical-align: middle;
  width: 50%;
}

.half_image_section_image img {
  max-width: 50%;
  margin-left: auto;
  margin-right: auto;
  max-height: 300px;
}

@media screen and (max-width: 768px) {
  .order-first-sm {
    margin-bottom: 15px;
    order: -10000;
  }
}
</style>
