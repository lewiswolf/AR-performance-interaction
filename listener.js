'use strict'
const axios = require('axios')
const max = require('max-api')

const pollingRate = 1000;

(() => {
    const queryServer = async () => {
        try {
            let res = await axios.get('https://border-ar-webapp.herokuapp.com/maxmps')
            max.outlet(res.data)
        } catch (e) {
            max.post(e)
        }
    }
    setInterval(queryServer, pollingRate)
})()
