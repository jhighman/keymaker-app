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
      
      customer.individuals.push(individualData);
      return await customer.save();
    } else {
      const db = getDatabase();
      const customer = await db.findCustomerById(customerId);
      if (!customer) return null;
      
      customer.individuals = [...customer.individuals, individualData];
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
      return await customer.save();
    } else {
      const db = getDatabase();
      const customer = await db.findCustomerById(customerId);
      if (!customer) return null;
      
      const individualIndex = customer.individuals.findIndex(ind => ind.id === individualId);
      if (individualIndex === -1) return null;
      
      customer.individuals[individualIndex].status = status;
      return await db.updateCustomer(customerId, customer);
    }
  }
};