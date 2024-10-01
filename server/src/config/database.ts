import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(String(process.env.DATABASE_URI));
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected successfully!');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
}

export { connectDB, disconnectDB };
