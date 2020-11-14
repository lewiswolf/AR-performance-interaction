'use strict'
const https = require('https')
const fs = require('fs')
const path = require('path')
const express = require('express');

// Dev or production
// process.env.port is undefined on localhost, some value on heroku :)
let ISDEV = process.env.PORT === undefined;

// Server port
const port = ISDEV ? 4000 : 5000;

// Use express.js to create the server (mainly for routing)
const app = express();

// express uses this directory for all subsequent requests
app.use(express.static(__dirname));

// Lay down standard route
app.get('/', (req, res) => {
    // Be nice and greet
    console.log("hello");

    // Allow streaming content of any kind
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, X-Api-Key');

    // Send the index.html file as response
    // res.writeHead(200, { 'content-type': 'text/html' });
    res.sendFile(__dirname + '/index.html');
})

if(ISDEV){
    console.log("local");

    // Local private key and certificate for hosting over HTTPS locally
    const privateKey = fs.readFileSync('key.pem', 'utf8');
    const certificate = fs.readFileSync('cert.pem', 'utf8');

    // Create credentials object
    const credentials = { key: privateKey, cert: certificate };

    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(port);
}
 else {
     console.log("onlineee");
     // Heroku assigns ports automagically
     app.listen(process.env.PORT || port);
}

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