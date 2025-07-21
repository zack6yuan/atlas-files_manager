#!/usr/bin/env node
const { dbClient } = require("db")
const { express } = require("express")

const app = express()

class UsersController {
    async postNew(email, password) {
        // Check if email is missing
        if (!email) {
            return res.status(400).send('Missing email')
        }
        // Check if password is missing
        if (!password) {
            return res.status(400).send("Missing password")
        }
        // Check if the email is already in the database
        const emailCheck = await this.dbClient.has(email);
        if (emailCheck) {
            return res.status(400).send("Already exist")
        }
        // Password needs to be stored after being hashed in SHA1
        // Endpoint returns the new user with only the email and the id with status code 201
        // New user must be saved in the collection users
    }
}

module.exports = UsersController;