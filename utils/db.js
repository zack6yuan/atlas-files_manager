#!/usr/bin/node
// DB Module
const { MongoClient } = require("MongoDB")

class DBClient {
    constructor() {
    // Creates a client to MongoDB
        this.host =process.env.DB_HOST || "localhost";
        this.port = process.env.DB_PORT || 27017;
        this.database = process.env.DB_DATABASE || files_manager;
    }

    isAlive() {
    // Checks the connection to MongoDB
        if (MongoClient.isConnected()) {
            return true
        } else {
            return false
        }
    }

    async nbUsers(users) {
    // Async function that returns the number of documents in the collection "users"
        document_list = []
        documents = users.find()
        documents.forEach(document => {
            document_list.push(document)
            return document_list
        })
    }

    async nbFiles(files) {
    // Async function that returns the number of documents in the collection "files"
        document_list = []
        documents = files.find()
        documents.forEach(document => {
            document_list.push(document)
            return document_list
        })
    }
}

// Instance of DBClient is exported as dbClient
module.exports = { dbClient: DBClient };