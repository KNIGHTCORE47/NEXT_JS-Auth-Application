import mongoose from 'mongoose';

async function ConnectDB(): Promise<void> {
    try {
        const MongoDB_URI = process.env.MONGODB_URI

        if (!MongoDB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        await mongoose.connect(MongoDB_URI)
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

export {
    ConnectDB
}