#!/usr/bin/node
// Server module
const express = require('express')
const app = express()
const port = process.env("PORT") || 5000
const index = require("index")

app.get('/', (req, res) => {
    res.status(200).send("Express is running");
})