#!/usr/bin/node
// Server module
const express = require('express')
const app = express()
const port = process.env("PORT") || 5000

app.get('/', (req, res) => {
    res.send("Express should be working.")
})