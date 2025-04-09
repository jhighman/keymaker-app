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