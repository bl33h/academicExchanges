import connectDB from './client'; // Adjust the path to your connection file
import User from './models/User'; // Adjust the path to your User model

const isWhitelisted = async (email) => {
    await connectDB(); // Ensure the DB is connected before querying
    try {
        const user = await User.findOne({ email: email }).exec();
        return !!user; // Returns true if the user exists, otherwise false
    } catch (err) {
        console.error('Error checking whitelist:', err);
        throw err; // Rethrow or handle the error as needed
    }
};

export { isWhitelisted };
