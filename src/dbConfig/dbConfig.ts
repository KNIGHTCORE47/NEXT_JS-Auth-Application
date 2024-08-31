import mongoose from 'mongoose';
import { DB_NAME } from '@/constants'

export async function ConnectDB() {
    try {

        if (!process.env.MONGODB_URI) {
            throw new Error('process.env.MONGODB_URI is not defined in environment variables');
        }
        await mongoose.connect(`${process.env.MONGODB_URI!}/${DB_NAME}`)
        const connection = mongoose.connection

        connection.on("connected", () => {
            console.log('Successfully connected to MongoDB');
        })

        connection.on("error", (error) => {
            console.log(`MongoDB connection error, please make sure db is up and running: ${error}`)

            process.exit()
        })

    } catch (error) {
        console.log("Something went wrong in connecting to DB");
        console.log(error);

    }
}