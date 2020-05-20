<template>
    <div class="search">
        <q-icon name="fas fa-search" color="black" />

        <input
            :value="searchVal"
            @input="changeSearchVal"
            class="search_input"
            type="text"
            :placeholder="appOffline ? $t('explore_offline') : $t('explore_online')"
            @keydown.enter="doSearch"
            ref="searchInput"
        />

        <q-btn v-if="searchVal" flat @click="searchCleared" class="clear-button">
            <q-icon style="font-size: 1.4rem;" class="clear" name="fas fa-times" color="black" />
        </q-btn>

        <q-btn v-if="searchVal" class="no-shadow" color="green" size="xs" @click="doSearch" style='font-size: 0.7rem; padding: .5rem;'>{{ $t('search') }}</q-btn>

    </div>
</template>

<script>
export default {
    props: ['value'],
    computed: {
        appOffline() {
            return this.$store.state.appOffline
        },
        currentPath() {
          return this.$route.path
        },
        windowWidth() {
            return this.$store.state.windowWidth
        },
        searchVal: {
            get () { return this.value },
            set (value) { this.$emit('update:value', value) },
        },
    },
    watch: {
        currentPath(newVal) {
            if (!newVal.startsWith('/searchResults')) this.$emit('closeSearchBar')
        }
    },
    methods: {
        changeSearchVal(ev) {
            this.searchVal = ev.target.value;
        },
        searchCleared() {
            this.searchVal = '';
            this.$refs.searchInput.focus();
            if (!navigator.onLine) {
                this.$router.push('/downloads');
            }
        },
        doSearch() {
            if (this.searchVal) {
                this.api.sendEvent({
                    eventType: "userSearched",
                    eventDesc: `userSearched for ${this.searchVal}`,
                    term: this.searchVal,
                })
            }

            if (navigator.onLine && this.searchVal !== '') {
                this.$router.push('/searchResults/' + this.searchVal)
                // this.$emit('closeSearchBar')
            } else if(!navigator.onLine) {
                this.$router.push('/downloads/' + this.searchVal)
                // this.$emit('closeSearchBar')
            }

        }
    },
    mounted() {
        if (this.windowWidth < 500) {
            this.$refs.searchInput.focus();
        }
    }
}
</script>
<style scoped>
.search {
    background-color: rgba(255,255,255,0.9);
    display: flex;
    align-items: center;
    padding: 0 .5rem;
    flex: 1;
    border-right: 1px solid #ddd;
}

.clear-button {
    width: 30px;
    padding: 0px;
    margin: 0px 10px 0px 5px;
}
:global(.rtl) .clear-button {
    margin: 0px 5px 0px 10px;
}
.search_input {
    padding: 10px 5px;
    background-color: transparent;
    border: none;
    width: 100%;
    font-size: 15px;
    margin-left: 10px;
}
:global(.rtl) .search_input {
    margin-left: 0px;
    margin-right: 10px;
}
.submit {
    padding: 5px 15px;
    background-color: rgb(73, 173, 26);
    color: #fff;
    border: none;
    border-radius: 5px;
    /* margin-right: 35px; */
    font-size: 14px;
    text-transform: uppercase;
    cursor: pointer;
}
:global(.rtl) .submit {
    margin-right: 0px;
    margin-left: 35px;
}
.submit:hover {
    background-color: rgb(107, 204, 61);
}
.clear {

}

</style>
