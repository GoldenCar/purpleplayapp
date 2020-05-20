import { userAndProductInfo } from './userAndProductInfo.js'

export const measurementSystem = {

    mixins: [userAndProductInfo],

    computed: {
        measurementSystemPreference() {
            return this.userPreferences ? this.userPreferences.find(item => {
                return item.type === 'measurementSystemPref'
            }) : ''
        },
        
        measurementSystemPreferenceID() {
            return this.measurementSystemPreference ? this.measurementSystemPreference.id : ''  
        },

        measurementSystem: {
            get() {
                let preference = this.measurementSystemPreference;
                if (!preference) {
                    return 'imperial'
                }

                return preference.measurementSystem;
            },

            set() {
                // to fix the warning on checkbox
            }
        },

        weightMeasureUnit() {
            return this.measurementSystem === 'imperial' ? 'pounds' : 'kg'
        },

        lengthMeasureUnit() {
            return this.measurementSystem === 'imperial' ? 'inches' : 'cm'
        }
    },
    
    methods: {
        poundToKg(value) {
            return (value / 2.205)
        },
        
        kgToPound(value) {
            return (value * 2.205)
        },
        
        cmToInch(value) {
            return (value / 2.54)
        },
        
        inchToCm(value) {
            return (value * 2.54)
        },

        displayWeight(value) {
            k('displayWeight: ', value)
            if (this.measurementSystem === 'imperial') {
                return parseFloat(value).toFixed(2);
            }
            return this.poundToKg(value).toFixed(2)
        },

        displayLength(value) {
            k('displayLength: ', value)
            if (this.measurementSystem === 'imperial') {
                return parseFloat(value).toFixed(2);
            }
            return this.inchToCm(value).toFixed(2)
        },

        convertWeightForApi(value) {
            if (this.measurementSystem === 'imperial') {
                return value;
            }
            return this.kgToPound(value)
        },

        convertLengthForApi(value) {
            if (this.measurementSystem === 'imperial') {
                return value;
            }
            return this.cmToInch(value)
        },

        saveMeasurementSystem(newSystem) {
            var req = {
                userID: this.userInfo.userID,
                userLoginToken: this.userLoginToken,
                type: 'measurementSystemPref',
                environment: this.environmentName,
                measurementSystem: newSystem
            }

            k('saveMeasurementSystem req: ', req)

            this.saveUserPreferenceToAPI(this.measurementSystemPreferenceID, req, () => {})
        }
    }
}