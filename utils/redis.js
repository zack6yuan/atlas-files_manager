#!/usr/bin/node
// Utils Module
import { createClient } from "redis";

const client = await createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

function isAlive() {
    if (client.isReady) {
        return true
    } else {
        return false
    }
}

async function get(key) {
    const value = await client.get(key)
    return value
}

async function set(key, value, duration) {
    await client.set(key, value, duration)
}

async function del(key) {
    await client.del(key)
}