'use strict'
const https = require('https')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')

// Dev or production
// process.env.port is undefined on localhost, some value on heroku :)
let ISDEV = process.env.PORT === undefined

// Server port
const port = ISDEV ? 4000 : 5000

// Use express.js to create the server (mainly for routing)
const app = express()


// Lay down standard route
app.get('/', (req, res) => {
    // Allow streaming content of any kind
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*')
    // // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    // // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, X-Api-Key')

    // Send the index.html file as response
    // res.writeHead(200, { 'content-type': 'text/html' })
    res.sendFile(__dirname + '/index.html')
})

// express uses this directory for all subsequent requests
app.use(express.static(__dirname))

if (ISDEV) {
    console.log('local')

    // Local private key and certificate for hosting over HTTPS locally
    const privateKey = fs.readFileSync('key.pem', 'utf8')
    const certificate = fs.readFileSync('cert.pem', 'utf8')

    // Create credentials object
    const credentials = { key: privateKey, cert: certificate }

    const httpsServer = https.createServer(credentials, app)
    httpsServer.listen(port)
}
else {
    console.log('onlineee')
    // Heroku assigns ports automagically
    app.listen(process.env.PORT || port)
}

// parse json post messages
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

/*
    ASSIGN USERS IDS
*/

const generateIdArr = (len) => {
    let arr = []
    for (let i = 0; i < len; i++) {
        arr.push(i + 1)
    }
    return arr
}

const numUniqueUsers = 30
let idArr = generateIdArr(numUniqueUsers)

app.get('/user-id', (req, res) => {
    // retrieve a random id from the array
    if (idArr) {
        let rand = Math.round(Math.random() * (idArr.length - 1))
        res.json({ id: idArr[rand] })
        allParams.devicesConnected.push(idArr[rand])
        console.log(`id ${idArr[rand]} is now in use`)

        // remove id from the array
        idArr.splice(rand, 1)
        console.log(`${numUniqueUsers - idArr.length} devices connected`)
    } else {
        res.json({ id: 0 })
    }
})

app.post('/user-id', (req, res) => {
    idArr.push(req.body.id)
    allParams.devicesConnected = allParams.devicesConnected.filter(item => item !== parseInt(req.body.id))
    res.json({ msg: 'success' })
    console.log(`id ${req.body.id} disconnected`)
    console.log(`${numUniqueUsers - idArr.length} devices connected`)
})

/*
    PARAMS
*/

const generateEmptyParams = (len) => {
    let obj = {
        devicesConnected: [],
    }
    for (let i = 0; i < len; i++) {
        obj[i + 1] = {
            alpha: null,
            beta: null,
            gamma: null,
        }
    }
    return obj;
}

let allParams = generateEmptyParams(numUniqueUsers)

app.post('/params', (req, res) => {
    allParams[req.body.id] = {
        alpha: req.body.alpha / 360,
        beta: (req.body.beta + 180) / 360,
        gamma: (req.body.gamma + 90) / 180
    }
    res.json({ msg: 'success' })
})

console.log(`${allParams.devicesConnected.length} devices connected`)

app.get('/maxmps', (req, res) => {
    res.json(allParams)
})

// If we ever want to stream video from the server's filesystem
// app.get('/video', function(req, res) {
//     const path = 'Success.mp4'
//     const stat = fs.statSync(path)
//     const fileSize = stat.size
//     const range = req.headers.range
//     if (range) {
//         const parts = range.replace(/bytes=/, "").split("-")
//         const start = parseInt(parts[0], 10)
//         const end = parts[1]
//             ? parseInt(parts[1], 10)
//             : fileSize-1
//         const chunksize = (end-start)+1
//         const file = fs.createReadStream(path, {start, end})
//         const head = {
//             'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//             'Accept-Ranges': 'bytes',
//             'Content-Length': chunksize,
//             'Content-Type': 'video/mp4',
//         }
//         res.writeHead(206, head);
//         file.pipe(res);
//     } else {
//         const head = {
//             'Content-Length': fileSize,
//             'Content-Type': 'video/mp4',
//         }
//         res.writeHead(200, head)
//         fs.createReadStream(path).pipe(res)
//     }
// });