'use strict'
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const path = require('path')
const Max = require('max-api');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'web-app')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'web-app/index.html'))
})

app.post('/', (req, res) => {
    Max.outlet(req.body)
    res.json({ msg: 'success' })
})

app.listen(4000, () => {
    Max.post('Listening on port 4000')
});