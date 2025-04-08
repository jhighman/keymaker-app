export function setupInMemoryDB() {
  // Simple in-memory database structure
  const db = {
    keys: [],
    customers: [],
    individuals: []
  };

  // Add methods to manipulate the data
  return {
    collections: db,
    
    // Keys methods
    findKeys: (query = {}) => {
      return Promise.resolve(db.keys.filter(key => 
        Object.entries(query).every(([k, v]) => key[k] === v)
      ));
    },
    findKeyById: (id) => {
      return Promise.resolve(db.keys.find(key => key.id === id) || null);
    },
    createKey: (keyData) => {
      const newKey = { id: Date.now().toString(), ...keyData };
      db.keys.push(newKey);
      return Promise.resolve(newKey);
    },
    updateKey: (id, keyData) => {
      const index = db.keys.findIndex(key => key.id === id);
      if (index === -1) return Promise.resolve(null);
      
      db.keys[index] = { ...db.keys[index], ...keyData };
      return Promise.resolve(db.keys[index]);
    },
    deleteKey: (id) => {
      const index = db.keys.findIndex(key => key.id === id);
      if (index === -1) return Promise.resolve(false);
      
      db.keys.splice(index, 1);
      return Promise.resolve(true);
    },
    
    // Customer methods
    findCustomers: (query = {}) => {
      return Promise.resolve(db.customers.filter(customer => 
        Object.entries(query).every(([k, v]) => customer[k] === v)
      ));
    },
    findCustomerById: (id) => {
      return Promise.resolve(db.customers.find(customer => customer.id === id) || null);
    },
    createCustomer: (customerData) => {
      const newCustomer = { id: Date.now().toString(), ...customerData };
      db.customers.push(newCustomer);
      return Promise.resolve(newCustomer);
    },
    updateCustomer: (id, customerData) => {
      const index = db.customers.findIndex(customer => customer.id === id);
      if (index === -1) return Promise.resolve(null);
      
      db.customers[index] = { ...db.customers[index], ...customerData };
      return Promise.resolve(db.customers[index]);
    },
    deleteCustomer: (id) => {
      const index = db.customers.findIndex(customer => customer.id === id);
      if (index === -1) return Promise.resolve(false);
      
      db.customers.splice(index, 1);
      return Promise.resolve(true);
    },
    
    // Individual methods
    findIndividuals: (query = {}) => {
      return Promise.resolve(db.individuals.filter(individual => 
        Object.entries(query).every(([k, v]) => individual[k] === v)
      ));
    },
    findIndividualById: (id) => {
      return Promise.resolve(db.individuals.find(individual => individual.id === id) || null);
    },
    createIndividual: (individualData) => {
      const newIndividual = { id: Date.now().toString(), ...individualData };
      db.individuals.push(newIndividual);
      return Promise.resolve(newIndividual);
    },
    updateIndividual: (id, individualData) => {
      const index = db.individuals.findIndex(individual => individual.id === id);
      if (index === -1) return Promise.resolve(null);
      
      db.individuals[index] = { ...db.individuals[index], ...individualData };
      return Promise.resolve(db.individuals[index]);
    },
    deleteIndividual: (id) => {
      const index = db.individuals.findIndex(individual => individual.id === id);
      if (index === -1) return Promise.resolve(false);
      
      db.individuals.splice(index, 1);
      return Promise.resolve(true);
    }
  };
}