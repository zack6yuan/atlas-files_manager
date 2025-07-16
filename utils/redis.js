#!/usr/bin/node
// Utils Module
import { createClient } from "redis";

const client = await createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

await client.set("key", "value");
const value = await client.get("key");
client.destroy();