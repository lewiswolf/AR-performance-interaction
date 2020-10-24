// gui && polling
const addHoldListener = (element, id, func) => {
    // set the polling rate for the sensors in ms
    const pollingRate = 100
    // empty setInterval
    let timer

    const touchWrapper = (e) => {
        if (e.cancelable) {
            e.preventDefault()
            downListener()
        }
    }

    const downListener = () => {
        timer = setInterval(func, pollingRate)
        func()
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

addHoldListener(
    document.getElementById('gyroButton'),
    'Gyroscope',
    () => axios.post('/', { message: 'this a message from react to max' })
)

addHoldListener(
    document.getElementById('accelButton'),
    'Accelorometer',
    () => axios.post('/', { message: 'this a message from react to max' })
)