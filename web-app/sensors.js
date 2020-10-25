/*
    DESIGN PATTERNS NOT YET IMPLEMENTED:

    -   I want to have the event listeners for deviceorientation and devicerotation mount only when the button is held down, 
        and unmount when the button is relased. this will help streamline processing for better video quality.
        
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

window.addEventListener('deviceorientation', getDeviceOrientation)

// button constructors for GUI && polling
const addHoldListener = (element, id) => {
    // set the polling rate for the sensors in ms
    const pollingRate = 100
    // empty setInterval
    let timer

    const post2server = () => {
        axios.post('/', deviceOrientation)
    }

    const touchWrapper = (e) => {
        if (e.cancelable) {
            e.preventDefault()
            downListener()
        }
    }

    const downListener = () => {
        timer = setInterval(post2server, pollingRate)
        post2server()
        setStyles(true)

        // add mouseup listeners
        element.addEventListener('touchend', upListener)
        element.addEventListener('touchcancel', upListener)
        window.addEventListener('mouseup', upListener)
    }

    const upListener = () => {
        clearInterval(timer)
        setStyles(false)

        // remove mouseup listeners
        element.removeEventListener('touchend', upListener)
        element.removeEventListener('touchcancel', upListener)
        window.removeEventListener('mouseup', upListener)
    }

    const setStyles = (bool) => {
        element.innerText = `${id} ${bool ? 'Listening' : 'Off'}`
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
}

// create buttons
addHoldListener(
    document.getElementById('gyroButton'),
    'Gyroscope',
)

// addHoldListener(
//     document.getElementById('accelButton'),
//     'Accelorometer',
//     () => axios.post('/', { message: 'this a message from react to max' })
// )