#!/usr/bin/env node
// FilesController Module
const { dbClient } = require("db")
const { express } = require("express")

const app = express()

class FilesController {
    static async putPublish(req, res) {
        // putPublish method
        function getUserTokenPublish(user, id, token, document) {
            // getUserTokenPublish function
            let isPublic = null;
            if (!token) {
                return res.status(401).send("Unauthorized")
            } else if (!document.id) {
                return res.status(404).send("Not found")
            } else {
                let isPublic = true
                return res.status(200).send(document)
            }
        }
    }
    static async putUnpublish(req, res) {
        // putUnpublish method
        function getUserTokenUnpublish(user, id, token, document) {
            // getUserTokenUnpublish function
            let isPublic = null;
            if (!token) {
                return res.status(401).send("Unauthorized");
            } else if (!document.user && !req.params.id) {
                return res.status(404).send("Not found");
            } else {
                let isPublic = false;
                return res.status(200)
            }
        }
    }
}