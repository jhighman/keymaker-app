import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { Customer } from '../models/Customer.js';
import { setupDatabase, clearDatabase, closeDatabase } from './setup.js';

describe('Customer Model', () => {
  // Connect to database before tests
  beforeAll(async () => {
    await setupDatabase();
  });

  // Clear database after each test
  afterEach(async () => {
    await clearDatabase();
  });

  // Disconnect from database after tests
  afterAll(async () => {
    await closeDatabase();
  });

  it('should create a customer with required fields', async () => {
    const customerData = {
      name: 'Test Customer',
      link: 'https://example.com/collect?key=test',
      endpoint: 'test-endpoint'
    };

    const customer = new Customer(customerData);
    const savedCustomer = await customer.save();

    expect(savedCustomer._id).toBeDefined();
    expect(savedCustomer.name).toBe(customerData.name);
    expect(savedCustomer.link).toBe(customerData.link);
    expect(savedCustomer.endpoint).toBe(customerData.endpoint);
    expect(savedCustomer.individuals).toEqual([]);
    expect(savedCustomer.createdAt).toBeDefined();
    expect(savedCustomer.updatedAt).toBeDefined();
  });

  it('should create a customer with communication settings', async () => {
    const customerData = {
      name: 'Test Customer',
      link: 'https://example.com/collect?key=test',
      endpoint: 'test-endpoint',
      communicationSettings: {
        emailTemplate: 'default',
        smsTemplate: 'default',
        reminderFrequency: 5,
        maxReminders: 3,
        expirationPeriod: 14
      }
    };

    const customer = new Customer(customerData);
    const savedCustomer = await customer.save();

    expect(savedCustomer.communicationSettings).toBeDefined();
    expect(savedCustomer.communicationSettings.emailTemplate).toBe('default');
    expect(savedCustomer.communicationSettings.reminderFrequency).toBe(5);
    expect(savedCustomer.communicationSettings.maxReminders).toBe(3);
    expect(savedCustomer.communicationSettings.expirationPeriod).toBe(14);
  });

  it('should create a customer with webhook settings', async () => {
    const customerData = {
      name: 'Test Customer',
      link: 'https://example.com/collect?key=test',
      endpoint: 'test-endpoint',
      webhookSettings: {
        url: 'https://example.com/webhook',
        secret: 'test-secret',
        events: ['status_update', 'collection_complete']
      }
    };

    const customer = new Customer(customerData);
    const savedCustomer = await customer.save();

    expect(savedCustomer.webhookSettings).toBeDefined();
    expect(savedCustomer.webhookSettings.url).toBe('https://example.com/webhook');
    expect(savedCustomer.webhookSettings.secret).toBe('test-secret');
    expect(savedCustomer.webhookSettings.events).toEqual(['status_update', 'collection_complete']);
  });

  it('should add an individual to a customer', async () => {
    const customerData = {
      name: 'Test Customer',
      link: 'https://example.com/collect?key=test',
      endpoint: 'test-endpoint'
    };

    const customer = new Customer(customerData);
    const savedCustomer = await customer.save();

    const individualData = {
      id: 'test-individual',
      status: 'pending',
      contactInfo: {
        email: 'test@example.com',
        phone: '123-456-7890',
        preferredChannel: 'email'
      }
    };

    savedCustomer.individuals.push(individualData);
    const updatedCustomer = await savedCustomer.save();

    expect(updatedCustomer.individuals).toHaveLength(1);
    expect(updatedCustomer.individuals[0].id).toBe('test-individual');
    expect(updatedCustomer.individuals[0].status).toBe('pending');
    expect(updatedCustomer.individuals[0].contactInfo.email).toBe('test@example.com');
    expect(updatedCustomer.individuals[0].contactInfo.preferredChannel).toBe('email');
  });

  it('should add communications to an individual', async () => {
    // Create customer with individual
    const customer = new Customer({
      name: 'Test Customer',
      link: 'https://example.com/collect?key=test',
      endpoint: 'test-endpoint',
      individuals: [{
        id: 'test-individual',
        status: 'pending',
        contactInfo: {
          email: 'test@example.com',
          preferredChannel: 'email'
        }
      }]
    });
    
    const savedCustomer = await customer.save();
    
    // Add communication
    const individual = savedCustomer.individuals[0];
    individual.communications = [{
      channel: 'email',
      status: 'sent',
      messageId: 'msg_123',
      timestamp: new Date()
    }];
    
    const updatedCustomer = await savedCustomer.save();
    
    expect(updatedCustomer.individuals[0].communications).toHaveLength(1);
    expect(updatedCustomer.individuals[0].communications[0].channel).toBe('email');
    expect(updatedCustomer.individuals[0].communications[0].status).toBe('sent');
    expect(updatedCustomer.individuals[0].communications[0].messageId).toBe('msg_123');
  });

  it('should add scheduled actions to an individual', async () => {
    // Create customer with individual
    const customer = new Customer({
      name: 'Test Customer',
      link: 'https://example.com/collect?key=test',
      endpoint: 'test-endpoint',
      individuals: [{
        id: 'test-individual',
        status: 'pending',
        contactInfo: {
          email: 'test@example.com',
          preferredChannel: 'email'
        }
      }]
    });
    
    const savedCustomer = await customer.save();
    
    // Add scheduled action
    const individual = savedCustomer.individuals[0];
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 1); // Tomorrow
    
    individual.scheduledActions = [{
      type: 'reminder',
      scheduledFor: scheduledDate,
      executed: false
    }];
    
    const updatedCustomer = await savedCustomer.save();
    
    expect(updatedCustomer.individuals[0].scheduledActions).toHaveLength(1);
    expect(updatedCustomer.individuals[0].scheduledActions[0].type).toBe('reminder');
    expect(updatedCustomer.individuals[0].scheduledActions[0].executed).toBe(false);
    expect(updatedCustomer.individuals[0].scheduledActions[0].scheduledFor).toEqual(scheduledDate);
  });

  it('should update individual status', async () => {
    // Create customer with individual
    const customer = new Customer({
      name: 'Test Customer',
      link: 'https://example.com/collect?key=test',
      endpoint: 'test-endpoint',
      individuals: [{
        id: 'test-individual',
        status: 'pending',
        contactInfo: {
          email: 'test@example.com',
          preferredChannel: 'email'
        }
      }]
    });
    
    const savedCustomer = await customer.save();
    
    // Update status
    const individual = savedCustomer.individuals[0];
    individual.status = 'invited';
    
    const updatedCustomer = await savedCustomer.save();
    
    expect(updatedCustomer.individuals[0].status).toBe('invited');
  });

  it('should track collection progress', async () => {
    // Create customer with individual
    const customer = new Customer({
      name: 'Test Customer',
      link: 'https://example.com/collect?key=test',
      endpoint: 'test-endpoint',
      individuals: [{
        id: 'test-individual',
        status: 'in_progress',
        contactInfo: {
          email: 'test@example.com',
          preferredChannel: 'email'
        }
      }]
    });
    
    const savedCustomer = await customer.save();
    
    // Add collection progress
    const individual = savedCustomer.individuals[0];
    individual.collectionProgress = {
      startedAt: new Date(),
      lastActivityAt: new Date(),
      currentStep: 'identity_verification',
      completedSteps: ['consent', 'personal_info'],
      totalSteps: 5,
      percentComplete: 40
    };
    
    const updatedCustomer = await savedCustomer.save();
    
    expect(updatedCustomer.individuals[0].collectionProgress).toBeDefined();
    expect(updatedCustomer.individuals[0].collectionProgress.currentStep).toBe('identity_verification');
    expect(updatedCustomer.individuals[0].collectionProgress.completedSteps).toEqual(['consent', 'personal_info']);
    expect(updatedCustomer.individuals[0].collectionProgress.totalSteps).toBe(5);
    expect(updatedCustomer.individuals[0].collectionProgress.percentComplete).toBe(40);
  });
});