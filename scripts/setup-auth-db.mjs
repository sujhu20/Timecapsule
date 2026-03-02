import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function setupAuthDatabase() {
  // Get connection string from environment variables
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('MongoDB URI not found in environment variables');
    process.exit(1);
  }
  
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(uri);
  
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    // Get reference to the database
    const db = client.db();
    
    // Create collections if they don't exist
    console.log('Setting up users collection...');
    
    // Check if users collection exists
    const collections = await db.listCollections({ name: 'users' }).toArray();
    const usersExists = collections.length > 0;
    
    if (!usersExists) {
      await db.createCollection('users');
      console.log('Created users collection');
    } else {
      console.log('Users collection already exists');
    }
    
    // Create indexes
    console.log('Creating indexes...');
    await db.collection('users').createIndexes([
      { key: { email: 1 }, unique: true, name: 'email_unique' },
      { key: { id: 1 }, unique: true, name: 'id_unique' },
      { key: { verificationToken: 1 }, sparse: true, name: 'verification_token' },
      { key: { resetToken: 1 }, sparse: true, name: 'reset_token' }
    ]);
    
    console.log('Indexes created successfully');
    
    // Create a test user if in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('Creating test user for development...');
      
      // Check if test user already exists
      const testUser = await db.collection('users').findOne({ email: 'test@example.com' });
      
      if (!testUser) {
        const now = new Date();
        await db.collection('users').insertOne({
          id: crypto.randomUUID(),
          name: 'Test User',
          email: 'test@example.com',
          // Password is 'password123'
          password: '$2a$10$4OYXFlpQwfEg0/4EbZ8RIuOLYkrKWHOvLvbp1UUFjZHuI3hKRJ.Ty',
          emailVerified: now,
          image: null,
          createdAt: now,
          updatedAt: now,
          providers: {}
        });
        console.log('Test user created');
      } else {
        console.log('Test user already exists');
      }
    }
    
    console.log('Auth database setup completed successfully');
    
  } catch (error) {
    console.error('Error setting up auth database:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the setup
setupAuthDatabase().catch(console.error); 