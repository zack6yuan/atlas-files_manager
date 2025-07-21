#!/usr/bin/env node
const { DBClient } = require("db")

const app = express()

class UsersController {
    postNew(email, password) {
        if (!email) {
            console.error(err)
            return res.status(400).send('Missing email')
        } else if (!password) {
            return res.status(400).send("Missing password")
        }
    }
}