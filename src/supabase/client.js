import mongoose from 'mongoose';
const mongoDBAtlasUri = 'mongodb+srv://per21371:per21371@intercambios.eg3fuqe.mongodb.net/';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoDBAtlasUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connection successful');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;