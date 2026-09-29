import mongoose from "mongoose";
import { env } from "./env.server";

export function connectDb() {
    if (global.mongooseConnectionPromise) {
        return global.mongooseConnectionPromise;
    }

    global.mongooseConnectionPromise = mongoose.connect(env.MONGODB_URI, {
        dbName: env.MONGODB_DB_NAME,
    }).catch((error) => {
        delete global.mongooseConnectionPromise;
        throw error;
    });

    return global.mongooseConnectionPromise;
}
