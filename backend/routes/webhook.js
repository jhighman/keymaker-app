import express from 'express';
import crypto from 'crypto';
import { customerRepository } from '../repositories/customerRepository.js';

const router = express.Router();

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
router.post('/collect', async (req, res) => {
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
    
    // Handle status transitions
    const individual = customer.individuals.find(ind => ind.id === individualId);
    if (individual) {
      // If status changed to 'started', schedule a follow-up
      if (status === 'started') {
        const followUpDate = new Date();
        followUpDate.setHours(followUpDate.getHours() + 24); // 24 hours later
        
        await customerRepository.addScheduledAction(
          customerId,
          individualId,
          {
            type: 'follow_up',
            scheduledFor: followUpDate
          }
        );
      }
      
      // If status changed to 'in_progress', schedule a reminder
      if (status === 'in_progress') {
        const reminderDate = new Date();
        reminderDate.setHours(reminderDate.getHours() + 48); // 48 hours later
        
        await customerRepository.addScheduledAction(
          customerId,
          individualId,
          {
            type: 'reminder',
            scheduledFor: reminderDate
          }
        );
      }
      
      // If status changed to 'completed', no further action needed
      if (status === 'completed') {
        console.log(`Individual ${individualId} completed the collection process`);
      }
    }
    
    res.status(200).json({ received: true, timestamp: new Date() });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint for completion notification
router.post('/collect/complete', async (req, res) => {
  try {
    const { customerId, individualId, collectionData } = req.body;
    
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
    
    // Update individual status to completed
    const customer = await customerRepository.updateIndividualFromWebhook(
      customerId,
      individualId,
      'completed',
      {
        completedAt: new Date(),
        ...collectionData
      }
    );
    
    if (!customer) return res.status(404).json({ error: 'Customer or individual not found' });
    
    res.status(200).json({
      received: true,
      timestamp: new Date(),
      nextSteps: {
        backgroundCheckInitiated: true,
        estimatedCompletionTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days later
      }
    });
  } catch (error) {
    console.error('Webhook completion error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;