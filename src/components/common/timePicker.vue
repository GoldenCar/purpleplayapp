<template>
    
    <div class="row" style="width: 100%; padding: 1rem 0;">
    
        <div :class="inline ? 'col-12' : 'col-sm-12 col-md-4'" :style="inline ? '' : 'padding-right: .5rem;'">
            <q-select 
                id="hour" 
                float-label="hour" 
                v-model="localHour" 
                :options="hourOptions" 
                color="grey" 
            />
        </div>
        
        <div :class="inline ? 'col-12' : 'col-sm-12 col-md-4'" :style="inline ? '' : 'padding-right: .5rem;'">
            <q-select 
                id="minutes" 
                float-label="minute" 
                v-model="localMinutes" 
                :options="minuteOptions" 
                color="grey" 
            />
        </div>
        
        <div :class="inline ? 'col-12' : 'col-sm-12 col-md-4'" :style="inline ? '' : 'padding-right: .5rem;'">
            <q-select 
                id="amOrPm" 
                float-label="AM/PM" 
                v-model="localAmOrPm" 
                :options="amPmOptions" 
                color="grey" 
            />
        </div>
        
    </div>
    
</template>

<script>
    
    export default {
        
        props: ['inputTimeString', 'customMinuteOptions', 'inline'],
        
        data() {
            return {
                localHour: '',
                localMinutes: '',
                localAmOrPm: '',
                
                defaultMinuteOptions: ['00', '15', '30', '45'],
                
                amPmOptions: [{
                    label: 'AM',
                    value: 'am'
                }, {
                    label: 'PM',
                    value: 'pm'
                }],
            }
        },
        
        computed: {
            
            outputTimeString() {
                var timeStr = ''
                k('timeStr input: ', this.localHour, this.localMinutes, this.localAmOrPm)
                
                if (this.localHour && this.localMinutes && this.localAmOrPm) {
                    var hour = Number(this.localHour)
                    var minute = this.localMinutes
                    
                    if (hour === 12 && this.localAmOrPm === 'am') hour = 0
                    if (hour !== 12 && this.localAmOrPm === 'pm') hour += 12
                    
                    timeStr = String(hour) + ':' + String(minute)
                }
                
                k('timeStr: ', timeStr)
                return timeStr
            },
            
            hourOptions() {
                var hoursToRemind = []
                var i = 1
                while (i <= 12) {
                    var option = {
                        label: String(i),
                        value: String(i)
                    }
                    hoursToRemind.push(option)
                    i++
                }
                return hoursToRemind
            },
            
            minuteOptions() {
                var minuteOptions = this.customMinuteOptions || this.defaultMinuteOptions
                return minuteOptions.map((item) => {
                    return {
                        label: String(item),
                        value: String(item)
                    }
                })
            },
        },
        
        watch: {
            outputTimeString() {
                this.$emit('outputTimeString', this.outputTimeString)
            }
        },
        
        methods: {
            getLocalHour() {
                var hour = this.inputTimeString.split(':')[0]
                k('hour: ', hour)
                return hour === 0 ? '12' : String(hour > 12 ? hour - 12 : hour)
            },
            
            getLocalMinutes() {
                return String(this.inputTimeString.split(':')[1])
            },
            
            getLocalAmOrPm() {
                return this.inputTimeString.split(':')[0] >= 12 ? 'pm' : 'am'
            },
        },
        
        created() {
            k('timePicker inital data: ', this.inputTimeString)
            
            this.localHour = this.getLocalHour()
            this.localMinutes = this.getLocalMinutes()
            this.localAmOrPm = this.getLocalAmOrPm()
        }
    }
</script>

<style scoped>
    
</style>