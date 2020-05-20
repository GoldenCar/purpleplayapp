<template>

  <div v-if="currentProduct.productJSON.audio.length > 1" class="scroll" style="background: #fff; max-height: 70vh; height: 100%;">

      <q-list separator highlight>
          <q-list-header>
              <h5>Tracks</h5>
          </q-list-header>

          <q-item v-for="(item, index) in currentProduct.productJSON.audio" :key="item.displayName" :style="'cursor: pointer;' + (currentTrack === item ? 'background: rgba(189, 189, 189, 0.5);' : '')" @click.native="$emit('selectTrack', index)">
              <q-item-side icon="fas fa-music" :style="(currentTrack === item ? 'color: #564F8A;' : '')" />
              <q-item-main>
                  {{item.displayName}}
              </q-item-main>
          </q-item>

      </q-list>

  </div>

</template>

<script>
  export default {
    props: ['currentTrack'],
    computed: {
        currentProduct() {
            return this.$store.state.currentProduct
        }
    }
  }
</script>

<style>

</style>
