#!/usr/bin/node
// Utils Module
import { createClient } from "redis";

class RedisClient {
    constructor() {
    // Creates a redis client
        this.client = createClient()
        .on("error", (err) => console.log("Redis Client Error", err))
        .connect();
    }

    isAlive() {
    // Checks if client was created and ready
        if (this.client.isReady) {
            return true
        } else {
            return false
        }
    }

    async get(key) {
    // Returns the redis value stored for a key
        const value = await this.client.get(key)
        return value
    }

    async set(key, value, duration) {
    // Stores values in redis
    // Duration NEEDS WORK
        await this.client.set(key, value, duration)
    }

    async del(key) {
    // Removes a value in redis for a key
        await this.client.del(key)
    }
}