import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const baseUri = process.env.MONGODB_URI;
        if (!baseUri) {
            throw new Error("MONGODB_URI is not set");
        }

        // Check if database name is already in URI (has a path segment before query params)
        const hasDbInUri = /mongodb(\+srv)?:\/\/[^/]+\/[^?]+/.test(baseUri);
        
        let connectionString;
        if (hasDbInUri) {
            connectionString = baseUri;
        } else {
            // Insert database name before query parameters
            const queryIndex = baseUri.indexOf('?');
            if (queryIndex > -1) {
                connectionString = `${baseUri.substring(0, queryIndex)}/${DB_NAME}${baseUri.substring(queryIndex)}`;
            } else {
                connectionString = `${baseUri}/${DB_NAME}`;
            }
        }

        const connectionInstance = await mongoose.connect(connectionString);
        console.log(
            `\n MongoDB connected: ${connectionInstance.connection.host} \n`
        );
    } catch (error) {
        console.log("MongoDB connection error: ", error);
        process.exit(1);
    }
};

export default connectDB;
