// Vidhandler toggles visibility of live-streamed video
AFRAME.registerComponent('vidhandler', {
    init: function () {
        this.toggle = false
        this.vid = document.querySelector('video')
        this.canvas = document.querySelector('canvas')
    },
    tick: function () {
        if (this?.el?.object3D.visible === true) {
            if (!this.toggle) {
                this.toggle = true
                this.vid.style.visibility = 'visible'
                this.canvas.style.visibility = 'visible'
                // this.vid.play();
            }
        } else {
            if (this.toggle) {
                this.toggle = false
                // this.vid.pause();
                this.vid.style.visibility = 'hidden'
                this.canvas.style.visibility = 'hidden'
            }
        }
    },
})