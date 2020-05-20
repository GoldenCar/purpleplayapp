<template>

    <div id="chapterMenu" v-if="nestedChapters" style="padding-top: 3rem;">
        <q-list separator highlight v-for="(nestedChapter, index) in nestedChapters" :key="nestedChapter.displayName + index" style="padding: 0;">

            <q-item class="chapterItem" v-if="nestedChapter.nonMovieChapter || !nestedChapter.fileName" style="cursor: pointer; background: rgba(189, 189, 189, 0.5);" @click.native="$emit('selectChapterHeading', index)">
                <q-item-side :icon="nestedChapter.nonMovieChapter || !nestedChapter.fileName ? (nestedChapter.showNested ? 'fas fa-chevron-down' : 'fas fa-chevron-right') : 'fas fa-play-circle'" :style="(currentChapter === nestedChapter ? 'color: ' + (brandColor ? brandColor + ';' : '#564F8A;') : '')" />
                <q-item-main>
                    {{nestedChapter.displayName}}
                </q-item-main>
            </q-item>

            <q-item class="chapterItem" v-if="nestedChapter.nonMovieChapter && nestedChapter.showNested" v-for="(child, index) in nestedChapter.children" :key="child.displayName + index" style="cursor: pointer; padding-left: 2rem;" @click.native="$emit('selectChapter', child), $emit('closeChapters')">
                <q-item-side icon="fas fa-play-circle" :style="(currentChapter === child ? 'color: ' + (brandColor ? brandColor + ';' : '#564F8A;') : '')" />
                <q-item-main>
                    {{child.displayName}}
                </q-item-main>
            </q-item>

            <q-item class="chapterItem" v-if="!nestedChapter.nonMovieChapter && nestedChapter.fileName && !nestedChapter.nestLevel || (nestedChapter.nestLevel && nestedChapter.showNested)" style="cursor: pointer;" @click.native="$emit('selectChapter', nestedChapter), $emit('closeChapters')">
                <q-item-side :icon="nestedChapter.nonMovieChapter ? 'fas fa-chevron-right' : 'fas fa-play-circle'" :style="(currentChapter === nestedChapter ? 'color: ' + (brandColor ? brandColor + ';' : '#564F8A;') : '')" />
                <q-item-main>
                    {{nestedChapter.displayName}}
                </q-item-main>
            </q-item>

        </q-list>
    </div>

</template>

<script>
  export default {
    props: ['currentChapter'],

    computed: {
        currentProduct() {
            return this.$store.state.currentProduct
        },

        nestedChapters() {
            return this.$store.state.nestedChapters
        },

        brandColor() {
            return this.brand.brandColor
        }
    }
  }
</script>

<style>

</style>
