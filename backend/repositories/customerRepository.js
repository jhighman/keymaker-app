import { config } from '../config.js';
import { Customer } from '../models/Customer.js';
import { getDatabase } from '../database/connection.js';

export const customerRepository = {
  findAll: async () => {
    if (config.database.mode === 'mongodb') {
      return await Customer.find();
    } else {
      const db = getDatabase();
      return await db.findCustomers();
    }
  },
  
  findById: async (id) => {
    if (config.database.mode === 'mongodb') {
      return await Customer.findById(id);
    } else {
      const db = getDatabase();
      return await db.findCustomerById(id);
    }
  },
  
  create: async (customerData) => {
    if (config.database.mode === 'mongodb') {
      const customer = new Customer(customerData);
      return await customer.save();
    } else {
      const db = getDatabase();
      return await db.createCustomer(customerData);
    }
  },
  
  update: async (id, customerData) => {
    if (config.database.mode === 'mongodb') {
      return await Customer.findByIdAndUpdate(id, customerData, { new: true });
    } else {
      const db = getDatabase();
      return await db.updateCustomer(id, customerData);
    }
  },
  
  delete: async (id) => {
    if (config.database.mode === 'mongodb') {
      return await Customer.findByIdAndDelete(id);
    } else {
      const db = getDatabase();
      return await db.deleteCustomer(id);
    }
  },
  
  addIndividual: async (customerId, individualData) => {
    if (config.database.mode === 'mongodb') {
      const customer = await Customer.findById(customerId);
      if (!customer) return null;
      
      // Ensure the individual has the required fields
      const completeIndividualData = {
        ...individualData,
        contactInfo: individualData.contactInfo || {},
        communications: individualData.communications || [],
        collectionProgress: individualData.collectionProgress || {},
        scheduledActions: individualData.scheduledActions || [],
        metadata: individualData.metadata || {}
      };
      
      customer.individuals.push(completeIndividualData);
      return await customer.save();
    } else {
      const db = getDatabase();
      const customer = await db.findCustomerById(customerId);
      if (!customer) return null;
      
      // Ensure the individual has the required fields
      const completeIndividualData = {
        ...individualData,
        contactInfo: individualData.contactInfo || {},
        communications: individualData.communications || [],
        collectionProgress: individualData.collectionProgress || {},
        scheduledActions: individualData.scheduledActions || [],
        metadata: individualData.metadata || {}
      };
      
      customer.individuals = [...customer.individuals, completeIndividualData];
      return await db.updateCustomer(customerId, customer);
    }
  },
  
  removeIndividual: async (customerId, individualId) => {
    if (config.database.mode === 'mongodb') {
      const customer = await Customer.findById(customerId);
      if (!customer) return null;
      
      customer.individuals = customer.individuals.filter(ind => ind.id !== individualId);
      return await customer.save();
    } else {
      const db = getDatabase();
      const customer = await db.findCustomerById(customerId);
      if (!customer) return null;
      
      customer.individuals = customer.individuals.filter(ind => ind.id !== individualId);
      return await db.updateCustomer(customerId, customer);
    }
  },
  
  updateIndividualStatus: async (customerId, individualId, status) => {
    if (config.database.mode === 'mongodb') {
      const customer = await Customer.findById(customerId);
      if (!customer) return null;
      
      const individual = customer.individuals.find(ind => ind.id === individualId);
      if (!individual) return null;
      
      individual.status = status;
      individual.updatedAt = new Date();
      return await customer.save();
    } else {
      const db = getDatabase();
      const customer = await db.findCustomerById(customerId);
      if (!customer) return null;
      
      const individualIndex = customer.individuals.findIndex(ind => ind.id === individualId);
      if (individualIndex === -1) return null;
      
      customer.individuals[individualIndex].status = status;
      customer.individuals[individualIndex].updatedAt = new Date();
      return await db.updateCustomer(customerId, customer);
    }
  },
  
  updateIndividualFromWebhook: async (customerId, individualId, status, progress) => {
    if (config.database.mode === 'mongodb') {
      const customer = await Customer.findById(customerId);
      if (!customer) return null;
      
      const individual = customer.individuals.find(ind => ind.id === individualId);
      if (!individual) return null;
      
      individual.status = status;
      individual.collectionProgress = {
        ...individual.collectionProgress,
        ...progress,
        lastActivityAt: new Date()
      };
      individual.updatedAt = new Date();
      
      return await customer.save();
    } else {
      const db = getDatabase();
      const customer = await db.findCustomerById(customerId);
      if (!customer) return null;
      
      const individualIndex = customer.individuals.findIndex(ind => ind.id === individualId);
      if (individualIndex === -1) return null;
      
      customer.individuals[individualIndex].status = status;
      customer.individuals[individualIndex].collectionProgress = {
        ...customer.individuals[individualIndex].collectionProgress,
        ...progress,
        lastActivityAt: new Date()
      };
      customer.individuals[individualIndex].updatedAt = new Date();
      
      return await db.updateCustomer(customerId, customer);
    }
  },
  
  addCommunication: async (customerId, individualId, communicationData) => {
    if (config.database.mode === 'mongodb') {
      const customer = await Customer.findById(customerId);
      if (!customer) return null;
      
      const individual = customer.individuals.find(ind => ind.id === individualId);
      if (!individual) return null;
      
      if (!individual.communications) {
        individual.communications = [];
      }
      
      individual.communications.push(communicationData);
      individual.updatedAt = new Date();
      
      return await customer.save();
    } else {
      const db = getDatabase();
      const customer = await db.findCustomerById(customerId);
      if (!customer) return null;
      
      const individualIndex = customer.individuals.findIndex(ind => ind.id === individualId);
      if (individualIndex === -1) return null;
      
      if (!customer.individuals[individualIndex].communications) {
        customer.individuals[individualIndex].communications = [];
      }
      
      customer.individuals[individualIndex].communications.push(communicationData);
      customer.individuals[individualIndex].updatedAt = new Date();
      
      return await db.updateCustomer(customerId, customer);
    }
  },
  
  updateCommunicationStatus: async (customerId, individualId, messageId, status) => {
    if (config.database.mode === 'mongodb') {
      const customer = await Customer.findById(customerId);
      if (!customer) return null;
      
      const individual = customer.individuals.find(ind => ind.id === individualId);
      if (!individual) return null;
      
      const communication = individual.communications.find(comm => comm.messageId === messageId);
      if (!communication) return null;
      
      communication.status = status;
      individual.updatedAt = new Date();
      
      return await customer.save();
    } else {
      const db = getDatabase();
      const customer = await db.findCustomerById(customerId);
      if (!customer) return null;
      
      const individualIndex = customer.individuals.findIndex(ind => ind.id === individualId);
      if (individualIndex === -1) return null;
      
      const communicationIndex = customer.individuals[individualIndex].communications.findIndex(
        comm => comm.messageId === messageId
      );
      if (communicationIndex === -1) return null;
      
      customer.individuals[individualIndex].communications[communicationIndex].status = status;
      customer.individuals[individualIndex].updatedAt = new Date();
      
      return await db.updateCustomer(customerId, customer);
    }
  },
  
  addScheduledAction: async (customerId, individualId, actionData) => {
    if (config.database.mode === 'mongodb') {
      const customer = await Customer.findById(customerId);
      if (!customer) return null;
      
      const individual = customer.individuals.find(ind => ind.id === individualId);
      if (!individual) return null;
      
      if (!individual.scheduledActions) {
        individual.scheduledActions = [];
      }
      
      individual.scheduledActions.push(actionData);
      individual.updatedAt = new Date();
      
      return await customer.save();
    } else {
      const db = getDatabase();
      const customer = await db.findCustomerById(customerId);
      if (!customer) return null;
      
      const individualIndex = customer.individuals.findIndex(ind => ind.id === individualId);
      if (individualIndex === -1) return null;
      
      if (!customer.individuals[individualIndex].scheduledActions) {
        customer.individuals[individualIndex].scheduledActions = [];
      }
      
      customer.individuals[individualIndex].scheduledActions.push(actionData);
      customer.individuals[individualIndex].updatedAt = new Date();
      
      return await db.updateCustomer(customerId, customer);
    }
  },
  
  updateScheduledAction: async (customerId, individualId, actionIndex, updates) => {
    if (config.database.mode === 'mongodb') {
      const customer = await Customer.findById(customerId);
      if (!customer) return null;
      
      const individual = customer.individuals.find(ind => ind.id === individualId);
      if (!individual) return null;
      
      if (!individual.scheduledActions || actionIndex >= individual.scheduledActions.length) {
        return null;
      }
      
      individual.scheduledActions[actionIndex] = {
        ...individual.scheduledActions[actionIndex],
        ...updates
      };
      individual.updatedAt = new Date();
      
      return await customer.save();
    } else {
      const db = getDatabase();
      const customer = await db.findCustomerById(customerId);
      if (!customer) return null;
      
      const individualIndex = customer.individuals.findIndex(ind => ind.id === individualId);
      if (individualIndex === -1) return null;
      
      if (!customer.individuals[individualIndex].scheduledActions ||
          actionIndex >= customer.individuals[individualIndex].scheduledActions.length) {
        return null;
      }
      
      customer.individuals[individualIndex].scheduledActions[actionIndex] = {
        ...customer.individuals[individualIndex].scheduledActions[actionIndex],
        ...updates
      };
      customer.individuals[individualIndex].updatedAt = new Date();
      
      return await db.updateCustomer(customerId, customer);
    }
  },
  
  updateContactInfo: async (customerId, individualId, contactInfo) => {
    if (config.database.mode === 'mongodb') {
      const customer = await Customer.findById(customerId);
      if (!customer) return null;
      
      const individual = customer.individuals.find(ind => ind.id === individualId);
      if (!individual) return null;
      
      individual.contactInfo = {
        ...individual.contactInfo,
        ...contactInfo
      };
      individual.updatedAt = new Date();
      
      return await customer.save();
    } else {
      const db = getDatabase();
      const customer = await db.findCustomerById(customerId);
      if (!customer) return null;
      
      const individualIndex = customer.individuals.findIndex(ind => ind.id === individualId);
      if (individualIndex === -1) return null;
      
      customer.individuals[individualIndex].contactInfo = {
        ...customer.individuals[individualIndex].contactInfo,
        ...contactInfo
      };
      customer.individuals[individualIndex].updatedAt = new Date();
      
      return await db.updateCustomer(customerId, customer);
    }
  },
  
  updateCommunicationSettings: async (customerId, settings) => {
    if (config.database.mode === 'mongodb') {
      const customer = await Customer.findById(customerId);
      if (!customer) return null;
      
      customer.communicationSettings = {
        ...customer.communicationSettings,
        ...settings
      };
      customer.updatedAt = new Date();
      
      return await customer.save();
    } else {
      const db = getDatabase();
      const customer = await db.findCustomerById(customerId);
      if (!customer) return null;
      
      customer.communicationSettings = {
        ...customer.communicationSettings,
        ...settings
      };
      customer.updatedAt = new Date();
      
      return await db.updateCustomer(customerId, customer);
    }
  },
  
  updateWebhookSettings: async (customerId, settings) => {
    if (config.database.mode === 'mongodb') {
      const customer = await Customer.findById(customerId);
      if (!customer) return null;
      
      customer.webhookSettings = {
        ...customer.webhookSettings,
        ...settings
      };
      customer.updatedAt = new Date();
      
      return await customer.save();
    } else {
      const db = getDatabase();
      const customer = await db.findCustomerById(customerId);
      if (!customer) return null;
      
      customer.webhookSettings = {
        ...customer.webhookSettings,
        ...settings
      };
      customer.updatedAt = new Date();
      
      return await db.updateCustomer(customerId, customer);
    }
  },
  
  getDueScheduledActions: async () => {
    const now = new Date();
    
    if (config.database.mode === 'mongodb') {
      // Find all customers with individuals that have scheduled actions due
      const customers = await Customer.find({
        'individuals.scheduledActions': {
          $elemMatch: {
            scheduledFor: { $lte: now },
            executed: false
          }
        }
      });
      
      // Extract the due actions
      const dueActions = [];
      customers.forEach(customer => {
        customer.individuals.forEach(individual => {
          if (individual.scheduledActions) {
            individual.scheduledActions.forEach((action, index) => {
              if (action.scheduledFor <= now && !action.executed) {
                dueActions.push({
                  customerId: customer._id,
                  individualId: individual.id,
                  actionIndex: index,
                  action
                });
              }
            });
          }
        });
      });
      
      return dueActions;
    } else {
      const db = getDatabase();
      const customers = await db.findCustomers();
      
      // Extract the due actions
      const dueActions = [];
      customers.forEach(customer => {
        customer.individuals.forEach(individual => {
          if (individual.scheduledActions) {
            individual.scheduledActions.forEach((action, index) => {
              if (new Date(action.scheduledFor) <= now && !action.executed) {
                dueActions.push({
                  customerId: customer.id,
                  individualId: individual.id,
                  actionIndex: index,
                  action
                });
              }
            });
          }
        });
      });
      
      return dueActions;
    }
  }
};