// Test setup file
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from '../config.js';

// Use in-memory database for testing
config.database.mode = 'memory';

// Create a MongoDB Memory Server instance
let mongoServer;

// Connect to in-memory database before tests
export const setupDatabase = async () => {
  try {
    // Create a new instance of MongoMemoryServer
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Connect to the in-memory database
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to in-memory test database');
  } catch (error) {
    console.error('Error connecting to test database:', error);
    throw error;
  }
};

// Clear database collections between tests
export const clearDatabase = async () => {
  try {
    const collections = mongoose.connection.collections;
    
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    
    console.log('Test database collections cleared');
  } catch (error) {
    console.error('Error clearing test database:', error);
    throw error;
  }
};

// Disconnect from database and stop MongoDB Memory Server after tests
export const closeDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    
    console.log('Disconnected from test database and stopped MongoDB Memory Server');
  } catch (error) {
    console.error('Error disconnecting from test database:', error);
    throw error;
  }
};

// Mock the in-memory database for repository tests
export const mockInMemoryDatabase = () => {
  // Create a mock database object with all required methods
  const mockDb = {
    findCustomers: vi.fn().mockResolvedValue([]),
    findCustomerById: vi.fn().mockResolvedValue(null),
    createCustomer: vi.fn().mockImplementation(data => Promise.resolve({ ...data, id: 'mock-id' })),
    updateCustomer: vi.fn().mockImplementation((id, data) => Promise.resolve({ ...data, id })),
    deleteCustomer: vi.fn().mockResolvedValue(true),
    findCustomerBySpid: vi.fn().mockResolvedValue(null)
  };
  
  // Set up the mock for the database connection
  vi.mock('../database/connection.js', () => {
    return {
      getDatabase: () => mockDb,
      connectToDatabase: vi.fn().mockResolvedValue(true)
    };
  });
  
  return mockDb;
};