#!/usr/bin/node
// Utils Module
import { createClient } from "redis";

class RedisClient {
    constructor() {
        this.client = createClient()
        .on("error", (err) => console.log("Redis Client Error", err))
        .connect();
    }

    isAlive() {
        if (client.isReady) {
            return true
        } else {
            return false
        }
    }

    async get(key) {
        const value = await client.get(key)
        return value
    }

    async set(key, value, duration) {
        await client.set(key, value, duration)
    }

    async del(key) {
        await client.del(key)
    }
}