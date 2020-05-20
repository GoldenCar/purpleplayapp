<template>
    
    <div :id="componentData.id" class="well">

        <h6>testimonials</h6>
        <hr />
        
        <q-carousel arrows infinite color="white">
            <q-carousel-slide v-for="slide in componentData.testimonials" :key="slide.id">
                <q-card class="bg-white" style="padding: 2rem;">
                    <p style="font-style: italic;" class="monty">"{{slide.quote}}"</p>
                    <p style="color: #777; font-size: .8rem;" class="monty">{{slide.author}}</p>
                </q-card>
            </q-carousel-slide>
        </q-carousel>
    </div>
    
</template>

<script>

    export default {
        props: ['componentData'],
        
        data() {
            return {
                
            }
        },
        
        computed: {
            
        },
        
        methods: {
            
        },

        mounted() {
            // k('componentData: ', this.componentData)
        }
    }
</script>

<style scoped>
    
</style>
