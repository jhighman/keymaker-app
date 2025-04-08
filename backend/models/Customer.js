import mongoose from 'mongoose';

const individualSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'expired'],
    default: 'pending'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  endpoint: {
    type: String,
    required: true
  },
  individuals: [individualSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Customer = mongoose.model('Customer', customerSchema);