<template>
    
    <div>
                
        <div style="padding: 1rem 1.5rem;">
            <h5 class="thickHeader" :style="`color: ${pvolveMintBG}; letter-spacing: 1px;`">Challenge Dates</h5>
            
            <p class="monty" style="font-size: .9rem;">
                The challenge will be broken up into three 30-day periods with prizes at the end of each period. 
            </p>
            
            <ul class="monty" style="line-height: 2rem; color: #545454; font-size: .9rem;">
                <li>30 DAYS (1/10-2/8)</li>
                Complete the first 30 days to receive exclusive nutrition content and a credit for your next month of streaming.
                <li>60 DAYS (2/9-3/10)</li>
                Complete 60 days of the challenge and get a free piece of equipment plus access to exclusive streaming content.
                <li>90 DAYS (3/11-4/9)</li>
                Complete all 90 days and enjoy $500 in gift cards from P.volve and special partners.
            </ul>
            <p class="monty" style="font-size: .9rem;">
                GRAND PRIZE!
                
                Submit your before and after pics after each 30 day period for a chance to win a P & RK Personalized Style Pack and a pop-up in your town plus VIP access!
            </p>
        </div>
                
        <div style="padding: 1rem 1.5rem;">
            <h5 class="thickHeader" :style="`color: ${pvolveMintBG}; letter-spacing: 1px;`">Participant Guidelines</h5>
            
            <ol class="monty" style="padding-left: 1rem; line-height: 2rem; color: #545454; font-size: .9rem;">
                <li>Work out at least 16 days during each 30 day period</li>
                <li>Workouts must be 15 minutes or more</li>
                <li>Multiple workouts in one day only count as one day of workouts</li>
                <li>Structured programs are included</li>
            </ol>
        </div>
        
        <div style="padding: 1rem 1.5rem;">
            <h5 class="thickHeader" :style="`color: ${pvolveMintBG}; letter-spacing: 1px;`">FAQ</h5>
            
            <h6 style="margin: .5rem 0; text-transform: unset;">Opt In Period: 1/1 - 2/8</h6>
            
            <p class="monty" style="color: #545454; font-size: .9rem; padding-bottom: 1rem; border-bottom: 1px #ddd solid;">
            </p>
            
            <h6 style="margin: .5rem 0; text-transform: unset;">I’m new to P.volve, can I still enter the Challenge?</h6>
            
            <p class="monty" style="color: #545454; font-size: .9rem; padding-bottom: 1rem; border-bottom: 1px #ddd solid;">
                Absolutely! And we’ll give you a 30-day trial to get you started when you sign up!
            </p>
            
            <h6 style="margin: .5rem 0; text-transform: unset;">The opt-in period ended but I’m still interested in participating in the challenge, can I?</h6>
            
            <p class="monty" style="color: #545454; font-size: .9rem; padding-bottom: 1rem; border-bottom: 1px #ddd solid;">
                Unfortunately, after the opt in period of 1/1 - 2/8, we cannot accept new participants to the 90 Day Challenge. We recommend you start your journey with the 30 Day Evolution.
            </p>    
            
            <h6 style="margin: .5rem 0; text-transform: unset;">I opted in right before the end of the first 30 days. Can I still be eligible for the grand prize?</h6>
            
            <p class="monty" style="color: #545454; font-size: .9rem; padding-bottom: 1rem; border-bottom: 1px #ddd solid;">
                Unfortunately you will not be eligible for the grand prize but you will still be able to receive the participation prizes at the end of the challenge.
            </p>
            
            <h6 style="margin: .5rem 0; text-transform: unset;">I want my friend to join me, is this possible?</h6>
            
            <p class="monty" style="color: #545454; font-size: .9rem; padding-bottom: 1rem; border-bottom: 1px #ddd solid;">
                Of course! Sign up and invite your friends to join you! You and your friend will each receive a $20 credit to use on your next month!
            </p>
            
            <h6 style="margin: .5rem 0; text-transform: unset;">I didn’t finish the first month, but I did month 2 and 3, do I still get a prize?</h6>
            
            <p class="monty" style="color: #545454; font-size: .9rem; padding-bottom: 1rem; border-bottom: 1px #ddd solid;">
                Yes, even if you didn’t finish all three months you’ll still get a surprise participation prize.
            </p>
            
            <h6 style="margin: .5rem 0; text-transform: unset;">How soon will I receive my prize after the month has ended?</h6>
            
            <p class="monty" style="color: #545454; font-size: .9rem; padding-bottom: 1rem; border-bottom: 1px #ddd solid;">
                We will aim to send out all prizes within 48 hours of the end of each month. 
            </p>
            
            <h6 style="margin: .5rem 0; text-transform: unset;">Can I still receive a grand prize if I’m international?</h6>
            
            <p class="monty" style="color: #545454; font-size: .9rem; padding-bottom: 1rem; border-bottom: 1px #ddd solid;">
                Yes! You will receive the P + RK style pack and we will give you a personalized streaming plan from P. Unfortunately, we cannot guarantee P can visit your town.
            </p>
            
            <h6 style="margin: .5rem 0; text-transform: unset;">When do I need to submit my Before & After photos to be eligible for the grand prize?</h6>
            
            <p class="monty" style="color: #545454; font-size: .9rem; padding-bottom: 1rem; border-bottom: 1px #ddd solid;">
                You must submit a photo during the first 7 days of each month and within the 7 days following of the final month to be considered for the grand prize. 
            </p>
            
            <h6 style="margin: .5rem 0; text-transform: unset;">Where will my Before & After photos go?</h6>
            
            <p class="monty" style="color: #545454; font-size: .9rem; padding-bottom: 1rem; border-bottom: 1px #ddd solid;">
                If you choose to allow P.volve to share your transformation story to motivate others, they will go on our website, social media, and other channels, but only with your initials and city to protect your identity and privacy.
            </p>

        </div>
        
    </div>
      
</template>

<script>
    
    import { pvolveColors } from './pvolveColors'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    
    export default {
        props: ['componentData'],
        
        components: {

        },
        
        mixins: [pvolveColors, globalComputedData],

        data() {
            return {
                
            }
        },

        computed: {
            
        },

        methods: {
            
        },
        
        watch: {
            
        },
        
        mounted() {
            
        }
    }
</script>

<style>
    
</style>
