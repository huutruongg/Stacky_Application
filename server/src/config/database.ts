import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(String(process.env.DATABASE_URI));
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
