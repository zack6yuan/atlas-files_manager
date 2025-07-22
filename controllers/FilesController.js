#!/usr/bin/env node
// FilesController Module
const { dbClient } = require("db");
const { express } = require("express");
const { mime } = require("mime-types");

const app = express();

class FilesController {
    static async putPublish(req, res) {
        // putPublish method
        function getUserTokenPublish(user, id, token, document) {
            // getUserTokenPublish function
            let isPublic = null;
            if (!token) {
                return res.status(401).send("Unauthorized");
            } else if (!document.id) {
                return res.status(404).send("Not found");
            } else {
                let isPublic = true;
                return res.status(200).send(document);
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
                return res.status(200).send(document);
            }
        }
    }
    static async getFIle(req, res) {
        // getFile method
        function getFileContent(user, id, document) {
            // getFileContent function
            let passedID = req.params.id;
            if (!document.passedID) {
                return res.status(404).send("Not found");
            } else if (isPublic == false && (!document.user)) {
                return res.status(404).send("Not found");
            } else if (typeof(document) == 'folder') {
                return res.status(400).send("A folder doesn't have content");
            } else if (!document) {
                return res.status(404).send("Not found");
            } else {
                // By using the module mime-types (it is imported)
                // get the MIME-type based on the name of the file
                // Return the content of the file with the correct MIME-type
            }
        }
    }
}

module.exports = FilesController;