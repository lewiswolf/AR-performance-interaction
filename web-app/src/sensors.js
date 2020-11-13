// set the polling rate for the sensors in ms
const pollingRate = 100

let permissionState = null
let userID = 0;

(async () => {
    try {
        if (!permissionState && typeof DeviceOrientationEvent.requestPermission === 'function') {
            permissionState = await DeviceOrientationEvent.requestPermission()
        }
        const res = await axios.get('/user-id');
        userID = res.data.id
    } catch (e) {
        userID = 0
    } finally {
        if (userID) {
            // return user ID
            window.onunload = () => {
                axios.post('/user-id', { id: userID })
            }

            let element = document.getElementById('gyroButton')
            let timer // empty setInterval
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

            const touchWrapper = (e) => {
                if (e.cancelable) {
                    e.preventDefault()
                    downListener()
                }
            }

            const mouseWrapper = (e) => {
                if (e.button === 0) {
                    downListener()
                }
            }

            const downListener = async () => {
                setStyles(true)
                // add mouseup listeners
                element.addEventListener('touchend', upListener)
                element.addEventListener('touchcancel', upListener)
                window.addEventListener('mouseup', upListener)

                // if !permission, request it!
                if (!permissionState && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    permissionState = await DeviceOrientationEvent.requestPermission()
                }

                if (permissionState) {
                    const post2server = async () => {
                        await axios.post('/params', Object.assign({ id: userID }, deviceOrientation))
                    }
                    // add listener and start sending
                    window.addEventListener('deviceorientation', getDeviceOrientation)
                    timer = setInterval(post2server, pollingRate)
                }
            }

            const upListener = () => {
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
                    background: bool ? '#9cff57' : '#ff7961'
                })
            }

            setStyles(false)

            // add default listeners
            element.addEventListener('touchstart', touchWrapper)
            element.addEventListener('touchmove', (e) => e.preventDefault())
            element.addEventListener('mousedown', mouseWrapper)
        } else {
            let element = document.getElementById('gyroButton')
            element.innerText = 'Not available'
            Object.assign(element.style, {
                background: '#b0bec5'
            })
        }
    }
})()

/*
    ROTATIOM
*/

// let deviceMotion = {
//     x: null,
//     y: null,
//     z: null,
// }

// const getDeviceMotion = (e) => {
//     deviceMotion = {
//         x: e.accelerationIncludingGravity.x,
//         y: e.accelerationIncludingGravity.y,
//         z: e.accelerationIncludingGravity.z,
//     }
// }


// // button constructor
// const addAccelListener = (() => {
//     let element = document.getElementById('accelButton')
//     let timer // empty setInterval
//     let permissionState = null // permissions for listener

//     const touchWrapper = (e) => {
//         if (e.cancelable) {
//             e.preventDefault()
//             downListener()
//         }
//     }

//     const downListener = async () => {
//         setStyles(true)
//         // add mouseup listeners
//         element.addEventListener('touchend', upListener)
//         element.addEventListener('touchcancel', upListener)
//         window.addEventListener('mouseup', upListener)

//         // if !permission, request it!
//         if (!permissionState && typeof DeviceMotionEvent.requestPermission === 'function') {
//             permissionState = await DeviceMotionEvent.requestPermission()
//         }

//         if (permissionState) {
//             const post2server = () => {
//                 axios.post('/', Object.assign(userID, deviceMotion))
//             }
//             // add listener and start sending
//             window.addEventListener('devicemotion', getDeviceMotion)
//             timer = setInterval(post2server, pollingRate)
//         }
//     }

//     const upListener = () => {
//         // stop timer and remove listener
//         if (permissionState) {
//             clearInterval(timer)
//             removeEventListener('devicemotion', getDeviceMotion)
//         }

//         setStyles(false)

//         // remove mouseup listeners
//         element.removeEventListener('touchend', upListener)
//         element.removeEventListener('touchcancel', upListener)
//         window.removeEventListener('mouseup', upListener)
//     }

//     const setStyles = (bool) => {
//         element.innerText = `Accelerometer ${bool ? 'Listening' : 'Off'}`
//         Object.assign(element.style, {
//             background: bool ? '#9cff57' : '#ff7961'
//         })
//     }

//     // add default listeners
//     element.addEventListener('touchstart', touchWrapper)
//     element.addEventListener('touchmove', (e) => e.preventDefault())
//     element.addEventListener('mousedown', downListener)
//     // set default text
//     setStyles(false)
// })()