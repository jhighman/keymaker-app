import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { customerService, initializeDatabase, keyService } from '../services/api';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

// Mock fetch
global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    // Setup mocks
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    global.fetch.mockClear();
    localStorageMock.clear();
    
    // Initialize in local mode by default
    initializeDatabase('local');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initializeDatabase', () => {
    it('should set local mode correctly', () => {
      initializeDatabase('local');
      expect(customerService.getCustomers()).resolves.toEqual([]);
    });

    it('should set production mode correctly', () => {
      initializeDatabase('production');
      
      // Mock successful response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: '1', name: 'Test Customer' }])
      });
      
      return customerService.getCustomers().then(customers => {
        expect(customers).toEqual([{ id: '1', name: 'Test Customer' }]);
        expect(global.fetch).toHaveBeenCalledWith('https://api.keymaker.trua.me/api/customers');
      });
    });
  });

  describe('customerService', () => {
    const testCustomer = {
      name: 'Test Customer',
      link: 'https://example.com/collect?key=test',
      endpoint: 'test-endpoint'
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

    describe('in local mode', () => {
      beforeEach(() => {
        initializeDatabase('local');
      });

      it('should get customers from localStorage', async () => {
        localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([testCustomer]));
        
        const customers = await customerService.getCustomers();
        
        expect(customers).toEqual([testCustomer]);
        expect(localStorageMock.getItem).toHaveBeenCalledWith('keymaker_customers');
      });

      it('should create a customer in localStorage', async () => {
        localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([]));
        
        await customerService.createCustomer(testCustomer);
        
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'keymaker_customers',
          expect.stringContaining(testCustomer.name)
        );
      });

      it('should add an individual to a customer in localStorage', async () => {
        const customerWithId = { ...testCustomer, id: '1', individuals: [] };
        localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([customerWithId]));
        
        const updatedCustomer = await customerService.addIndividual('1', testIndividual);
        
        expect(updatedCustomer.individuals).toContainEqual(testIndividual);
        expect(localStorageMock.setItem).toHaveBeenCalled();
      });

      it('should remove an individual from a customer in localStorage', async () => {
        const customerWithIndividual = {
          ...testCustomer,
          id: '1',
          individuals: [testIndividual]
        };
        localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([customerWithIndividual]));
        
        await customerService.removeIndividual('1', 'test-individual');
        
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'keymaker_customers',
          expect.stringContaining('individuals":[]')
        );
      });

      it('should update individual status in localStorage', async () => {
        const customerWithIndividual = {
          ...testCustomer,
          id: '1',
          individuals: [testIndividual]
        };
        localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([customerWithIndividual]));
        
        const updatedCustomer = await customerService.updateIndividualStatus('1', 'test-individual', 'invited');
        
        expect(updatedCustomer.individuals[0].status).toBe('invited');
        expect(localStorageMock.setItem).toHaveBeenCalled();
      });

      it('should update contact info in localStorage', async () => {
        const customerWithIndividual = {
          ...testCustomer,
          id: '1',
          individuals: [testIndividual]
        };
        localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([customerWithIndividual]));
        
        const updatedCustomer = await customerService.updateContactInfo('1', 'test-individual', {
          email: 'updated@example.com'
        });
        
        expect(updatedCustomer.individuals[0].contactInfo.email).toBe('updated@example.com');
        expect(localStorageMock.setItem).toHaveBeenCalled();
      });

      it('should add communication in localStorage', async () => {
        const customerWithIndividual = {
          ...testCustomer,
          id: '1',
          individuals: [testIndividual]
        };
        localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([customerWithIndividual]));
        
        const communicationData = {
          channel: 'email',
          status: 'sent',
          messageId: 'msg_123'
        };
        
        const updatedCustomer = await customerService.addCommunication('1', 'test-individual', communicationData);
        
        expect(updatedCustomer.individuals[0].communications).toHaveLength(1);
        expect(updatedCustomer.individuals[0].communications[0].channel).toBe('email');
        expect(localStorageMock.setItem).toHaveBeenCalled();
      });

      it('should add scheduled action in localStorage', async () => {
        const customerWithIndividual = {
          ...testCustomer,
          id: '1',
          individuals: [testIndividual]
        };
        localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([customerWithIndividual]));
        
        const actionData = {
          type: 'reminder',
          scheduledFor: new Date().toISOString()
        };
        
        const updatedCustomer = await customerService.addScheduledAction('1', 'test-individual', actionData);
        
        expect(updatedCustomer.individuals[0].scheduledActions).toHaveLength(1);
        expect(updatedCustomer.individuals[0].scheduledActions[0].type).toBe('reminder');
        expect(localStorageMock.setItem).toHaveBeenCalled();
      });

      it('should send invitation and update status', async () => {
        const customerWithIndividual = {
          ...testCustomer,
          id: '1',
          individuals: [testIndividual]
        };
        localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([customerWithIndividual]));
        
        // For addCommunication
        localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([customerWithIndividual]));
        
        // For updateIndividualStatus
        const customerWithCommunication = {
          ...customerWithIndividual,
          individuals: [{
            ...testIndividual,
            communications: [{
              channel: 'email',
              status: 'sent',
              messageId: expect.any(String)
            }]
          }]
        };
        localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([customerWithCommunication]));
        
        await customerService.sendInvitation('1', 'test-individual', 'email', 'Test message');
        
        // Should have called setItem twice (once for addCommunication, once for updateIndividualStatus)
        expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
      });
    });

    describe('in production mode', () => {
      beforeEach(() => {
        initializeDatabase('production');
      });

      it('should get customers from API', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([testCustomer])
        });
        
        const customers = await customerService.getCustomers();
        
        expect(customers).toEqual([testCustomer]);
        expect(global.fetch).toHaveBeenCalledWith('https://api.keymaker.trua.me/api/customers');
      });

      it('should create a customer via API', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ ...testCustomer, id: '1' })
        });
        
        const customer = await customerService.createCustomer(testCustomer);
        
        expect(customer).toEqual({ ...testCustomer, id: '1' });
        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.keymaker.trua.me/api/customers',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(testCustomer)
          })
        );
      });

      it('should handle API errors', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error'
        });
        
        await expect(customerService.getCustomers()).rejects.toThrow('Failed to fetch customers');
      });
    });
  });

  describe('keyService', () => {
    it('should analyze key format', async () => {
      const key = 'en-EPA-DTB-R5-E3-E-P-W';
      
      const analysis = await keyService.analyzeKey(key);
      
      expect(analysis).toEqual({
        language: 'en',
        personalInfo: 'EPA',
        consents: 'DTB',
        residenceHistory: 'R5',
        employmentHistory: 'E3',
        education: 'E',
        professionalLicense: 'P',
        signature: 'W'
      });
    });

    it('should handle invalid key format', async () => {
      const key = 'invalid-key';
      
      await expect(keyService.analyzeKey(key)).rejects.toThrow('Failed to analyze key format');
    });
  });
});