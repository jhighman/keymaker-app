const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const keyService = {
  getKeys: async () => {
    const response = await fetch(`${API_URL}/keys`);
    if (!response.ok) throw new Error('Failed to fetch keys');
    return response.json();
  },
  
  getKey: async (id) => {
    const response = await fetch(`${API_URL}/keys/${id}`);
    if (!response.ok) throw new Error('Failed to fetch key');
    return response.json();
  },
  
  createKey: async (keyData) => {
    const response = await fetch(`${API_URL}/keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(keyData)
    });
    if (!response.ok) throw new Error('Failed to create key');
    return response.json();
  },
  
  updateKey: async (id, keyData) => {
    const response = await fetch(`${API_URL}/keys/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(keyData)
    });
    if (!response.ok) throw new Error('Failed to update key');
    return response.json();
  },
  
  deleteKey: async (id) => {
    const response = await fetch(`${API_URL}/keys/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete key');
    return response.json();
  }
};

export const customerService = {
  getCustomers: async () => {
    const response = await fetch(`${API_URL}/customers`);
    if (!response.ok) throw new Error('Failed to fetch customers');
    return response.json();
  },
  
  getCustomer: async (id) => {
    const response = await fetch(`${API_URL}/customers/${id}`);
    if (!response.ok) throw new Error('Failed to fetch customer');
    return response.json();
  },
  
  createCustomer: async (customerData) => {
    const response = await fetch(`${API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    });
    if (!response.ok) throw new Error('Failed to create customer');
    return response.json();
  },
  
  updateCustomer: async (id, customerData) => {
    const response = await fetch(`${API_URL}/customers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    });
    if (!response.ok) throw new Error('Failed to update customer');
    return response.json();
  },
  
  deleteCustomer: async (id) => {
    const response = await fetch(`${API_URL}/customers/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete customer');
    return response.json();
  },
  
  addIndividual: async (customerId, individualData) => {
    const response = await fetch(`${API_URL}/customers/${customerId}/individuals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(individualData)
    });
    if (!response.ok) throw new Error('Failed to add individual');
    return response.json();
  },
  
  removeIndividual: async (customerId, individualId) => {
    const response = await fetch(`${API_URL}/customers/${customerId}/individuals/${individualId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to remove individual');
    return response.json();
  },
  
  updateIndividualStatus: async (customerId, individualId, status) => {
    const response = await fetch(`${API_URL}/customers/${customerId}/individuals/${individualId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update individual status');
    return response.json();
  }
};