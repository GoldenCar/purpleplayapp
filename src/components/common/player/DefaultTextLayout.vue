<template>

    <div class="position-relative">
        <MediaMenu style="border-bottom: 1px solid #ccc;" />

        <div class="well display-text" v-html="displayText">
        </div>
    </div>

</template>

<script>
import MediaMenu from "./MediaMenu";

export default {
  props: [],

  components: {
    MediaMenu
  },

  computed: {
    currentProduct() {
      return this.$store.state.currentProduct;
    },
    downloadedProducts() {
      return this.$store.state.downloadedProducts;
    },
    productIsDownloaded() {
      return this.downloadedProducts.length
        ? this.downloadedProducts.filter(item => {
            return item.productID == this.currentProduct.productID;
          })[0]
        : false;
    },
    isCordovaApp() {
      return this.$store.state.isCordovaApp;
    }
  },

  data() {
    return {
      displayText: ""
    };
  },

  created() {
    this.getText();
  },

  methods: {
    getText() {
      let textFileInfo = this.currentProduct.productJSON.text[0];

      if (this.productIsDownloaded) {
        let fileName = textFileInfo.fileName;
        k("local text file: ", fileName);

        let filePath = this.getLocalURL(this.currentProduct.productSKU, fileName).signedURL.replace('file://', '')
        this.fileManager.readFromFileByPath(`file://${filePath}`, file => {
          if (file) {
            this.displayText = file;
          } else {
          }
        });
      } else {
        this.api.get(textFileInfo.uri, res => {
          if (res) {
            this.displayText = res;
          } else {
          }
        });
      }
    }
  }
};
</script>

<style>
@media screen and (orientation: landscape) {
  .display-text {
    padding-left: constant(safe-area-inset-left); /* iOS 11.0 */
    padding-left: env(safe-area-inset-left); /* iOS 11.2 */
    padding-right: constant(safe-area-inset-right); /* iOS 11.0 */
    padding-right: env(safe-area-inset-right); /* iOS 11.2 */
  }
}
.display-text {
  padding-top: 35px;
  background-color: #000;
}

.display-text,
.display-text p,
.display-text div,
.display-text span {
  color: #fff !important;
}
</style>
