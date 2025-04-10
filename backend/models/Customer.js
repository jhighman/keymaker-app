import mongoose from 'mongoose';

const communicationSchema = new mongoose.Schema({
  channel: {
    type: String,
    enum: ['email', 'sms', 'other'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'failed', 'opened'],
    required: true
  },
  messageId: String,
  errorDetails: String
});

const scheduledActionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['reminder', 'expiration_notice', 'follow_up'],
    required: true
  },
  scheduledFor: {
    type: Date,
    required: true
  },
  executed: {
    type: Boolean,
    default: false
  },
  executedAt: Date
});

const collectionProgressSchema = new mongoose.Schema({
  startedAt: Date,
  lastActivityAt: Date,
  completedAt: Date,
  currentStep: String,
  completedSteps: [String],
  totalSteps: Number,
  percentComplete: Number
});

const individualSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'invited', 'started', 'in_progress', 'completed', 'expired', 'failed'],
    default: 'pending'
  },
  contactInfo: {
    email: String,
    phone: String,
    preferredChannel: {
      type: String,
      enum: ['email', 'sms', 'other'],
      default: 'email'
    }
  },
  communications: [communicationSchema],
  collectionProgress: collectionProgressSchema,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  scheduledActions: [scheduledActionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const communicationSettingsSchema = new mongoose.Schema({
  emailTemplate: String,
  smsTemplate: String,
  reminderFrequency: {
    type: Number,
    default: 7 // days
  },
  maxReminders: {
    type: Number,
    default: 3
  },
  expirationPeriod: {
    type: Number,
    default: 30 // days
  }
});

const webhookSettingsSchema = new mongoose.Schema({
  url: String,
  secret: String,
  events: [String]
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
  communicationSettings: {
    type: communicationSettingsSchema,
    default: () => ({})
  },
  webhookSettings: {
    type: webhookSettingsSchema,
    default: () => ({})
  },
  individuals: [individualSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add pre-save middleware to update the updatedAt field
customerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add pre-save middleware for individuals to update their updatedAt field
individualSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Customer = mongoose.model('Customer', customerSchema);