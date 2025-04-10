# Future Requirements and Design
## Invite Enhancement
## Invite and Track Enhancement

### Overview
The Invite functionality will be enhanced to support multiple communication channels, improved status tracking, and integration with the Trua Collect application. This document outlines the requirements, data model, use cases, and design artifacts for this enhancement.
The Invite and Track functionality will be enhanced to support multiple communication channels, improved status tracking, and integration with the Trua Collect application. This document outlines the requirements, data model, use cases, and design artifacts for this enhancement.

## Requirements

### Communication Channels

1. **Multiple Channel Support**
   - Email communication
   - SMS messaging
   - Future support for other OTP (One-Time Password) messaging systems

2. **Invitation Management**
   - Ability to send initial invitations
   - Support for resending invitations
   - Scheduling of invitations
   - Tracking of all communication attempts

3. **Status Tracking**
   - Real-time status updates from Trua Collect
   - Comprehensive status history
   - Status notifications and alerts
   - Status reporting and analytics

4. **Integration with Trua Collect**
   - Secure URL parameter passing
   - Webhook endpoint for status updates
   - Completion notification handling
   - Error handling and recovery

## Data Model

### Enhanced Individual Schema

```javascript
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
  communications: [{
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
  }],
  collectionProgress: {
    startedAt: Date,
    lastActivityAt: Date,
    completedAt: Date,
    currentStep: String,
    completedSteps: [String],
    totalSteps: Number
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  scheduledActions: [{
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
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
```

### Enhanced Customer Schema

```javascript
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
    emailTemplate: String,
    smsTemplate: String,
    reminderFrequency: Number, // in days
    maxReminders: Number,
    expirationPeriod: Number // in days
  },
  webhookSettings: {
    url: String,
    secret: String,
    events: [String]
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
```

## Use Cases

### 1. Send Invitation

**Primary Actor**: Customer Administrator

**Preconditions**:
- Customer exists in the system
- Individual is added to the customer

**Main Flow**:
1. Administrator selects an individual from the customer's list
2. Administrator chooses the communication channel (email or SMS)
3. Administrator customizes the invitation message (optional)
4. System sends the invitation with a unique link to the individual
5. System records the communication attempt
6. System updates the individual's status to "invited"
7. System schedules follow-up reminders based on customer settings

**Alternative Flows**:
- If sending fails, system records the failure and allows retry
- If individual has no contact information for the selected channel, system prompts for it

### 2. Resend Invitation

**Primary Actor**: Customer Administrator

**Preconditions**:
- Individual has been previously invited
- Individual has not completed the collection process

**Main Flow**:
1. Administrator selects an individual with a previous invitation
2. Administrator chooses to resend the invitation
3. Administrator selects the communication channel
4. Administrator customizes the message (optional)
5. System sends the invitation with the same unique link
6. System records the new communication attempt
7. System resets or extends any expiration timers

**Alternative Flows**:
- If sending fails, system records the failure and allows retry
- If individual has completed some steps, system sends a continuation link

### 3. Track Collection Progress

**Primary Actor**: Customer Administrator

**Preconditions**:
- Individual has been invited
- Individual has started the collection process

**Main Flow**:
1. System receives status updates from Trua Collect via webhook
2. System updates the individual's status and progress information
3. Administrator views the individual's current status and progress
4. System displays detailed information about completed and pending steps
5. System shows timeline of all communications and status changes

**Alternative Flows**:
- If webhook fails, system allows manual status update
- If collection stalls, system highlights individuals requiring attention

### 4. Handle Collection Completion

**Primary Actor**: System

**Preconditions**:
- Individual has completed all collection steps in Trua Collect

**Main Flow**:
1. Trua Collect sends a completion notification to the webhook endpoint
2. System verifies the notification authenticity
3. System updates the individual's status to "completed"
4. System records completion timestamp and details
5. System sends confirmation to the administrator (optional)
6. System triggers any integration workflows (e.g., data export)

**Alternative Flows**:
- If verification fails, system flags the notification for review
- If completion has issues, system marks as "completed with issues"

### 5. Manage Scheduled Actions

**Primary Actor**: System

**Preconditions**:
- Individuals have pending scheduled actions

**Main Flow**:
1. System regularly checks for due scheduled actions
2. For each due action, system performs the appropriate action (e.g., send reminder)
3. System marks the action as executed
4. System records the execution timestamp
5. System schedules next actions as needed

**Alternative Flows**:
- If action execution fails, system retries based on configuration
- If maximum reminders reached, system updates status accordingly

## Design Artifacts

### 1. Component Design
#### Enhanced Invite Component
#### Enhanced InviteAndTrack Component

