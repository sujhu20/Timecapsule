// Script to migrate data from Supabase to MongoDB
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { MongoClient } = require('mongodb');

// Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;
const apiKey = process.env.MONGODB_API_KEY;

if (!mongoUri) {
  console.error('Missing MONGODB_URI environment variable');
  process.exit(1);
}

// Process the URI to replace the API key placeholder
const processedUri = mongoUri.replace('${MONGODB_API_KEY}', apiKey);

// Create MongoDB client
const mongoClient = new MongoClient(processedUri, {
  retryWrites: true,
  retryReads: true
});

async function migrateCapsules() {
  try {
    // Connect to MongoDB
    await mongoClient.connect();
    console.log('Connected to MongoDB');
    const db = mongoClient.db('timecapsul');
    const capsulesCollection = db.collection('capsules');

    // Check if collection already has data
    const existingCount = await capsulesCollection.countDocuments();
    if (existingCount > 0) {
      console.log(`MongoDB already has ${existingCount} capsules. Do you want to proceed and potentially create duplicates? (y/n)`);
      const answer = await waitForInput();
      if (answer.toLowerCase() !== 'y') {
        console.log('Migration aborted');
        return;
      }
    }

    // Fetch all capsules from Supabase
    console.log('Fetching capsules from Supabase...');
    const { data: capsules, error } = await supabase
      .from('capsules')
      .select('*');

    if (error) {
      console.error('Error fetching capsules from Supabase:', error);
      return;
    }

    if (!capsules || capsules.length === 0) {
      console.log('No capsules found in Supabase');
      return;
    }

    console.log(`Found ${capsules.length} capsules in Supabase`);

    // Transform Supabase data for MongoDB
    const mongoFormatCapsules = capsules.map(capsule => {
      // Convert Supabase fields to MongoDB format
      const mongoCapsule = {
        title: capsule.title,
        description: capsule.description || null,
        content: capsule.content,
        media_url: capsule.media_url || null,
        type: capsule.type,
        privacy: capsule.privacy,
        user_id: capsule.user_id,
        created_at: capsule.created_at,
        updated_at: capsule.updated_at || capsule.created_at,
      };

      // Handle field renames or transformations
      if (capsule.scheduled_for) {
        mongoCapsule.scheduled_date = capsule.scheduled_for;
      }

      if (capsule.status === 'opened') {
        mongoCapsule.opened_at = capsule.updated_at || capsule.created_at;
      }

      return mongoCapsule;
    });

    // Insert into MongoDB
    console.log('Inserting capsules into MongoDB...');
    const result = await capsulesCollection.insertMany(mongoFormatCapsules);

    console.log(`Successfully migrated ${result.insertedCount} capsules to MongoDB`);
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    // Close connections
    await mongoClient.close();
    console.log('MongoDB connection closed');
  }
}

// Utility function to get user input
function waitForInput() {
  return new Promise((resolve) => {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', (data) => {
      resolve(data.trim());
      process.stdin.pause();
    });
  });
}

// Run the migration
migrateCapsules()
  .then(() => {
    console.log('Migration process completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('Unhandled error during migration:', err);
    process.exit(1);
  }); 