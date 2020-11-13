'use strict'
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs');
const https = require('https')
const Max = require('max-api')

// Server port
const port = 4000;

// Local private key and certificate for hosting over HTTPS locally
const privateKey = fs.readFileSync(path.join(__dirname, 'web-app/key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'web-app/cert.pem'), 'utf8');

// Create credentials object
const credentials = { key: privateKey, cert: certificate };

// Use express.js to create the server (mainly for routing)
const app = express();
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, Max ? Max.post(`listening on port ${port}`) : console.log((`listening on port ${port}`)));

// Lay down standard route
app.get('/', (req, res) => {
    // Allow streaming content of any kind
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Send the index.html file as response
    res.writeHead(200, { 'content-type': 'text/html' });
    fs.createReadStream(path.join(__dirname, 'web-app/index.html')).pipe(res);
})

// express targets this directory
app.use(express.static(path.join(__dirname, 'web-app')))

// parse json post messages
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*
    ASSIGN USERS IDS
    this should be moved to the real server, but I can't test both at once still...
*/

const generateIdArr = (len) => {
    let arr = []
    for (let i = 0; i < len; i++) {
        arr.push(i + 1)
    }
    return arr
}

const numOfUniqueUsers = 30
let idArr = generateIdArr(numOfUniqueUsers)

app.get('/user-id', (req, res) => {
    // retrieve a random id from the array
    if (idArr) {
        let rand = Math.round(Math.random() * (idArr.length - 1))
        res.json({ id: idArr[rand] })
        Max.post(`id ${idArr[rand]} is now in use`)

        // remove id from the array
        idArr.splice(rand, 1)
        Max.post(`${idArr.length} devices connected`)
    } else {
        res.json({ id: 0 })
    }
})

app.post('/user-id', (req, res) => {
    idArr.push(req.body.userID)
    res.json({ msg: 'success' })
    Max.post(`id ${req.body.userID} disconnected`)
})

/*
    END
*/

app.post('/', (req, res) => {
    Max.outlet(req.body)
    res.json({ msg: 'success' })
})

