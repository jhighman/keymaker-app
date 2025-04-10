# Invite

## Overview

The Invite functionality allows users to manage customers, send invitations for background checks, and track completion status. This document provides detailed information about the implementation, features, and usage of the Invite component.

## Features

### Customer Management
- Add new customers with name and collection link
- View list of existing customers
- Select customers to view and manage their individuals

### Individual Management
- Add individuals to customers with unique IDs
- Store contact information (email, phone)
- Set preferred communication channel
- Remove individuals from customers

### Communication Channels
- Email invitations
- SMS invitations
- Customizable message templates

### Status Tracking
- Track individual status through multiple states:
  - `pending`: Individual added but not invited
  - `invited`: Invitation sent but not started
  - `started`: Individual has accessed the link
  - `in_progress`: Collection process started but not completed
  - `completed`: Collection process completed
  - `expired`: Collection link has expired
  - `failed`: Collection process failed

### Link Management
- Generate unique links for each individual
- Copy links to clipboard
- Send links via preferred communication channel

## Implementation

The Invite functionality is implemented in the `Invite.jsx` component. This component uses the following structure:

### State Management
```jsx
const [customers, setCustomers] = useState([]);
const [selectedCustomer, setSelectedCustomer] = useState(null);
const [customerName, setCustomerName] = useState('');
const [showAddIndividual, setShowAddIndividual] = useState(false);
const [showSendInviteModal, setShowSendInviteModal] = useState(false);
const [individualId, setIndividualId] = useState('');
const [individualEmail, setIndividualEmail] = useState('');
const [individualPhone, setIndividualPhone] = useState('');
const [preferredChannel, setPreferredChannel] = useState('email');
```

### API Integration
The component integrates with the backend API through the `customerService`:

```jsx
// Initialize database
initializeDatabase('local');

// Fetch customers
const data = await customerService.getCustomers();

// Add customer
const savedCustomer = await customerService.createCustomer(newCustomer);

// Add individual
const updatedCustomer = await customerService.addIndividual(selectedCustomer.id, individualData);

// Send invitation
await customerService.sendInvitation(inviteCustomerId, inviteIndividualId, preferredChannel, messageText);

// Update contact info
await customerService.updateIndividualContactInfo(inviteCustomerId, inviteIndividualId, updatedContactInfo);

// Remove individual
await customerService.removeIndividual(customerId, individualId);
```

### UI Components
The component includes the following UI sections:

1. **Customer Management**
   - Input field for adding new customers
   - List of existing customers
   - Selection mechanism for customers

2. **Individual Management**
   - Button to add new individuals
   - Modal for entering individual details
   - List of individuals for selected customer

3. **Invitation Management**
   - Button to send invitations
   - Modal for configuring invitation details
   - Status display for each individual

4. **Action Buttons**
   - Copy link button
   - Send invitation button
   - Delete individual button

## Data Flow

1. **Adding a Customer**
   - User enters customer name
   - System creates customer with default link
   - Customer appears in the list

2. **Adding an Individual**
   - User selects a customer
   - User clicks "Add Individual" button
   - User enters individual ID and contact information
   - System adds individual to the customer
   - Individual appears in the list with "pending" status

3. **Sending an Invitation**
   - User selects an individual
   - User clicks "Send Invite" button
   - User configures invitation details (channel, message)
   - System sends invitation
   - System updates individual status to "invited"

4. **Tracking Status**
   - System displays current status for each individual
   - Status is color-coded for easy identification
   - User can refresh status manually

## Usage Examples

### Adding a Customer
```jsx
const handleAddCustomer = async () => {
  if (!customerName.trim()) return;

  const newCustomer = {
    name: customerName,
    link: `${endpoints.endpoints[0].url}?key=en-EPA-DTB-R5-E3-E-P-W`,
    individuals: [],
    endpoint: endpoints.endpoints[0].name
  };

  try {
    setLoading(true);
    setError(null);
    const savedCustomer = await customerService.createCustomer(newCustomer);
    setCustomers(prev => [...prev, savedCustomer]);
    setCustomerName('');
  } catch (err) {
    // Error handling
  } finally {
    setLoading(false);
  }
};
```

### Sending an Invitation
```jsx
const handleSendInviteConfirm = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Find the individual
    const customer = customers.find(c => c.id === inviteCustomerId);
    if (!customer) {
      setError('Customer not found');
      return;
    }
    
    // Create message based on channel
    let messageText = '';
    if (preferredChannel === 'email') {
      messageText = `Please complete your background check by clicking this link: ${getIndividualLink(customer.link, inviteIndividualId)}`;
    } else if (preferredChannel === 'sms') {
      messageText = `Background check required. Click to complete: ${getIndividualLink(customer.link, inviteIndividualId)}`;
    }
    
    // Send invitation
    await customerService.sendInvitation(inviteCustomerId, inviteIndividualId, preferredChannel, messageText);
    
    // Update status and show success message
    // ...
  } catch (err) {
    // Error handling
  } finally {
    setLoading(false);
  }
};
```

## Future Enhancements

As outlined in the [Future Requirements](./future-requirements.md) document, the Invite functionality will be enhanced with:

1. **Enhanced Communication Channels**
   - Support for additional channels
   - Improved templates
   - Scheduling capabilities

2. **Advanced Status Tracking**
   - Comprehensive status history
   - Real-time updates via webhooks
   - Detailed progress information

3. **Integration with Trua Collect**
   - Secure URL parameter passing
   - Webhook endpoint for status updates
   - Completion notification handling

4. **Automation and Scheduling**
   - Scheduled reminders
   - Expiration handling
   - Automated follow-ups

5. **Reporting and Analytics**
   - Completion rate tracking
   - Time-to-completion metrics
   - Export capabilities

## Related Documentation

- [Use Cases](./use-cases.md) - Overview of all use cases including Invite
- [Components](./components.md) - Information about the Invite component
- [Future Requirements](./future-requirements.md) - Planned enhancements for Invite
- [API Contract](./api-contract.md) - API endpoints for customer and individual management
- [Sequence Diagrams](./sequence-diagrams.md) - Flow diagrams for invitation and tracking processes