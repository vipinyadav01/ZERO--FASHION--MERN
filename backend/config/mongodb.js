import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Check if MONGODB_URI is available
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI is not defined in environment variables');
            throw new Error('MONGODB_URI is not defined');
        }

        // Connection event handlers
        mongoose.connection.on('connected', () => {
            console.log('Connected to MongoDB successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        // Connect to MongoDB with options
        await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, 
            socketTimeoutMS: 45000, 
        });

        console.log('MongoDB connection established');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        // Don't throw error in production, let the app continue
        if (process.env.NODE_ENV === 'development') {
            throw error;
        }
    }
};

export default connectDB;