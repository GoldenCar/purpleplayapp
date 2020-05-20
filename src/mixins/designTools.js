export const designTools = {
    computed: {
        windowWidth() {
            return this.$store.state.windowWidth
        },
    },
    
    methods: {
        adaptiveFontSize(multiplier) {
            if (!multiplier) multiplier = 1
            let size = Math.sqrt(this.windowWidth) / 25 * multiplier
            if (size < .9) size = .9
            if (size > 3) size = 2
            return size
            
        },
        linearAdaptiveFontSize(multiplier) {
            if (!multiplier) multiplier = 1
            var size = this.windowWidth / 700 * multiplier
            return size > 5 ? 5 : size
        }
    }
}