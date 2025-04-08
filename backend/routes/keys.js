import express from 'express';
import { keyRepository } from '../repositories/keyRepository.js';

const router = express.Router();

// Get all keys
router.get('/', async (req, res) => {
  try {
    const keys = await keyRepository.findAll();
    res.json(keys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get key by ID
router.get('/:id', async (req, res) => {
  try {
    const key = await keyRepository.findById(req.params.id);
    if (!key) return res.status(404).json({ message: 'Key not found' });
    res.json(key);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create key
router.post('/', async (req, res) => {
  try {
    const key = await keyRepository.create(req.body);
    res.status(201).json(key);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update key
router.put('/:id', async (req, res) => {
  try {
    const key = await keyRepository.update(req.params.id, req.body);
    if (!key) return res.status(404).json({ message: 'Key not found' });
    res.json(key);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete key
router.delete('/:id', async (req, res) => {
  try {
    const key = await keyRepository.delete(req.params.id);
    if (!key) return res.status(404).json({ message: 'Key not found' });
    res.json({ message: 'Key deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;