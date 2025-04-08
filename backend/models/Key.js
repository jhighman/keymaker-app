import mongoose from 'mongoose';

const keySchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    unique: true
  },
  language: {
    type: String,
    required: true
  },
  personalInfo: {
    email: Boolean,
    phone: Boolean,
    address: Boolean
  },
  consents: {
    drugTest: Boolean,
    taxForms: Boolean,
    biometric: Boolean
  },
  residenceHistory: {
    required: Boolean,
    years: Number
  },
  employmentHistory: {
    required: Boolean,
    mode: String,
    value: Number
  },
  education: Boolean,
  professionalLicense: Boolean,
  signature: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Key = mongoose.model('Key', keySchema);