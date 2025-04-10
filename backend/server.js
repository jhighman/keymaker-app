import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './database/connection.js';
import keyRoutes from './routes/keys.js';
import customerRoutes from './routes/customers.js';
import webhookRoutes from './routes/webhook.js';
import { config } from './config.js';

const app = express();
const PORT = config.server.port;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/keys', keyRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/webhook', webhookRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', mode: config.database.mode });
});

// Connect to database and start server
connectToDatabase(config.database.mode)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Database mode: ${config.database.mode}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });