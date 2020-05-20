<template>

    <div class="col-12" v-if="commentLength" style="margin-top: 1rem; border-top: 1px solid #eee; padding: 1rem 0;">
        <q-item v-if="previewComment">
            <q-item-side>
                <img src="https://vault.platformpurple.com/static/clients/mypvolve/pvolve-message-icon.png" style="max-width: 50px;" />
            </q-item-side>
            <q-item-main>
                <h6 :style="`margin-top: .5rem; text-transform: none; color: ${pvolveSalmon};`">"{{previewComment.comment}}"</h6>
                <h6 style="margin: .5rem 0 0 0; text-transform: none; color: #524F4C; font-size: .9rem;">– {{previewComment.commenterName || 'P.volve fan'}} ({{ moment(previewComment.dateCreated).fromNow() }})</h6>
            </q-item-main>
        </q-item>

        <q-btn outline v-if="commentLength > 1" v-scroll-to="'#commentsDisplay'" style="background: #fff !important; color: #333;">
            <h6 style="margin: 0; font-size: .8rem; letter-spacing: 1px;">
                Read All Reviews ({{commentLength}})
            </h6>
        </q-btn>
    </div>

</template>

<script>
    import { pvolveColors } from './pvolveColors'

    export default {
        props: ['commentLength', 'previewComment'],

        data() {
            return {

            }
        },

        mixins: [ pvolveColors ],

        components: {

        },

        computed: {

        }
    }
</script>

<style>

</style>
