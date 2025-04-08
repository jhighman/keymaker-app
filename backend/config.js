import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
  database: {
    mode: process.env.DB_MODE || 'memory', // 'mongodb' or 'memory'
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/keymaker',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    }
  },
  server: {
    port: process.env.PORT || 5000
  }
};