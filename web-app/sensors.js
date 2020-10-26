// set the polling rate for the sensors in ms
const pollingRate = 100

// there should be another button you click to start the app and grant all the permissions

/* 
    GYRO
*/

let deviceOrientation = {
    alpha: null,
    beta: null,
    gamma: null,
}

const getDeviceOrientation = (e) => {
    deviceOrientation = {
        alpha: e.alpha,
        beta: e.beta,
        gamma: e.gamma,
    }
}

// button constructor
const addGyroListener = (() => {
    let element = document.getElementById('gyroButton')
    let timer // empty setInterval
    let permissionState = null // permissions for listener

    const touchWrapper = (e) => {
        if (e.cancelable) {
            e.preventDefault()
            downListener()
        }
    }

    const downListener = () => {
        setStyles(true)
        // add mouseup listeners
        element.addEventListener('touchend', upListener)
        element.addEventListener('touchcancel', upListener)
        window.addEventListener('mouseup', upListener)

        if (permissionState) {
            const post2server = () => {
                axios.post('/', deviceOrientation)
            }
            // add listener and start sending
            window.addEventListener('deviceorientation', getDeviceOrientation)
            timer = setInterval(post2server, pollingRate)
        }
    }

    const upListener = async () => {
        // if !permission, request it!
        if (!permissionState && typeof DeviceOrientationEvent.requestPermission === 'function') {
            permissionState = await DeviceOrientationEvent.requestPermission()
        }

        // stop timer and remove listener
        if (permissionState) {
            clearInterval(timer)
            removeEventListener('deviceorientation', getDeviceOrientation)
        }

        setStyles(false)

        // remove mouseup listeners
        element.removeEventListener('touchend', upListener)
        element.removeEventListener('touchcancel', upListener)
        window.removeEventListener('mouseup', upListener)
    }

    const setStyles = (bool) => {
        element.innerText = `Gyroscope ${bool ? 'Listening' : 'Off'}`
        Object.assign(element.style, {
            color: bool ? 'slategrey' : 'whitesmoke',
            background: bool ? 'palegreen' : 'palevioletred'
        })
    }

    // add default listeners
    element.addEventListener('touchstart', touchWrapper)
    element.addEventListener('touchmove', (e) => e.preventDefault())
    element.addEventListener('mousedown', downListener)
    // set default text
    setStyles(false)
})()


/* 
    ROTATIOM
*/

let deviceMotion = {
    x: null,
    y: null,
    z: null,
}

const getDeviceMotion = (e) => {
    deviceMotion = {
        x: e.accelerationIncludingGravity.x,
        y: e.accelerationIncludingGravity.y,
        z: e.accelerationIncludingGravity.z,
    }
}


// button constructor
const addAccelListener = (() => {
    let element = document.getElementById('accelButton')
    let timer // empty setInterval
    let permissionState = null // permissions for listener

    const touchWrapper = (e) => {
        if (e.cancelable) {
            e.preventDefault()
            downListener()
        }
    }

    const downListener = () => {
        setStyles(true)
        // add mouseup listeners
        element.addEventListener('touchend', upListener)
        element.addEventListener('touchcancel', upListener)
        window.addEventListener('mouseup', upListener)

        if (permissionState) {
            const post2server = () => {
                axios.post('/', deviceMotion)
            }
            // add listener and start sending
            window.addEventListener('devicemotion', getDeviceMotion)
            timer = setInterval(post2server, pollingRate)
        }
    }

    const upListener = async () => {
        // if !permission, request it!
        if (!permissionState && typeof DeviceMotionEvent.requestPermission === 'function') {
            permissionState = await DeviceMotionEvent.requestPermission()
        }

        // stop timer and remove listener
        if (permissionState) {
            clearInterval(timer)
            removeEventListener('devicemotion', getDeviceMotion)
        }

        setStyles(false)

        // remove mouseup listeners
        element.removeEventListener('touchend', upListener)
        element.removeEventListener('touchcancel', upListener)
        window.removeEventListener('mouseup', upListener)
    }

    const setStyles = (bool) => {
        element.innerText = `Accelerometer ${bool ? 'Listening' : 'Off'}`
        Object.assign(element.style, {
            color: bool ? 'slategrey' : 'whitesmoke',
            background: bool ? 'palegreen' : 'palevioletred'
        })
    }

    // add default listeners
    element.addEventListener('touchstart', touchWrapper)
    element.addEventListener('touchmove', (e) => e.preventDefault())
    element.addEventListener('mousedown', downListener)
    // set default text
    setStyles(false)
})()