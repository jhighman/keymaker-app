import express from 'express';
import crypto from 'crypto';
import { customerRepository } from '../repositories/customerRepository.js';

const router = express.Router();

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await customerRepository.findAll();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await customerRepository.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create customer
router.post('/', async (req, res) => {
  try {
    const customer = await customerRepository.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const customer = await customerRepository.update(req.params.id, req.body);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const customer = await customerRepository.delete(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add individual to customer
router.post('/:id/individuals', async (req, res) => {
  try {
    const customer = await customerRepository.addIndividual(req.params.id, req.body);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove individual from customer
router.delete('/:id/individuals/:individualId', async (req, res) => {
  try {
    const customer = await customerRepository.removeIndividual(req.params.id, req.params.individualId);
    if (!customer) return res.status(404).json({ message: 'Customer or individual not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update individual status
router.patch('/:id/individuals/:individualId/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });
    
    const customer = await customerRepository.updateIndividualStatus(
      req.params.id, 
      req.params.individualId, 
      status
    );
    
    if (!customer) return res.status(404).json({ message: 'Customer or individual not found' });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update individual contact information
router.patch('/:id/individuals/:individualId/contact', async (req, res) => {
  try {
    const customer = await customerRepository.updateContactInfo(
      req.params.id,
      req.params.individualId,
      req.body
    );
    
    if (!customer) return res.status(404).json({ message: 'Customer or individual not found' });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add communication record for an individual
router.post('/:id/individuals/:individualId/communications', async (req, res) => {
  try {
    const communicationData = {
      channel: req.body.channel,
      status: req.body.status || 'sent',
      messageId: req.body.messageId || crypto.randomUUID(),
      ...req.body
    };
    
    const customer = await customerRepository.addCommunication(
      req.params.id,
      req.params.individualId,
      communicationData
    );
    
    if (!customer) return res.status(404).json({ message: 'Customer or individual not found' });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update communication status
router.patch('/:id/individuals/:individualId/communications/:messageId', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });
    
    const customer = await customerRepository.updateCommunicationStatus(
      req.params.id,
      req.params.individualId,
      req.params.messageId,
      status
    );
    
    if (!customer) return res.status(404).json({ message: 'Customer, individual, or communication not found' });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add scheduled action for an individual
router.post('/:id/individuals/:individualId/actions', async (req, res) => {
  try {
    const actionData = {
      type: req.body.type,
      scheduledFor: new Date(req.body.scheduledFor),
      executed: false,
      ...req.body
    };
    
    const customer = await customerRepository.addScheduledAction(
      req.params.id,
      req.params.individualId,
      actionData
    );
    
    if (!customer) return res.status(404).json({ message: 'Customer or individual not found' });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update scheduled action
router.patch('/:id/individuals/:individualId/actions/:actionIndex', async (req, res) => {
  try {
    const actionIndex = parseInt(req.params.actionIndex);
    if (isNaN(actionIndex)) return res.status(400).json({ message: 'Invalid action index' });
    
    const customer = await customerRepository.updateScheduledAction(
      req.params.id,
      req.params.individualId,
      actionIndex,
      req.body
    );
    
    if (!customer) return res.status(404).json({ message: 'Customer, individual, or action not found' });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update customer communication settings
router.patch('/:id/communication-settings', async (req, res) => {
  try {
    const customer = await customerRepository.updateCommunicationSettings(
      req.params.id,
      req.body
    );
    
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update customer webhook settings
router.patch('/:id/webhook-settings', async (req, res) => {
  try {
    const customer = await customerRepository.updateWebhookSettings(
      req.params.id,
      req.body
    );
    
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Verify webhook signature
const verifyWebhookSignature = (payload, signature, secret) => {
  try {
    // Extract timestamp and signature value
    const [timestamp, signatureValue] = signature.split(',');
    const timestampValue = timestamp.split('=')[1];
    const hashValue = signatureValue.split('=')[1];
    
    // Create expected signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${timestampValue}.${JSON.stringify(payload)}`)
      .digest('hex');
    
    // Compare signatures
    return crypto.timingSafeEqual(
      Buffer.from(hashValue, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
};

// Webhook endpoint for Trua Collect
router.post('/webhook/collect', async (req, res) => {
  try {
    const { customerId, individualId, status, progress } = req.body;
    
    if (!customerId || !individualId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Verify webhook signature if provided
    const signature = req.headers['x-webhook-signature'];
    if (signature) {
      const customer = await customerRepository.findById(customerId);
      if (!customer) return res.status(404).json({ error: 'Customer not found' });
      
      const secret = customer.webhookSettings?.secret;
      if (secret && !verifyWebhookSignature(req.body, signature, secret)) {
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }
    }
    
    // Update individual status and progress
    const customer = await customerRepository.updateIndividualFromWebhook(
      customerId,
      individualId,
      status,
      progress
    );
    
    if (!customer) return res.status(404).json({ error: 'Customer or individual not found' });
    
    res.status(200).json({ received: true, timestamp: new Date() });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get due scheduled actions
router.get('/actions/due', async (req, res) => {
  try {
    const dueActions = await customerRepository.getDueScheduledActions();
    res.json(dueActions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;