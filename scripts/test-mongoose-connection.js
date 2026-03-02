// Script to test MongoDB connection using Mongoose
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;
const apiKey = process.env.MONGODB_API_KEY;
const publicKey = process.env.MONGODB_PUBLIC_KEY;

if (!mongoUri) {
  console.error('Missing MONGODB_URI environment variable');
  process.exit(1);
}

// Process the URI to replace API key placeholder
const processedUri = mongoUri.replace('${MONGODB_API_KEY}', apiKey);

// Log the connection string (with password masked for security)
const maskedUri = processedUri.replace(/\/\/([^:]+):([^@]+)@/, '//\$1:****@');
console.log('Connecting to MongoDB with URI:', maskedUri);
console.log('API Key:', apiKey);
console.log('Public Key:', publicKey);

async function testConnection() {
  try {
    console.log('Attempting MongoDB connection with Mongoose...');
    
    // Configure Mongoose
    mongoose.set('strictQuery', false);
    
    // Connect to MongoDB
    await mongoose.connect(processedUri, {
      bufferCommands: false,
    });
    
    console.log('✅ Successfully connected to MongoDB using Mongoose');
    
    // Check connection status
    console.log(`Connection ready state: ${mongoose.connection.readyState}`);
    console.log(`Database name: ${mongoose.connection.name}`);
    
    // Define a simple schema and model for testing
    const TestSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.models.Test || mongoose.model('Test', TestSchema);
    
    // Try to count documents
    const count = await TestModel.countDocuments();
    console.log(`'Test' collection has ${count} documents`);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nAvailable collections:');
    if (collections.length === 0) {
      console.log('No collections found');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    console.log('\nConnection test completed successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  } finally {
    // Close the connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the test
testConnection()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
  }); 