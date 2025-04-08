import { config } from '../config.js';
import { Key } from '../models/Key.js';
import { getDatabase } from '../database/connection.js';

export const keyRepository = {
  findAll: async () => {
    if (config.database.mode === 'mongodb') {
      return await Key.find();
    } else {
      const db = getDatabase();
      return await db.findKeys();
    }
  },
  
  findById: async (id) => {
    if (config.database.mode === 'mongodb') {
      return await Key.findById(id);
    } else {
      const db = getDatabase();
      return await db.findKeyById(id);
    }
  },
  
  create: async (keyData) => {
    if (config.database.mode === 'mongodb') {
      const key = new Key(keyData);
      return await key.save();
    } else {
      const db = getDatabase();
      return await db.createKey(keyData);
    }
  },
  
  update: async (id, keyData) => {
    if (config.database.mode === 'mongodb') {
      return await Key.findByIdAndUpdate(id, keyData, { new: true });
    } else {
      const db = getDatabase();
      return await db.updateKey(id, keyData);
    }
  },
  
  delete: async (id) => {
    if (config.database.mode === 'mongodb') {
      return await Key.findByIdAndDelete(id);
    } else {
      const db = getDatabase();
      return await db.deleteKey(id);
    }
  }
};