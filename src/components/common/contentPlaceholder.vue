<template>

    <div class="contentPlaceholder">
        <div class="animated-background">
            <div class="background-masker content-top"></div>
            <div class="background-masker content-first-end"></div>
            <div class="background-masker content-second-line"></div>
            <div class="background-masker content-second-end"></div>
            <div class="background-masker content-third-line"></div>
            <div class="background-masker content-third-end"></div>
        </div>
    </div>

</template>

<script>

    export default {
        props: ['componentData'],

        mixins: [],

        data() {
            return {

            }
        },

        computed: {

        },

        methods: {

        }
    }
</script>

<style scoped>
    @keyframes placeHolderShimmer{
        0%{
            background-position: -468px 0
        }
        100%{
            background-position: 468px 0
        }
    }

    .animated-background {
        animation-duration: 1s;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
        animation-name: placeHolderShimmer;
        animation-timing-function: linear;
        background: #f6f7f8;
        background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
        background-size: 800px 104px;
        height: 140px;
        position: relative;
    }

    .contentPlaceholder {
        background: #fff;
        border: 1px solid;
        border-color: #e5e6e9 #dfe0e4 #d0d1d5;
        border-radius: 3px;
        padding: 12px;

        margin: 0 auto;
        max-width: 472px;
        min-height: 200px;
    }

    .background-masker {
        background: #fff;
        position: absolute;
    }

    /* Every thing below this is just positioning */

    .background-masker.content-top,
    .background-masker.content-second-line,
    .background-masker.content-third-line,
    .background-masker.content-second-end,
    .background-masker.content-third-end,
    .background-masker.content-first-end {
        top: 100px;
        left: 0;
        right: 0;
        height: 6px;
    }

    .background-masker.content-top {
        height: 10px;
    }

    .background-masker.content-first-end,
    .background-masker.content-second-end,
    .background-masker.content-third-end{
        width: auto;
        left: 380px;
        right: 0;
        top: 90px;
        height: 8px;
    }

    .background-masker.content-second-line  {
        top: 116px;
    }

    .background-masker.content-second-end {
        left: 420px;
        top: 94px;
    }

    .background-masker.content-third-line {
        top: 128px;
    }

    .background-masker.content-third-end {
        left: 300px;
        top: 88px;
    }
</style>
