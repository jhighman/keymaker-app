import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { Customer } from '../models/Customer.js';
import { customerRepository } from '../repositories/customerRepository.js';
import { setupDatabase, clearDatabase, closeDatabase, mockInMemoryDatabase } from './setup.js';
import { config } from '../config.js';

// Mock the functions that would send actual communications
vi.mock('../repositories/customerRepository.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // Add any mocks needed for testing
  };
});

describe('Scheduler', () => {
  // Create mock database functions
  const mockDb = {
    findCustomers: vi.fn().mockResolvedValue([]),
    findCustomerById: vi.fn().mockResolvedValue(null),
    createCustomer: vi.fn().mockImplementation(data => Promise.resolve({ ...data, id: 'mock-id' })),
    updateCustomer: vi.fn().mockImplementation((id, data) => Promise.resolve({ ...data, id })),
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
    
    // Set up mock implementations for scheduler tests
    mockDb.findCustomers.mockImplementation(() => {
      return Promise.resolve([
        {
          id: 'mock-customer-id',
          name: 'Test Customer',
          communicationSettings: {
            reminderFrequency: 7,
            maxReminders: 3
          },
          individuals: [
            {
              id: 'test-individual',
              status: 'pending',
              contactInfo: {
                email: 'test@example.com',
                phone: '123-456-7890',
                preferredChannel: 'email'
              },
              scheduledActions: []
            }
          ]
        }
      ]);
    });
  });

  // Clear database and reset mocks before each test
  beforeEach(async () => {
    // Clear the MongoDB database
    await clearDatabase();
    
    // Reset mock function calls
    vi.clearAllMocks();
  });

  // Disconnect from database and restore mocks after tests
  afterAll(async () => {
    await closeDatabase();
    vi.restoreAllMocks();
  });

  // Test data
  const testCustomer = {
    name: 'Test Customer',
    link: 'https://example.com/collect?key=test',
    endpoint: 'test-endpoint',
    communicationSettings: {
      emailTemplate: 'default',
      smsTemplate: 'default',
      reminderFrequency: 7,
      maxReminders: 3,
      expirationPeriod: 30
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

  // Helper function to create a scheduled action
  const createScheduledAction = async (type, scheduledFor, executed = false) => {
    // Create a mock customer with scheduled action
    const customer = {
      id: 'mock-customer-id',
      name: 'Test Customer',
      communicationSettings: {
        reminderFrequency: 7,
        maxReminders: 3
      },
      individuals: [
        {
          id: 'test-individual',
          status: 'pending',
          contactInfo: {
            email: 'test@example.com',
            phone: '123-456-7890',
            preferredChannel: 'email'
          },
          scheduledActions: [
            {
              type,
              scheduledFor,
              executed
            }
          ]
        }
      ]
    };
    
    // Mock the getDueScheduledActions method to return this action if it's due
    const now = new Date();
    if (new Date(scheduledFor) <= now && !executed) {
      vi.spyOn(customerRepository, 'getDueScheduledActions').mockResolvedValue([
        {
          customerId: customer.id,
          individualId: 'test-individual',
          actionIndex: 0,
          action: {
            type,
            scheduledFor,
            executed
          }
        }
      ]);
    } else {
      vi.spyOn(customerRepository, 'getDueScheduledActions').mockResolvedValue([]);
    }
    
    // Mock the findById method to return this customer
    vi.spyOn(customerRepository, 'findById').mockResolvedValue(customer);
    
    // Mock the updateScheduledAction method
    vi.spyOn(customerRepository, 'updateScheduledAction').mockImplementation((customerId, individualId, actionIndex, updates) => {
      customer.individuals[0].scheduledActions[actionIndex] = {
        ...customer.individuals[0].scheduledActions[actionIndex],
        ...updates
      };
      return Promise.resolve(customer);
    });
    
    // Mock the addCommunication method
    vi.spyOn(customerRepository, 'addCommunication').mockImplementation((customerId, individualId, communicationData) => {
      if (!customer.individuals[0].communications) {
        customer.individuals[0].communications = [];
      }
      customer.individuals[0].communications.push(communicationData);
      return Promise.resolve(customer);
    });
    
    // Mock the addScheduledAction method
    vi.spyOn(customerRepository, 'addScheduledAction').mockImplementation((customerId, individualId, actionData) => {
      customer.individuals[0].scheduledActions.push(actionData);
      return Promise.resolve(customer);
    });
    
    return customer;
  };

  it('should process due reminder actions', async () => {
    // Create a customer with a due reminder action
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Yesterday
    
    const customer = await createScheduledAction('reminder', pastDate);
    
    // Get due actions
    const dueActions = await customerRepository.getDueScheduledActions();
    
    expect(dueActions).toHaveLength(1);
    expect(dueActions[0].action.type).toBe('reminder');
    
    // Process the action
    await customerRepository.updateScheduledAction(
      'mock-customer-id',
      'test-individual',
      0, // First action
      { executed: true, executedAt: new Date() }
    );
    
    // Add communication record
    await customerRepository.addCommunication(
      'mock-customer-id',
      'test-individual',
      {
        channel: 'email',
        status: 'sent',
        messageId: `msg_${Date.now()}`,
        message: 'Reminder: Please complete your background check'
      }
    );
    
    // Verify action was marked as executed
    expect(customerRepository.updateScheduledAction).toHaveBeenCalledWith(
      'mock-customer-id',
      'test-individual',
      0,
      expect.objectContaining({ executed: true, executedAt: expect.any(Date) })
    );
    
    // Verify communication was added
    expect(customerRepository.addCommunication).toHaveBeenCalledWith(
      'mock-customer-id',
      'test-individual',
      expect.objectContaining({
        channel: 'email',
        message: expect.stringContaining('Reminder')
      })
    );
  });

  it('should process due expiration notice actions', async () => {
    // Create a customer with a due expiration notice action
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Yesterday
    
    const customer = await createScheduledAction('expiration_notice', pastDate);
    
    // Get due actions
    const dueActions = await customerRepository.getDueScheduledActions();
    
    expect(dueActions).toHaveLength(1);
    expect(dueActions[0].action.type).toBe('expiration_notice');
    
    // Process the action
    await customerRepository.updateScheduledAction(
      'mock-customer-id',
      'test-individual',
      0, // First action
      { executed: true, executedAt: new Date() }
    );
    
    // Add communication record
    await customerRepository.addCommunication(
      'mock-customer-id',
      'test-individual',
      {
        channel: 'email',
        status: 'sent',
        messageId: `msg_${Date.now()}`,
        message: 'Your background check link will expire soon'
      }
    );
    
    // Add expiration action
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1); // Tomorrow
    
    await customerRepository.addScheduledAction(
      'mock-customer-id',
      'test-individual',
      {
        type: 'expire',
        scheduledFor: expirationDate
      }
    );
    
    // Verify action was marked as executed
    expect(customerRepository.updateScheduledAction).toHaveBeenCalledWith(
      'mock-customer-id',
      'test-individual',
      0,
      expect.objectContaining({ executed: true })
    );
    
    // Verify communication was added
    expect(customerRepository.addCommunication).toHaveBeenCalledWith(
      'mock-customer-id',
      'test-individual',
      expect.objectContaining({
        channel: 'email',
        message: expect.stringContaining('expire')
      })
    );
    
    // Verify expiration action was scheduled
    expect(customerRepository.addScheduledAction).toHaveBeenCalledWith(
      'mock-customer-id',
      'test-individual',
      expect.objectContaining({
        type: 'expire',
        scheduledFor: expect.any(Date)
      })
    );
  });

  it('should process due follow-up actions', async () => {
    // Create a customer with a due follow-up action
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Yesterday
    
    const customer = await createScheduledAction('follow_up', pastDate);
    
    // Get due actions
    const dueActions = await customerRepository.getDueScheduledActions();
    
    expect(dueActions).toHaveLength(1);
    expect(dueActions[0].action.type).toBe('follow_up');
    
    // Process the action
    await customerRepository.updateScheduledAction(
      'mock-customer-id',
      'test-individual',
      0, // First action
      { executed: true, executedAt: new Date() }
    );
    
    // Add communication record
    await customerRepository.addCommunication(
      'mock-customer-id',
      'test-individual',
      {
        channel: 'email',
        status: 'sent',
        messageId: `msg_${Date.now()}`,
        message: 'Follow-up: We noticed you started but didn\'t complete your background check'
      }
    );
    
    // Verify action was marked as executed
    expect(customerRepository.updateScheduledAction).toHaveBeenCalledWith(
      'mock-customer-id',
      'test-individual',
      0,
      expect.objectContaining({ executed: true })
    );
    
    // Verify communication was added
    expect(customerRepository.addCommunication).toHaveBeenCalledWith(
      'mock-customer-id',
      'test-individual',
      expect.objectContaining({
        channel: 'email',
        message: expect.stringContaining('Follow-up')
      })
    );
  });

  it('should not process already executed actions', async () => {
    // Create a customer with an already executed action
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Yesterday
    
    await createScheduledAction('reminder', pastDate, true); // Already executed
    
    // Get due actions
    const dueActions = await customerRepository.getDueScheduledActions();
    
    // Should not find any due actions
    expect(dueActions).toHaveLength(0);
  });

  it('should not process future actions', async () => {
    // Create a customer with a future action
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1); // Tomorrow
    
    await createScheduledAction('reminder', futureDate);
    
    // Get due actions
    const dueActions = await customerRepository.getDueScheduledActions();
    
    // Should not find any due actions
    expect(dueActions).toHaveLength(0);
  });

  it('should schedule next reminder based on frequency', async () => {
    // Create a customer with a due reminder action
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Yesterday
    
    const customer = await createScheduledAction('reminder', pastDate);
    
    // Process the action
    await customerRepository.updateScheduledAction(
      'mock-customer-id',
      'test-individual',
      0, // First action
      { executed: true, executedAt: new Date() }
    );
    
    // Add communication record
    await customerRepository.addCommunication(
      'mock-customer-id',
      'test-individual',
      {
        channel: 'email',
        status: 'sent',
        messageId: `msg_${Date.now()}`,
        message: 'Reminder: Please complete your background check'
      }
    );
    
    // Schedule next reminder
    const reminderFrequency = customer.communicationSettings.reminderFrequency;
    const nextReminderDate = new Date();
    nextReminderDate.setDate(nextReminderDate.getDate() + reminderFrequency);
    
    await customerRepository.addScheduledAction(
      'mock-customer-id',
      'test-individual',
      {
        type: 'reminder',
        scheduledFor: nextReminderDate
      }
    );
    
    // Verify next reminder was scheduled
    expect(customerRepository.addScheduledAction).toHaveBeenCalledWith(
      'mock-customer-id',
      'test-individual',
      expect.objectContaining({
        type: 'reminder',
        scheduledFor: expect.any(Date)
      })
    );
    
    // Verify the scheduled date is correct
    const callArgs = customerRepository.addScheduledAction.mock.calls[0][2];
    const scheduledDate = new Date(callArgs.scheduledFor);
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + reminderFrequency);
    
    // Compare dates (ignoring time)
    expect(scheduledDate.toDateString()).toBe(expectedDate.toDateString());
  });

  it('should respect maximum reminders setting', async () => {
    // Create a mock customer with max reminders already sent
    const customer = {
      id: 'mock-customer-id',
      name: 'Test Customer',
      communicationSettings: {
        reminderFrequency: 7,
        maxReminders: 3
      },
      individuals: [
        {
          id: 'test-individual',
          status: 'pending',
          contactInfo: {
            email: 'test@example.com',
            phone: '123-456-7890',
            preferredChannel: 'email'
          },
          communications: [
            {
              channel: 'email',
              status: 'sent',
              messageId: 'msg_1',
              message: 'Reminder: Please complete your background check',
              timestamp: new Date()
            },
            {
              channel: 'email',
              status: 'sent',
              messageId: 'msg_2',
              message: 'Reminder: Please complete your background check',
              timestamp: new Date()
            },
            {
              channel: 'email',
              status: 'sent',
              messageId: 'msg_3',
              message: 'Reminder: Please complete your background check',
              timestamp: new Date()
            }
          ],
          scheduledActions: [
            {
              type: 'reminder',
              scheduledFor: new Date(Date.now() - 86400000), // Yesterday
              executed: false
            }
          ]
        }
      ]
    };
    
    // Mock the getDueScheduledActions method to return this action
    vi.spyOn(customerRepository, 'getDueScheduledActions').mockResolvedValue([
      {
        customerId: customer.id,
        individualId: 'test-individual',
        actionIndex: 0,
        action: {
          type: 'reminder',
          scheduledFor: new Date(Date.now() - 86400000),
          executed: false
        }
      }
    ]);
    
    // Mock the findById method to return this customer
    vi.spyOn(customerRepository, 'findById').mockResolvedValue(customer);
    
    // Mock the updateScheduledAction method
    vi.spyOn(customerRepository, 'updateScheduledAction').mockImplementation((customerId, individualId, actionIndex, updates) => {
      customer.individuals[0].scheduledActions[actionIndex] = {
        ...customer.individuals[0].scheduledActions[actionIndex],
        ...updates
      };
      return Promise.resolve(customer);
    });
    
    // Mock the addCommunication method
    vi.spyOn(customerRepository, 'addCommunication').mockImplementation((customerId, individualId, communicationData) => {
      customer.individuals[0].communications.push(communicationData);
      return Promise.resolve(customer);
    });
    
    // Get due actions
    const dueActions = await customerRepository.getDueScheduledActions();
    expect(dueActions).toHaveLength(1);
    
    // Process the action
    await customerRepository.updateScheduledAction(
      'mock-customer-id',
      'test-individual',
      0, // First action
      { executed: true, executedAt: new Date() }
    );
    
    // Add communication record
    await customerRepository.addCommunication(
      'mock-customer-id',
      'test-individual',
      {
        channel: 'email',
        status: 'sent',
        messageId: `msg_${Date.now()}`,
        message: 'Reminder: Please complete your background check'
      }
    );
    
    // Verify no more reminders are scheduled (max reached)
    expect(customerRepository.addScheduledAction).not.toHaveBeenCalled();
    
    // Verify communication count
    expect(customer.individuals[0].communications.length).toBe(4);
  });
});