'use strict'
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const path = require('path')
const Max = require('max-api');
const fs = require('fs');
const https = require('https')

app.use((req, res, next) => {
    // res.header('Access-Control-Allow-Headers', 'Content-Type')
    // Allow streaming content of any kind
    // Website you wish to allow to connect
    res.header('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.header('Access-Control-Allow-Credentials', true);
    next()
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'web-app')))

app.get('*', (req, res) => {
    // res.sendFile(path.join(__dirname, 'web-app/index.html'))

    // Send the index.html file as response
    res.writeHead(200, { 'content-type': 'text/html' });
    fs.createReadStream(path.join(__dirname, 'web-app/index.html')).pipe(res);
})

app.post('/', (req, res) => {
    Max.outlet(req.body)
    res.json({ msg: 'success' })
})

// Local private key and certificate for hosting over HTTPS locally
const privateKey = fs.readFileSync('web-app/key.pem', 'utf8');
const certificate = fs.readFileSync('web-app/cert.pem', 'utf8');

// Create credentials object
const credentials = { key: privateKey, cert: certificate };

// Use express.js to create the server (mainly for routing)
const httpsServer = https.createServer(credentials, app);

// express targets this directory
app.use(express.static(__dirname))

// Server port
const port = 4000;
httpsServer.listen(port, () => {
    Max.post("weee")
});


// app.listen(4000, () => {
//     Max.post('Listening on port 4000')
// });