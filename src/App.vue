<template>
  <div id="q-app" :class="{'ltr': $locale === 'en', 'rtl': $locale === 'ar'}">
    <router-view />
  </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style>
  .rtl {
    direction: rtl;
  }
  .ltr {
    direction: ltr;
  }

  .rtl * {
    direction: rtl;
  }
  .ltr * {
    direction: ltr;
  }
</style>
