<template>
  <div>

    <q-datetime-picker v-model="startDate" />

  </div>
</template>

<script>

export default {
  data () {
    return {
        startDate: '',
        min: '',
        max: ''
    }
  },

  created() {

  }
}

</script>
