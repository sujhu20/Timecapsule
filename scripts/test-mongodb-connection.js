// Script to test MongoDB connection
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

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

// Create MongoDB client with API key auth
const mongoClient = new MongoClient(processedUri, {
  retryWrites: true,
  retryReads: true,
});

async function testConnection() {
  try {
    console.log('Attempting MongoDB connection...');
    console.log('API Key:', apiKey);
    console.log('Public Key:', publicKey);
    
    await mongoClient.connect();
    console.log('✅ Successfully connected to MongoDB');
    
    // List databases to verify connection works
    const adminDb = mongoClient.db('admin');
    const dbs = await adminDb.admin().listDatabases();
    console.log('Available databases:');
    dbs.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });
    
    // Test accessing the intended database
    const db = mongoClient.db('timecapsul');
    const collections = await db.listCollections().toArray();
    console.log('\nTimecapsul collections:');
    if (collections.length === 0) {
      console.log('No collections found. This may be a new database.');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    console.log('\nConnection test completed successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  } finally {
    await mongoClient.close();
    console.log('MongoDB connection closed');
  }
}

// Run the test
testConnection()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error('Unhandled error during test:', err);
    process.exit(1);
  }); 