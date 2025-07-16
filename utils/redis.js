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
        if (this.client.isReady) {
            return true
        } else {
            return false
        }
    }

    async get(key) {
        const value = await this.client.get(key)
        return value
    }

    async set(key, value, duration) {
        await this.client.set(key, value, duration)
    }

    async del(key) {
        await this.client.del(key)
    }
}