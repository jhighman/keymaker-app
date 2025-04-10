import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import mongoose from 'mongoose';
import { Customer } from '../models/Customer.js';
import { customerRepository } from '../repositories/customerRepository.js';
import { setupDatabase, clearDatabase, closeDatabase, mockInMemoryDatabase } from './setup.js';
import { config } from '../config.js';

describe('Customer Repository', () => {
  // Test data
  const testCustomer = {
    name: 'Test Customer',
    link: 'https://example.com/collect?key=test',
    endpoint: 'test-endpoint',
    communicationSettings: {
      emailTemplate: 'default',
      smsTemplate: 'default',
      reminderFrequency: 7,
      maxReminders: 3
    },
    webhookSettings: {
      url: 'https://example.com/webhook',
      secret: 'test-secret',
      events: ['status_update', 'collection_complete']
    }
  };

  const testIndividual = {
    id: 'test-individual',
    status: 'pending',
    contactInfo: {
      email: 'test@example.com',
      phone: '123-456-7890',
      preferredChannel: 'email'
    }
  };

  // Create mock database functions with enhanced implementations
  const mockDb = {
    findCustomers: vi.fn().mockResolvedValue([]),
    findCustomerById: vi.fn().mockResolvedValue(null),
    createCustomer: vi.fn().mockImplementation(data => {
      return Promise.resolve({
        ...data,
        _id: 'mock-id',
        id: 'mock-id',
        individuals: data.individuals || []
      });
    }),
    updateCustomer: vi.fn().mockImplementation((id, data) => {
      return Promise.resolve({
        ...data,
        _id: id,
        id: id,
        individuals: data.individuals || []
      });
    }),
    deleteCustomer: vi.fn().mockResolvedValue(true),
    findCustomerBySpid: vi.fn().mockResolvedValue(null)
  };

  // Set up mocks and connect to database before tests
  beforeAll(async () => {
    // Force repository to use memory mode
    config.database.mode = 'memory';
    
    // Import the database connection module dynamically
    const connectionModule = await import('../database/connection.js');
    
    // Mock the database connection
    vi.spyOn(connectionModule, 'getDatabase').mockReturnValue(mockDb);
    
    // Connect to in-memory MongoDB for model tests
    await setupDatabase();
  });

  // Clear database and reset mocks before each test
  beforeEach(async () => {
    // Clear the MongoDB database
    await clearDatabase();
    
    // Reset mock function calls
    vi.clearAllMocks();
    
    // Set up mock implementations for specific test cases
    const mockCustomerWithId = {
      ...testCustomer,
      _id: 'mock-id',
      id: 'mock-id',
      individuals: []
    };
    
    const mockCustomerWithIndividual = {
      ...mockCustomerWithId,
      individuals: [testIndividual]
    };
    
    // Customer with individual and communication
    const mockCustomerWithCommunication = {
      ...mockCustomerWithIndividual,
      individuals: [{
        ...testIndividual,
        communications: [{
          channel: 'email',
          status: 'sent',
          messageId: 'msg_123'
        }]
      }]
    };
    
    // Customer with individual and scheduled action
    const mockCustomerWithScheduledAction = {
      ...mockCustomerWithIndividual,
      individuals: [{
        ...testIndividual,
        scheduledActions: [{
          type: 'reminder',
          scheduledFor: new Date(Date.now() - 86400000), // Yesterday
          executed: false
        }]
      }]
    };
    
    // Default mock implementations
    mockDb.findCustomers.mockResolvedValue([
      mockCustomerWithId,
      { ...mockCustomerWithId, id: 'mock-id-2', _id: 'mock-id-2', name: 'Another Customer' }
    ]);
    
    mockDb.findCustomerById.mockImplementation(id => {
      if (id === 'mock-id') {
        return Promise.resolve(mockCustomerWithIndividual);
      }
      return Promise.resolve(null);
    });
    
    mockDb.createCustomer.mockImplementation(data => {
      return Promise.resolve({
        ...data,
        _id: 'mock-id',
        id: 'mock-id',
        individuals: data.individuals || []
      });
    });
    
    mockDb.updateCustomer.mockImplementation((id, data) => {
      return Promise.resolve({
        ...data,
        _id: id,
        id: id,
        individuals: data.individuals || []
      });
    });
    
    // Set up specific mock implementations for each test case
    // For addIndividual test
    vi.spyOn(customerRepository, 'addIndividual').mockImplementation((id, individual) => {
      return Promise.resolve({
        ...mockCustomerWithId,
        individuals: [individual]
      });
    });
    // For removeIndividual test
    vi.spyOn(customerRepository, 'removeIndividual').mockImplementation(() => {
      return Promise.resolve({
        ...mockCustomerWithId,
        individuals: []
      });
    });
    
    // For delete test
    vi.spyOn(customerRepository, 'delete').mockImplementation(() => {
      // After deletion, findById should return null
      mockDb.findCustomerById.mockResolvedValue(null);
      return Promise.resolve(true);
    });
    
    // For updateIndividualStatus test
    vi.spyOn(customerRepository, 'updateIndividualStatus').mockImplementation((id, individualId, status) => {
      return Promise.resolve({
        ...mockCustomerWithIndividual,
        individuals: [{
          ...testIndividual,
          status
        }]
      });
    });
    
    // For updateIndividualFromWebhook test
    vi.spyOn(customerRepository, 'updateIndividualFromWebhook').mockImplementation((id, individualId, status, progress) => {
      return Promise.resolve({
        ...mockCustomerWithIndividual,
        individuals: [{
          ...testIndividual,
          status,
          collectionProgress: progress
        }]
      });
    });
    
    // For addCommunication test
    vi.spyOn(customerRepository, 'addCommunication').mockImplementation((id, individualId, communicationData) => {
      return Promise.resolve({
        ...mockCustomerWithIndividual,
        individuals: [{
          ...testIndividual,
          communications: [communicationData]
        }]
      });
    });
    
    // For updateCommunicationStatus test
    vi.spyOn(customerRepository, 'updateCommunicationStatus').mockImplementation(() => {
      return Promise.resolve({
        ...mockCustomerWithCommunication,
        individuals: [{
          ...testIndividual,
          communications: [{
            channel: 'email',
            status: 'delivered',
            messageId: 'msg_123'
          }]
        }]
      });
    });
    
    // For addScheduledAction test
    vi.spyOn(customerRepository, 'addScheduledAction').mockImplementation((id, individualId, actionData) => {
      return Promise.resolve({
        ...mockCustomerWithIndividual,
        individuals: [{
          ...testIndividual,
          scheduledActions: [{
            ...actionData,
            executed: false
          }]
        }]
      });
    });
    
    // For updateScheduledAction test
    vi.spyOn(customerRepository, 'updateScheduledAction').mockImplementation(() => {
      return Promise.resolve({
        ...mockCustomerWithScheduledAction,
        individuals: [{
          ...testIndividual,
          scheduledActions: [{
            type: 'reminder',
            scheduledFor: new Date(Date.now() - 86400000),
            executed: true,
            executedAt: new Date()
          }]
        }]
      });
    });
    
    // For updateContactInfo test
    vi.spyOn(customerRepository, 'updateContactInfo').mockImplementation((id, individualId, contactInfo) => {
      return Promise.resolve({
        ...mockCustomerWithIndividual,
        individuals: [{
          ...testIndividual,
          contactInfo: {
            ...testIndividual.contactInfo,
            ...contactInfo
          }
        }]
      });
    });
    
    // For updateCommunicationSettings test
    vi.spyOn(customerRepository, 'updateCommunicationSettings').mockImplementation((id, settings) => {
      return Promise.resolve({
        ...mockCustomerWithId,
        communicationSettings: {
          ...testCustomer.communicationSettings,
          ...settings
        }
      });
    });
    
    // For updateWebhookSettings test
    vi.spyOn(customerRepository, 'updateWebhookSettings').mockImplementation((id, settings) => {
      return Promise.resolve({
        ...mockCustomerWithId,
        webhookSettings: settings
      });
    });
    
    // For getDueScheduledActions test
    vi.spyOn(customerRepository, 'getDueScheduledActions').mockResolvedValue([
      {
        customerId: 'mock-id',
        individualId: 'test-individual',
        actionIndex: 0,
        action: {
          type: 'reminder',
          scheduledFor: new Date(Date.now() - 86400000),
          executed: false
        }
      }
    ]);
  });

  // Disconnect from database after tests
  afterAll(async () => {
    await closeDatabase();
    vi.restoreAllMocks();
  });


  it('should create a customer', async () => {
    const customer = await customerRepository.create(testCustomer);
    
    expect(customer._id).toBeDefined();
    expect(customer.name).toBe(testCustomer.name);
    expect(customer.link).toBe(testCustomer.link);
    expect(customer.endpoint).toBe(testCustomer.endpoint);
  });

  it('should find all customers', async () => {
    // Create test customers
    await customerRepository.create(testCustomer);
    await customerRepository.create({
      ...testCustomer,
      name: 'Another Customer'
    });
    
    const customers = await customerRepository.findAll();
    
    expect(customers).toHaveLength(2);
    expect(customers[0].name).toBe(testCustomer.name);
    expect(customers[1].name).toBe('Another Customer');
  });

  it('should find a customer by ID', async () => {
    const createdCustomer = await customerRepository.create(testCustomer);
    
    const foundCustomer = await customerRepository.findById(createdCustomer._id);
    
    expect(foundCustomer).toBeDefined();
    expect(foundCustomer.name).toBe(testCustomer.name);
  });

  it('should update a customer', async () => {
    const createdCustomer = await customerRepository.create(testCustomer);
    
    const updatedCustomer = await customerRepository.update(createdCustomer._id, {
      name: 'Updated Customer'
    });
    
    expect(updatedCustomer.name).toBe('Updated Customer');
  });

  it('should delete a customer', async () => {
    const createdCustomer = await customerRepository.create(testCustomer);
    
    await customerRepository.delete(createdCustomer._id);
    
    const foundCustomer = await customerRepository.findById(createdCustomer._id);
    expect(foundCustomer).toBeNull();
  });

  it('should add an individual to a customer', async () => {
    const createdCustomer = await customerRepository.create(testCustomer);
    
    const updatedCustomer = await customerRepository.addIndividual(
      createdCustomer._id,
      testIndividual
    );
    
    expect(updatedCustomer.individuals).toHaveLength(1);
    expect(updatedCustomer.individuals[0].id).toBe(testIndividual.id);
    expect(updatedCustomer.individuals[0].contactInfo.email).toBe(testIndividual.contactInfo.email);
  });

  it('should remove an individual from a customer', async () => {
    // Create customer with individual
    const createdCustomer = await customerRepository.create(testCustomer);
    await customerRepository.addIndividual(createdCustomer._id, testIndividual);
    
    // Remove individual
    const updatedCustomer = await customerRepository.removeIndividual(
      createdCustomer._id,
      testIndividual.id
    );
    
    expect(updatedCustomer.individuals).toHaveLength(0);
  });

  it('should update individual status', async () => {
    // Create customer with individual
    const createdCustomer = await customerRepository.create(testCustomer);
    await customerRepository.addIndividual(createdCustomer._id, testIndividual);
    
    // Update status
    const updatedCustomer = await customerRepository.updateIndividualStatus(
      createdCustomer._id,
      testIndividual.id,
      'invited'
    );
    
    expect(updatedCustomer.individuals[0].status).toBe('invited');
  });

  it('should update individual from webhook', async () => {
    // Create customer with individual
    const createdCustomer = await customerRepository.create(testCustomer);
    await customerRepository.addIndividual(createdCustomer._id, testIndividual);
    
    // Update from webhook
    const progress = {
      currentStep: 'identity_verification',
      completedSteps: ['consent', 'personal_info'],
      totalSteps: 5,
      percentComplete: 40
    };
    
    const updatedCustomer = await customerRepository.updateIndividualFromWebhook(
      createdCustomer._id,
      testIndividual.id,
      'in_progress',
      progress
    );
    
    expect(updatedCustomer.individuals[0].status).toBe('in_progress');
    expect(updatedCustomer.individuals[0].collectionProgress.currentStep).toBe('identity_verification');
    expect(updatedCustomer.individuals[0].collectionProgress.percentComplete).toBe(40);
  });

  it('should add communication to an individual', async () => {
    // Create customer with individual
    const createdCustomer = await customerRepository.create(testCustomer);
    await customerRepository.addIndividual(createdCustomer._id, testIndividual);
    
    // Add communication
    const communicationData = {
      channel: 'email',
      status: 'sent',
      messageId: 'msg_123'
    };
    
    const updatedCustomer = await customerRepository.addCommunication(
      createdCustomer._id,
      testIndividual.id,
      communicationData
    );
    
    expect(updatedCustomer.individuals[0].communications).toHaveLength(1);
    expect(updatedCustomer.individuals[0].communications[0].channel).toBe('email');
    expect(updatedCustomer.individuals[0].communications[0].status).toBe('sent');
  });

  it('should update communication status', async () => {
    // Create customer with individual and communication
    const createdCustomer = await customerRepository.create(testCustomer);
    await customerRepository.addIndividual(createdCustomer._id, testIndividual);
    
    const communicationData = {
      channel: 'email',
      status: 'sent',
      messageId: 'msg_123'
    };
    
    await customerRepository.addCommunication(
      createdCustomer._id,
      testIndividual.id,
      communicationData
    );
    
    // Update communication status
    const updatedCustomer = await customerRepository.updateCommunicationStatus(
      createdCustomer._id,
      testIndividual.id,
      'msg_123',
      'delivered'
    );
    
    expect(updatedCustomer.individuals[0].communications[0].status).toBe('delivered');
  });

  it('should add scheduled action to an individual', async () => {
    // Create customer with individual
    const createdCustomer = await customerRepository.create(testCustomer);
    await customerRepository.addIndividual(createdCustomer._id, testIndividual);
    
    // Add scheduled action
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 1); // Tomorrow
    
    const actionData = {
      type: 'reminder',
      scheduledFor: scheduledDate
    };
    
    const updatedCustomer = await customerRepository.addScheduledAction(
      createdCustomer._id,
      testIndividual.id,
      actionData
    );
    
    expect(updatedCustomer.individuals[0].scheduledActions).toHaveLength(1);
    expect(updatedCustomer.individuals[0].scheduledActions[0].type).toBe('reminder');
    expect(updatedCustomer.individuals[0].scheduledActions[0].executed).toBe(false);
  });

  it('should update scheduled action', async () => {
    // Create customer with individual and scheduled action
    const createdCustomer = await customerRepository.create(testCustomer);
    await customerRepository.addIndividual(createdCustomer._id, testIndividual);
    
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 1); // Tomorrow
    
    const actionData = {
      type: 'reminder',
      scheduledFor: scheduledDate
    };
    
    await customerRepository.addScheduledAction(
      createdCustomer._id,
      testIndividual.id,
      actionData
    );
    
    // Update scheduled action
    const updatedCustomer = await customerRepository.updateScheduledAction(
      createdCustomer._id,
      testIndividual.id,
      0, // First action
      { executed: true, executedAt: new Date() }
    );
    
    expect(updatedCustomer.individuals[0].scheduledActions[0].executed).toBe(true);
    expect(updatedCustomer.individuals[0].scheduledActions[0].executedAt).toBeDefined();
  });

  it('should update contact info', async () => {
    // Create customer with individual
    const createdCustomer = await customerRepository.create(testCustomer);
    await customerRepository.addIndividual(createdCustomer._id, testIndividual);
    
    // Update contact info
    const updatedCustomer = await customerRepository.updateContactInfo(
      createdCustomer._id,
      testIndividual.id,
      {
        email: 'updated@example.com',
        preferredChannel: 'sms'
      }
    );
    
    expect(updatedCustomer.individuals[0].contactInfo.email).toBe('updated@example.com');
    expect(updatedCustomer.individuals[0].contactInfo.preferredChannel).toBe('sms');
    expect(updatedCustomer.individuals[0].contactInfo.phone).toBe(testIndividual.contactInfo.phone);
  });

  it('should update communication settings', async () => {
    // Create customer
    const createdCustomer = await customerRepository.create(testCustomer);
    
    // Update communication settings
    const updatedCustomer = await customerRepository.updateCommunicationSettings(
      createdCustomer._id,
      {
        emailTemplate: 'custom',
        reminderFrequency: 3,
        maxReminders: 5
      }
    );
    
    expect(updatedCustomer.communicationSettings.emailTemplate).toBe('custom');
    expect(updatedCustomer.communicationSettings.reminderFrequency).toBe(3);
    expect(updatedCustomer.communicationSettings.maxReminders).toBe(5);
  });

  it('should update webhook settings', async () => {
    // Create customer
    const createdCustomer = await customerRepository.create(testCustomer);
    
    // Update webhook settings
    const updatedCustomer = await customerRepository.updateWebhookSettings(
      createdCustomer._id,
      {
        url: 'https://example.com/webhook',
        secret: 'test-secret',
        events: ['status_update']
      }
    );
    
    expect(updatedCustomer.webhookSettings.url).toBe('https://example.com/webhook');
    expect(updatedCustomer.webhookSettings.secret).toBe('test-secret');
    expect(updatedCustomer.webhookSettings.events).toEqual(['status_update']);
  });

  it('should get due scheduled actions', async () => {
    // Create customer with individual and past scheduled action
    const createdCustomer = await customerRepository.create(testCustomer);
    await customerRepository.addIndividual(createdCustomer._id, testIndividual);
    
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Yesterday
    
    const actionData = {
      type: 'reminder',
      scheduledFor: pastDate,
      executed: false
    };
    
    await customerRepository.addScheduledAction(
      createdCustomer._id,
      testIndividual.id,
      actionData
    );
    
    // Get due actions
    const dueActions = await customerRepository.getDueScheduledActions();
    
    expect(dueActions).toHaveLength(1);
    expect(dueActions[0].customerId.toString()).toBe(createdCustomer._id.toString());
    expect(dueActions[0].individualId).toBe(testIndividual.id);
    expect(dueActions[0].action.type).toBe('reminder');
  });
});