// Database configuration
let DB_URL = 'http://localhost:3000/api'; // default to local
let IS_LOCAL_MODE = true; // default to local mode

export const initializeDatabase = (environment) => {
  IS_LOCAL_MODE = environment === 'local';
  DB_URL = environment === 'production' 
    ? 'https://api.keymaker.trua.me/api'
    : 'http://localhost:3000/api';
  console.debug('Database environment:', environment);
};

// Local storage keys
const LOCAL_STORAGE_KEYS = {
  CUSTOMERS: 'keymaker_customers'
};

// Local storage helpers
const getLocalCustomers = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.CUSTOMERS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

const saveLocalCustomers = (customers) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// API Services
export const customerService = {
  getCustomers: async () => {
    console.debug('Getting all customers in mode:', IS_LOCAL_MODE ? 'local' : 'production');
    
    if (IS_LOCAL_MODE) {
      // In local mode, return all customers from localStorage
      const customers = getLocalCustomers();
      console.debug('Local customers:', customers);
      return customers;
    }

    // Production mode - use API
    try {
      const response = await fetch(`${DB_URL}/customers`);
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      console.debug('Customers from API:', data);
      return data;
    } catch (error) {
      console.error('Error in getCustomers:', error);
      throw error;
    }
  },

  getCustomer: async (spid) => {
    console.debug('Getting customer with SPID:', spid, 'in mode:', IS_LOCAL_MODE ? 'local' : 'production');
    
    if (IS_LOCAL_MODE) {
      // In local mode, search through local storage
      const customers = getLocalCustomers();
      const customer = customers.find(c => c.spid === spid);
      console.debug('Local customer lookup result:', customer || null);
      return customer || null;
    }

    // Production mode - use API
    try {
      console.debug('Fetching customer from API with SPID:', spid);
      const response = await fetch(`${DB_URL}/customers/lookup?spid=${encodeURIComponent(spid)}`);
      if (!response.ok) {
        console.debug('Customer lookup failed:', response.status, response.statusText);
        return null;
      }
      const data = await response.json();
      console.debug('Customer data from API:', data);
      return data;
    } catch (error) {
      console.error('Error in getCustomer:', error);
      return null;
    }
  },

  createCustomer: async (customer) => {
    console.debug('Creating customer:', customer, 'in mode:', IS_LOCAL_MODE ? 'local' : 'production');
    
    if (IS_LOCAL_MODE) {
      // In local mode, save to localStorage
      const customers = getLocalCustomers();
      customers.push(customer);
      saveLocalCustomers(customers);
      return customer;
    }

    // Production mode - use API
    const response = await fetch(`${DB_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer)
    });
    if (!response.ok) throw new Error('Failed to create customer');
    return response.json();
  },

  deleteCustomer: async (id) => {
    console.debug('Deleting customer:', id, 'in mode:', IS_LOCAL_MODE ? 'local' : 'production');
    
    if (IS_LOCAL_MODE) {
      // In local mode, remove from localStorage
      const customers = getLocalCustomers();
      const filtered = customers.filter(c => c.id !== id);
      saveLocalCustomers(filtered);
      return true;
    }

    // Production mode - use API
    const response = await fetch(`${DB_URL}/customers/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete customer');
    return true;
  },

  addIndividual: async (customerId, individual) => {
    console.debug('Adding individual to customer:', customerId, individual, 'in mode:', IS_LOCAL_MODE ? 'local' : 'production');
    
    if (IS_LOCAL_MODE) {
      // In local mode, update in localStorage
      const customers = getLocalCustomers();
      const updated = customers.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            individuals: [...(customer.individuals || []), individual]
          };
        }
        return customer;
      });
      saveLocalCustomers(updated);
      return updated.find(c => c.id === customerId);
    }

    // Production mode - use API
    const response = await fetch(`${DB_URL}/customers/${customerId}/individuals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(individual)
    });
    if (!response.ok) throw new Error('Failed to add individual');
    return response.json();
  },

  removeIndividual: async (customerId, individualId) => {
    console.debug('Removing individual:', individualId, 'from customer:', customerId, 'in mode:', IS_LOCAL_MODE ? 'local' : 'production');
    
    if (IS_LOCAL_MODE) {
      // In local mode, update in localStorage
      const customers = getLocalCustomers();
      const updated = customers.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            individuals: (customer.individuals || []).filter(ind => ind.id !== individualId)
          };
        }
        return customer;
      });
      saveLocalCustomers(updated);
      return true;
    }

    // Production mode - use API
    const response = await fetch(`${DB_URL}/customers/${customerId}/individuals/${individualId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to remove individual');
    return true;
  },
  
  updateIndividualStatus: async (customerId, individualId, status) => {
    console.debug('Updating individual status:', customerId, individualId, status, 'in mode:', IS_LOCAL_MODE ? 'local' : 'production');
    
    if (IS_LOCAL_MODE) {
      // In local mode, update in localStorage
      const customers = getLocalCustomers();
      const updated = customers.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            individuals: (customer.individuals || []).map(ind => {
              if (ind.id === individualId) {
                return {
                  ...ind,
                  status,
                  updatedAt: new Date()
                };
              }
              return ind;
            })
          };
        }
        return customer;
      });
      saveLocalCustomers(updated);
      return updated.find(c => c.id === customerId);
    }
    
    // Production mode - use API
    const response = await fetch(`${DB_URL}/customers/${customerId}/individuals/${individualId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update individual status');
    return response.json();
  },
  
  updateContactInfo: async (customerId, individualId, contactInfo) => {
    console.debug('Updating contact info:', customerId, individualId, contactInfo, 'in mode:', IS_LOCAL_MODE ? 'local' : 'production');
    
    if (IS_LOCAL_MODE) {
      // In local mode, update in localStorage
      const customers = getLocalCustomers();
      const updated = customers.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            individuals: (customer.individuals || []).map(ind => {
              if (ind.id === individualId) {
                return {
                  ...ind,
                  contactInfo: {
                    ...(ind.contactInfo || {}),
                    ...contactInfo
                  },
                  updatedAt: new Date()
                };
              }
              return ind;
            })
          };
        }
        return customer;
      });
      saveLocalCustomers(updated);
      return updated.find(c => c.id === customerId);
    }
    
    // Production mode - use API
    const response = await fetch(`${DB_URL}/customers/${customerId}/individuals/${individualId}/contact`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactInfo)
    });
    if (!response.ok) throw new Error('Failed to update contact info');
    return response.json();
  },
  
  addCommunication: async (customerId, individualId, communicationData) => {
    console.debug('Adding communication:', customerId, individualId, communicationData, 'in mode:', IS_LOCAL_MODE ? 'local' : 'production');
    
    if (IS_LOCAL_MODE) {
      // In local mode, update in localStorage
      const customers = getLocalCustomers();
      const updated = customers.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            individuals: (customer.individuals || []).map(ind => {
              if (ind.id === individualId) {
                return {
                  ...ind,
                  communications: [
                    ...(ind.communications || []),
                    {
                      ...communicationData,
                      timestamp: new Date(),
                      messageId: communicationData.messageId || `msg_${Date.now()}`
                    }
                  ],
                  updatedAt: new Date()
                };
              }
              return ind;
            })
          };
        }
        return customer;
      });
      saveLocalCustomers(updated);
      return updated.find(c => c.id === customerId);
    }
    
    // Production mode - use API
    const response = await fetch(`${DB_URL}/customers/${customerId}/individuals/${individualId}/communications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(communicationData)
    });
    if (!response.ok) throw new Error('Failed to add communication');
    return response.json();
  },
  
  updateCommunicationStatus: async (customerId, individualId, messageId, status) => {
    console.debug('Updating communication status:', customerId, individualId, messageId, status, 'in mode:', IS_LOCAL_MODE ? 'local' : 'production');
    
    if (IS_LOCAL_MODE) {
      // In local mode, update in localStorage
      const customers = getLocalCustomers();
      const updated = customers.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            individuals: (customer.individuals || []).map(ind => {
              if (ind.id === individualId) {
                return {
                  ...ind,
                  communications: (ind.communications || []).map(comm => {
                    if (comm.messageId === messageId) {
                      return {
                        ...comm,
                        status
                      };
                    }
                    return comm;
                  }),
                  updatedAt: new Date()
                };
              }
              return ind;
            })
          };
        }
        return customer;
      });
      saveLocalCustomers(updated);
      return updated.find(c => c.id === customerId);
    }
    
    // Production mode - use API
    const response = await fetch(`${DB_URL}/customers/${customerId}/individuals/${individualId}/communications/${messageId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update communication status');
    return response.json();
  },
  
  addScheduledAction: async (customerId, individualId, actionData) => {
    console.debug('Adding scheduled action:', customerId, individualId, actionData, 'in mode:', IS_LOCAL_MODE ? 'local' : 'production');
    
    if (IS_LOCAL_MODE) {
      // In local mode, update in localStorage
      const customers = getLocalCustomers();
      const updated = customers.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            individuals: (customer.individuals || []).map(ind => {
              if (ind.id === individualId) {
                return {
                  ...ind,
                  scheduledActions: [
                    ...(ind.scheduledActions || []),
                    {
                      ...actionData,
                      executed: false
                    }
                  ],
                  updatedAt: new Date()
                };
              }
              return ind;
            })
          };
        }
        return customer;
      });
      saveLocalCustomers(updated);
      return updated.find(c => c.id === customerId);
    }
    
    // Production mode - use API
    const response = await fetch(`${DB_URL}/customers/${customerId}/individuals/${individualId}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actionData)
    });
    if (!response.ok) throw new Error('Failed to add scheduled action');
    return response.json();
  },
  
  updateScheduledAction: async (customerId, individualId, actionIndex, updates) => {
    console.debug('Updating scheduled action:', customerId, individualId, actionIndex, updates, 'in mode:', IS_LOCAL_MODE ? 'local' : 'production');
    
    if (IS_LOCAL_MODE) {
      // In local mode, update in localStorage
      const customers = getLocalCustomers();
      const updated = customers.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            individuals: (customer.individuals || []).map(ind => {
              if (ind.id === individualId && ind.scheduledActions && ind.scheduledActions[actionIndex]) {
                const scheduledActions = [...(ind.scheduledActions || [])];
                scheduledActions[actionIndex] = {
                  ...scheduledActions[actionIndex],
                  ...updates
                };
                return {
                  ...ind,
                  scheduledActions,
                  updatedAt: new Date()
                };
              }
              return ind;
            })
          };
        }
        return customer;
      });
      saveLocalCustomers(updated);
      return updated.find(c => c.id === customerId);
    }
    
    // Production mode - use API
    const response = await fetch(`${DB_URL}/customers/${customerId}/individuals/${individualId}/actions/${actionIndex}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update scheduled action');
    return response.json();
  },
  
  updateCommunicationSettings: async (customerId, settings) => {
    console.debug('Updating communication settings:', customerId, settings, 'in mode:', IS_LOCAL_MODE ? 'local' : 'production');
    
    if (IS_LOCAL_MODE) {
      // In local mode, update in localStorage
      const customers = getLocalCustomers();
      const updated = customers.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            communicationSettings: {
              ...(customer.communicationSettings || {}),
              ...settings
            },
            updatedAt: new Date()
          };
        }
        return customer;
      });
      saveLocalCustomers(updated);
      return updated.find(c => c.id === customerId);
    }
    
    // Production mode - use API
    const response = await fetch(`${DB_URL}/customers/${customerId}/communication-settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!response.ok) throw new Error('Failed to update communication settings');
    return response.json();
  },
  
  updateWebhookSettings: async (customerId, settings) => {
    console.debug('Updating webhook settings:', customerId, settings, 'in mode:', IS_LOCAL_MODE ? 'local' : 'production');
    
    if (IS_LOCAL_MODE) {
      // In local mode, update in localStorage
      const customers = getLocalCustomers();
      const updated = customers.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            webhookSettings: {
              ...(customer.webhookSettings || {}),
              ...settings
            },
            updatedAt: new Date()
          };
        }
        return customer;
      });
      saveLocalCustomers(updated);
      return updated.find(c => c.id === customerId);
    }
    
    // Production mode - use API
    const response = await fetch(`${DB_URL}/customers/${customerId}/webhook-settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!response.ok) throw new Error('Failed to update webhook settings');
    return response.json();
  },
  
  getDueActions: async () => {
    console.debug('Getting due actions in mode:', IS_LOCAL_MODE ? 'local' : 'production');
    
    if (IS_LOCAL_MODE) {
      // In local mode, calculate due actions from localStorage
      const customers = getLocalCustomers();
      const now = new Date();
      const dueActions = [];
      
      customers.forEach(customer => {
        (customer.individuals || []).forEach(individual => {
          (individual.scheduledActions || []).forEach((action, index) => {
            if (!action.executed && new Date(action.scheduledFor) <= now) {
              dueActions.push({
                customerId: customer.id,
                individualId: individual.id,
                actionIndex: index,
                action
              });
            }
          });
        });
      });
      
      return dueActions;
    }
    
    // Production mode - use API
    const response = await fetch(`${DB_URL}/customers/actions/due`);
    if (!response.ok) throw new Error('Failed to get due actions');
    return response.json();
  },
  
  sendInvitation: async (customerId, individualId, channel, message) => {
    console.debug('Sending invitation:', customerId, individualId, channel, 'in mode:', IS_LOCAL_MODE ? 'local' : 'production');
    
    // Create communication record
    const communicationData = {
      channel,
      status: 'sent',
      messageId: `msg_${Date.now()}`,
      message
    };
    
    // Add communication record
    const customer = await customerService.addCommunication(customerId, individualId, communicationData);
    
    // Update individual status to 'invited'
    await customerService.updateIndividualStatus(customerId, individualId, 'invited');
    
    return customer;
  }
};

export const keyService = {
  analyzeKey: async (key) => {
    // Key analysis is always done locally since it's just parsing the key format
    try {
      // Parse the key format here
      const [language, personalInfo, consents, residence, employment, education, licenses, signature] = key.split('-');
      
      return {
        language,
        personalInfo,
        consents,
        residenceHistory: residence,
        employmentHistory: employment,
        education,
        professionalLicense: licenses,
        signature
      };
    } catch (error) {
      console.error('Error analyzing key:', error);
      throw new Error('Failed to analyze key format');
    }
  }
};