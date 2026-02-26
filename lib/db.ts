import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in your .env.local file.");
}

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

if (!global.mongooseCache) {
    global.mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
    if (global.mongooseCache.conn) {
        return global.mongooseCache.conn;
    }

    if (!global.mongooseCache.promise) {
        global.mongooseCache.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });
    }

    global.mongooseCache.conn = await global.mongooseCache.promise;
    return global.mongooseCache.conn;
}
