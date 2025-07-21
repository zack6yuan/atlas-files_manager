// utils/db.js
const { MongoClient } = require('mongodb');

class DBClient {
<<<<<<< HEAD
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
=======
    constructor() {
    // Creates a client to MongoDB
        this.host =process.env.DB_HOST || "localhost";
        this.port = process.env.DB_PORT || 27017;
        this.database = process.env.DB_DATABASE || files_manager;
    }
>>>>>>> origin/main

    const url = `mongodb://${host}:${port}`;
    this.client = new MongoClient(url, { useUnifiedTopology: true });

    this.client.connect()
      .then(() => {
        this.db = this.client.db(database);
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        this.db = null;
      });
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    if (!this.db) return 0;
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    if (!this.db) return 0;
    return this.db.collection('files').countDocuments();
  }
}

<<<<<<< HEAD
const dbClient = new DBClient();
module.exports = dbClient;
=======
// Instance of DBClient is exported as dbClient
module.exports = { dbClient: DBClient };
>>>>>>> origin/main
