import mongoose from 'mongoose';

let connected = false;

const connectDB = async (): Promise<void> => {
    mongoose.set('strictQuery', true);

    if (connected) {
        console.log('MongoDB is already connected');
        return;
    }

    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error('MONGODB_URI is not defined in environment variables');
    }

    try {
        await mongoose.connect(mongoUri);
        connected = true;
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error; 
    }
};

export default connectDB;
