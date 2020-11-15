const pollingRate = 100 // set the polling rate for the sensors in ms
let permissionState = null; // motion event permissions
let gyro = document.getElementById('gyroButton') // gyro button
let timer // empty setInterval
let deviceOrientation = {
    alpha: null,
    beta: null,
    gamma: null,
}

// create cookies object
const refreshCookies = () => {
    let newCookie = document.cookie ?
        document.cookie
            .split(';')
            .map(cookie => cookie.split('='))
            .reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {})
        : null
    if (newCookie?.userID) {
        newCookie.userID = parseInt(newCookie.userID)
    }
    return newCookie
}

let cookies = refreshCookies();
let sessionExpires = new Date() // expiry date for cookies
sessionExpires.setTime(sessionExpires.getTime() + (1 * 24 * 60 * 60 * 1000))

const requestUserID = async () => {
    cookies = refreshCookies()
    if (!cookies?.userID) {
        try {
            const res = await axios.get('/user-id')
            document.cookie = `userID=${res.data.id}; expires=${sessionExpires.toGMTString()}`
        } catch {
            document.cookie = `userID=0; expires=${sessionExpires.toGMTString()}`
        } finally {
            cookies = refreshCookies()
            gyroFunc.setState(cookies?.userID ? 'off' : 'inactive')
        }
    }
}

const returnUserID = async () => {
    cookies = refreshCookies()
    if (cookies?.userID) {
        await axios.post('/user-id', { id: cookies.userID })
        document.cookie = `userID=0; expires=${sessionExpires.toGMTString()}`
        gyroFunc.setState('inactive')
    }
}

const gyroFunc = {
    state: 'inactive',
    setState: (state) => {
        let text;
        let color;

        switch (state) {
            case 'on':
                text = 'Gyroscope Listening'
                color = '#9cff57'
                break;
            case 'off':
                text = 'Gyroscope Off'
                color = '#ff7961'
                break;
            case 'inactive':
                text = 'Not Available'
                color = '#b0bec5'
                break;
            default:
                break;
        }
        gyroFunc.state = state
        gyro.innerText = text
        Object.assign(gyro.style, { background: color })
    },
    getDeviceOrientation: (e) => {
        deviceOrientation = {
            alpha: e.alpha,
            beta: e.beta,
            gamma: e.gamma,
        }
    },
    touchWrapper: (e) => {
        if (e.cancelable) {
            e.preventDefault()
            gyroFunc.downListener()
        }
    },
    mouseWrapper: (e) => {
        if (e.button === 0) {
            gyroFunc.downListener()
        }
    },
    downListener: async () => {
        if (gyroFunc.state === 'off') {
            cookies = refreshCookies()
            if (cookies.userID) {
                gyroFunc.setState('on')
                // add mouseup listeners
                gyro.addEventListener('touchend', gyroFunc.upListener)
                gyro.addEventListener('touchcancel', gyroFunc.upListener)
                window.addEventListener('mouseup', gyroFunc.upListener)

                // if !permission, request it!
                if (!permissionState && DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    permissionState = await DeviceOrientationEvent.requestPermission()
                }

                if (permissionState) {
                    const post2server = () => {
                        axios.post('/params', Object.assign({ id: cookies.userID }, deviceOrientation))
                    }
                    // add listener and start sending
                    window.addEventListener('deviceorientation', gyroFunc.getDeviceOrientation)
                    timer = setInterval(post2server, pollingRate)
                }
            } else {
                // if a cookie doesn't exist, turn inactive
                gyroFunc.setState('inactive')
            }
        } else {
            // if the button is inacgtive, request a new key
            requestUserID()
        }
    },
    upListener: () => {
        // stop timer and remove listener
        if (permissionState) {
            clearInterval(timer)
            removeEventListener('deviceorientation', gyroFunc.getDeviceOrientation)
        }
        gyroFunc.setState('off')

        // remove mouseup listeners
        gyro.removeEventListener('touchend', gyroFunc.upListener)
        gyro.removeEventListener('touchcancel', gyroFunc.upListener)
        window.removeEventListener('mouseup', gyroFunc.upListener)
    },
};

(async () => {
    // check permissions initially
    try {
        if (!permissionState && DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
            permissionState = await DeviceOrientationEvent.requestPermission()
        }
    } catch { } finally {
        if (cookies?.userID) {
            gyroFunc.setState('off')
        } else {
            requestUserID()
        }

        // add default listeners
        window.addEventListener('focus', requestUserID)
        window.addEventListener('blur', returnUserID)
        window.addEventListener('beforeunload', returnUserID)
        gyro.addEventListener('touchstart', gyroFunc.touchWrapper)
        gyro.addEventListener('touchmove', (e) => e.preventDefault())
        gyro.addEventListener('mousedown', gyroFunc.mouseWrapper)
    }
})()