```jsx
const Invite = () => {
  // State for customers, selected customer, etc.
  
  // New state for communication channels and templates
  const [communicationChannel, setCommunicationChannel] = useState('email');
  const [messageTemplate, setMessageTemplate] = useState('default');
  const [customMessage, setCustomMessage] = useState('');
  
  // New state for scheduling
  const [scheduleDate, setScheduleDate] = useState(null);
  const [reminderFrequency, setReminderFrequency] = useState(7); // days
  
  // Functions for sending invitations
  const handleSendInvite = async (customerId, individualId) => {
    // Implementation for sending invitation
  };
  
  const handleResendInvite = async (customerId, individualId) => {
    // Implementation for resending invitation
  };
  
  const handleScheduleInvite = async (customerId, individualId) => {
    // Implementation for scheduling invitation
  };
  
  // Functions for tracking
  const handleRefreshStatus = async (customerId, individualId) => {
    // Implementation for manually refreshing status
  };
  
  // UI components
  return (
    <Container>
      {/* Existing UI components */}
      
      {/* New UI components for enhanced functionality */}
      <CommunicationPanel>
        {/* Channel selection, templates, scheduling */}
      </CommunicationPanel>
      
      <StatusTrackingPanel>
        {/* Detailed status tracking, progress visualization */}
      </StatusTrackingPanel>
      
      <SchedulingPanel>
        {/* Scheduling options, reminder configuration */}
      </SchedulingPanel>
    </Container>
  );
};
```

### 2. API Design

#### New Endpoints

```javascript
// routes/customers.js

// Send invitation
router.post('/api/customers/:id/individuals/:individualId/invite', async (req, res) => {
  const { id, individualId } = req.params;
  const { channel, message, scheduleDate } = req.body;
  
  try {
    const result = await customerService.sendInvitation(id, individualId, channel, message, scheduleDate);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get individual status history
router.get('/api/customers/:id/individuals/:individualId/history', async (req, res) => {
  const { id, individualId } = req.params;
  
  try {
    const history = await customerService.getIndividualHistory(id, individualId);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint for Trua Collect
router.post('/api/webhook/collect', async (req, res) => {
  const { customerId, individualId, status, progress } = req.body;
  
  try {
    await customerService.updateIndividualFromWebhook(customerId, individualId, status, progress);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

### 3. Service Design

#### Enhanced Customer Service

```javascript
// services/customerService.js

export const customerService = {
  // Existing methods...
  
  sendInvitation: async (customerId, individualId, channel, message, scheduleDate) => {
    // Implementation for sending invitation
  },
  
  resendInvitation: async (customerId, individualId, channel, message) => {
    // Implementation for resending invitation
  },
  
  getIndividualHistory: async (customerId, individualId) => {
    // Implementation for getting individual history
  },
  
  updateIndividualFromWebhook: async (customerId, individualId, status, progress) => {
    // Implementation for updating individual from webhook
  },
  
  processScheduledActions: async () => {
    // Implementation for processing scheduled actions
  }
};
```

### 4. Integration Design

#### Trua Collect Integration

```javascript
// services/truaCollectService.js

export const truaCollectService = {
  generateCollectLink: (customer, individual) => {
    const baseUrl = 'https://collect.trua.me';
    const params = new URLSearchParams({
      customerId: customer.id,
      individualId: individual.id,
      key: customer.link.split('?key=')[1],
      returnUrl: `${config.apiBaseUrl}/webhook/collect`
    });
    
    return `${baseUrl}?${params.toString()}`;
  },
  
  verifyWebhookSignature: (payload, signature, secret) => {
    // Implementation for verifying webhook signature
  },
  
  parseWebhookPayload: (payload) => {
    // Implementation for parsing webhook payload
  }
};
```

## Implementation Plan

### Phase 1: Enhanced Data Model

1. Update MongoDB schemas for Customer and Individual
2. Migrate existing data to new schema
3. Update repository methods to support new fields
4. Add validation for new fields

### Phase 2: Communication Channels

1. Implement email sending functionality
2. Implement SMS sending functionality
3. Create templates for different communication types
4. Add UI for channel selection and message customization

### Phase 3: Status Tracking

1. Implement webhook endpoint for Trua Collect
2. Create status history tracking
3. Develop UI for viewing detailed status information
4. Implement status notifications

### Phase 4: Scheduling and Automation

1. Implement scheduled actions
2. Create background job for processing scheduled actions
3. Add UI for configuring reminders and follow-ups
4. Implement expiration handling

### Phase 5: Reporting and Analytics

1. Develop reporting dashboard
2. Implement analytics for tracking completion rates
3. Create export functionality for reports
4. Add visualization for tracking progress

## Conclusion
The enhanced Invite functionality will provide a comprehensive solution for managing the background check collection process. By supporting multiple communication channels, improved status tracking, and integration with Trua Collect, the system will streamline the process for both administrators and individuals.
The enhanced Invite and Track functionality will provide a comprehensive solution for managing the background check collection process. By supporting multiple communication channels, improved status tracking, and integration with Trua Collect, the system will streamline the process for both administrators and individuals.

The implementation will follow a phased approach, starting with the enhanced data model and gradually adding more functionality. This approach will allow for incremental testing and validation of each component before moving on to the next phase.