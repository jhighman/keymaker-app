import mongoose from 'mongoose';
import { setupInMemoryDB } from './in-memory.js';
import { config } from '../config.js';

// In-memory database instance
let inMemoryDB = null;

export async function connectToDatabase(mode = 'memory') {
  if (mode === 'mongodb') {
    try {
      await mongoose.connect(config.database.mongodb.uri, config.database.mongodb.options);
      console.log('Connected to MongoDB');
      return mongoose.connection;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  } else {
    // In-memory database
    inMemoryDB = setupInMemoryDB();
    console.log('Using in-memory database');
    return inMemoryDB;
  }
}

export function getDatabase() {
  if (config.database.mode === 'mongodb') {
    return mongoose.connection;
  }
  return inMemoryDB;
}