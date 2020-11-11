window.onload = () => {
    // Hide livestream video initially
    document.querySelector('video').style.visibility = 'hidden'
    document.getElementsByTagName(html).style.height = '100%'
    document.getElementsByTagName(html).style.width = '100%'
}

// Vidhandler toggles visibility of live-streamed video
AFRAME.registerComponent('vidhandler', {
    init: function () {
        this.toggle = false
        this.vid = document.querySelector('video')
    },
    tick: function () {
        if (this.el.object3D.visible === true) {
            if (!this.toggle) {
                this.toggle = true
                this.vid.style.visibility = 'visible'
                // this.vid.play();
            }
        } else {
            if (this.toggle) {
                this.toggle = false
                // this.vid.pause();
                this.vid.style.visibility = 'hidden'
            }
        }
    },
})