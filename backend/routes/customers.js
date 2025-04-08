import express from 'express';
import { customerRepository } from '../repositories/customerRepository.js';

const router = express.Router();

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await customerRepository.findAll();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await customerRepository.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create customer
router.post('/', async (req, res) => {
  try {
    const customer = await customerRepository.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const customer = await customerRepository.update(req.params.id, req.body);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const customer = await customerRepository.delete(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add individual to customer
router.post('/:id/individuals', async (req, res) => {
  try {
    const customer = await customerRepository.addIndividual(req.params.id, req.body);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove individual from customer
router.delete('/:id/individuals/:individualId', async (req, res) => {
  try {
    const customer = await customerRepository.removeIndividual(req.params.id, req.params.individualId);
    if (!customer) return res.status(404).json({ message: 'Customer or individual not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update individual status
router.patch('/:id/individuals/:individualId/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });
    
    const customer = await customerRepository.updateIndividualStatus(
      req.params.id, 
      req.params.individualId, 
      status
    );
    
    if (!customer) return res.status(404).json({ message: 'Customer or individual not found' });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;