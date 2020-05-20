<template>
    <div v-if="!previewMode || (previewMode && comments.length)" class="row justify-center bg-grey-2">
        <div v-if="!previewMode" class="col-12">
            <CommentForm @newComment="userPostedNewComment" :ratingImageSrc="ratingImageSrc" />
        </div>

        <div v-if="comments.length" class="col-12">
            <h5 style="padding: 1rem 1rem 0 1rem;">
                Comments
            </h5>

            <q-card v-for="comment in comments" :key="comment.dateCreated" class="bg-white comment-card">
                <q-card-main>
                    <div class="row">
                        <h6 class="col-6 text-blue-12">
                            {{ comment.commenterName || 'P.volve fan'  }}
                        </h6>
                        <h6 class="col-6 text-grey-7" align="right">
                            {{ moment(comment.dateCreated).calendar() }}
                        </h6>
                    </div>
                    <div class="comment" style="margin-top: .5rem;">
                        {{ comment.comment }}
                    </div>
                </q-card-main>
            </q-card>
        </div>

    </div>
</template>

<script>
    import CommentForm from './CommentForm.vue'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['previewMode', 'ratingImageSrc'],

        components: {
            CommentForm
        },

        mixins: [globalComputedData],

        data() {
            return {
                pendingComments: [],
                comments: []
            }
        },

        methods: {
            userPostedNewComment(comment) {
                if (comment.pending) {
                    this.pendingComments.unshift(comment)
                } else {
                    this.comments.unshift(comment)
                }
            },

            getCommentData() {
                var req = {
                    organizationID: this.brand.organizationID,
                    approvedOnly: true,
                    productID: this.currentProduct.productID
                }
                k('getCommentData req: ', req)

                this.api.post(this.api.apiv4Route + 'api/comments/list2display', req, (res) => {
                    k('getCommentData res: ', res)
                    this.comments = res.comments

                    this.$emit('comments', res.comments)
                })
            }
        },

        created() {
            this.getCommentData()
        }
    }
</script>

<style scoped>
    .pchip {
        vertical-align: bottom;
        display: inline-flex;
        background: #fff;
        color: #000;
        font-size: .9rem;
        margin: 0 .25rem;
        padding: 0 .4rem;
        border-radius: .5rem !important;
    }
</style>
