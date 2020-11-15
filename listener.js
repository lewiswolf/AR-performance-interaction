'use strict'
const axios = require('axios')
const max = require('max-api')

const pollingRate = 1000;

(() => {
    const queryServer = async () => {
        try {
            let res = await axios.get('https://localhost:4000/maxmsp')
            max.outlet(res)
        } catch (e) {
            max.post(e)
        }
    }
    setInterval(queryServer, pollingRate)
})()
