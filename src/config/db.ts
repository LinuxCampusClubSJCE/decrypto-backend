import { MongoError } from 'mongodb'
import mongoose from 'mongoose'
import envVariables from './config.js'

const connectDB = async (): Promise<void> => {
    try {
        console.log('Trying to connect to Mongodb')
        await mongoose.connect(envVariables.MONGODB_URI)
        console.log('MongoDB connected')
    } catch (error: unknown) {
        if (error instanceof MongoError) {
            console.error('Error connecting to MongoDB:', error.message)
        }
        process.exit(1)
    }
}

export default connectDB
