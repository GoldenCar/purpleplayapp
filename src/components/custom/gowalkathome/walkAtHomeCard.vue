<template>

    <div class="shadow-4 bg-white" style="height: 100%;">
        <img :src="'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + this.componentData.productSKU + '/' + this.componentData.productSKU + '_image_cover.png'" style="max-width: 100%;" />
        <p style="padding: .5rem; line-height: 20px; margin: 0;">{{componentData.productName}}</p>
    </div>

</template>

<script>
    export default {
        props: ['componentData']
    }
</script>

<style>
</style>
