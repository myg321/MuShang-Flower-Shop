export const swipeCellBehavior = Behavior({
    data: {
        swipeCellQueue: []  // instance sotre array
    },

    methods: {
        // When opening slider, store instance into the array
        onSwipeCellOpen(event) {
            var instance = this.selectComponent(`#${event.target.id}`)
            
            this.data.swipeCellQueue.push(instance)
        },

        // click other sliders, turn off selected slider
        onSwipeCellClick() {
            this.onSwipeCellCommonClick()
        },

        // Tap blank area, turn off selceted slider
        onSwipeCellPage(){
            this.onSwipeCellCommonClick()
        },

        // Click sliders
        onSwipeCellCommonClick(){
            this.data.swipeCellQueue.forEach((instance)=> {
                instance.close()
            })

            // After closed, reset the array
            this.data.swipeCellQueue = []
        }
    }
})