import mongoose from 'mongoose';

const connectMongoDB = async () => {
    const mongoURI = process.env.MONGODB_URI; // Ambil URL dari environment variable
    if (!mongoURI) {
        throw new Error("DATABASE_MONGO_URL is not defined");
    }

    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected');
        
        mongoose.set('debug', true); // aktifkan log query mongo
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

export default connectMongoDB;
