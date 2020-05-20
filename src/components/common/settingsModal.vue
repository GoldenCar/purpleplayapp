<template>

  <q-modal v-model="$store.state.showSettingsModal" :content-css="{minWidth: '60vw', minHeight: '277px'}" class="settings-modal">
    <q-modal-layout>

      <q-toolbar class="q-layout-header" color="grey" style="box-shadow: none;">
        <q-toolbar-title>
          {{$t('settings')}}
        </q-toolbar-title>
        <q-btn flat icon="fas fa-times" @click="$store.commit('toggleSettingsModal')" style="padding: .5rem;" />
      </q-toolbar>

      <div class="layout-padding">
        <div class="q-mb-sm">{{$t('media_storage_location')}}</div>
        <div class="bg-grey-4 q-pa-md q-caption">{{location}}</div>

        <div class="text-center q-pt-md">
          <q-btn :label="$t('change')" :disable="Boolean(productDownloadQueue.length)" @click="changeFolder" class="q-mr-md">
            <q-tooltip v-if="Boolean(productDownloadQueue.length)" class="bg-red" anchor="bottom middle" :offset="[0, 40]">
              {{$t('Please wait until all downloads finish to change download location!')}}
            </q-tooltip>
          </q-btn>
          <q-btn :label="$t('restore_defaults')" :disable="Boolean(productDownloadQueue.length)" @click="restoreDefaultLocation">
            <q-tooltip v-if="Boolean(productDownloadQueue.length)" class="bg-red" anchor="bottom middle" :offset="[0, 40]">
              {{$t('Please wait until all downloads finish to change download location!')}}
            </q-tooltip>
          </q-btn>
        </div>

        <div class="app-version" v-on:dblclick="showPasswordPrompt">v{{version()}}</div>
      </div>
    </q-modal-layout>

  </q-modal>

</template>

<script>
import { Platform } from "quasar";
import discoveryAdminModal from '../../mixins/discoveryAdminModal';

let remote, dialog, fs, path;
if (Platform.is.electron) {
  remote = require("electron").remote;
  dialog = remote.dialog;
  fs = require("fs");
  path = require("path");
}

export default {
  data() {
    return {
      location: null,
      version() {
        return vNumber();
      }
    };
  },

  mixins: [discoveryAdminModal],

  computed: {
    defaultLocation() {
      return path.join(
        remote.app.getPath("appData"),
        process.env.APP_NAME,
        "downloads"
      );
    },

    productDownloadQueue() {
      return this.$store.state.productDownloadQueue;
    }
  },
  methods: {
    restoreDefaultLocation() {
      this.renameDirectory(this.defaultLocation);
    },

    changeFolder() {
      const selectedPath = dialog.showOpenDialog({
        properties: ["openDirectory"]
      });
      if (!selectedPath) {
        return;
      }

      const downloadsNewLocation = path.join(selectedPath[0], "Discovery");

      // check if downloads directory don't exist in the new directory
      this.renameDirectory(downloadsNewLocation);
    },

    renameDirectory(downloadsNewLocation) {
      try {
        fs.renameSync(this.location, downloadsNewLocation);
      } catch (error) {
        let errorMessage;
        switch (error.code) {
          case "ENOTEMPTY":
            errorMessage =
              "A directory named 'Discovery' already exists in the destination folder";
            break;
          default:
            errorMessage =
              "There was a problem moving files to the new location.";
        }
        this.$q.notify({
          message: errorMessage,
          type: "negative",
          icon: "fas fa-exclamation-circle",
          position: "bottom-left"
        });
        return;
        // an unknown error occured
      }

      this.location = downloadsNewLocation;
      localStorage.setItem("downloadsLocation", downloadsNewLocation);
    }
  },

  mounted() {
    if (localStorage.getItem("downloadsLocation")) {
      this.location = localStorage.getItem("downloadsLocation");
      return;
    }
    this.location = this.defaultLocation;
  }
};
</script>

<style>
.app-version {
  position: absolute;
  bottom: 7px;
  left: 10px;
  font-size: 11px;
}
</style>
