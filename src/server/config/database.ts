import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow';
    await mongoose.connect(uri);
    console.log('✓ MongoDB connected');
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;