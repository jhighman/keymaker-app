import { customerRepository } from './repositories/customerRepository.js';
import { config } from './config.js';
import { connectToDatabase } from './database/connection.js';

// Function to process due actions
async function processDueActions() {
  console.log('Processing scheduled actions...');
  
  try {
    // Get all due actions
    const dueActions = await customerRepository.getDueScheduledActions();
    console.log(`Found ${dueActions.length} due actions`);
    
    // Process each action
    for (const action of dueActions) {
      console.log(`Processing action for individual ${action.individualId} of customer ${action.customerId}`);
      
      try {
        // Mark action as executed
        await customerRepository.updateScheduledAction(
          action.customerId,
          action.individualId,
          action.actionIndex,
          { executed: true, executedAt: new Date() }
        );
        
        // Process based on action type
        switch (action.action.type) {
          case 'reminder':
            await sendReminder(action);
            break;
          case 'expiration_notice':
            await sendExpirationNotice(action);
            break;
          case 'follow_up':
            await sendFollowUp(action);
            break;
          default:
            console.log(`Unknown action type: ${action.action.type}`);
        }
      } catch (error) {
        console.error(`Error processing action for individual ${action.individualId}:`, error);
      }
    }
    
    console.log('Finished processing scheduled actions');
  } catch (error) {
    console.error('Error processing scheduled actions:', error);
  }
}

// Function to send a reminder
async function sendReminder(action) {
  console.log(`Sending reminder to individual ${action.individualId}`);
  
  try {
    // Get the customer and individual
    const customer = await customerRepository.findById(action.customerId);
    if (!customer) {
      console.error(`Customer ${action.customerId} not found`);
      return;
    }
    
    const individual = customer.individuals.find(ind => ind.id === action.individualId);
    if (!individual) {
      console.error(`Individual ${action.individualId} not found`);
      return;
    }
    
    // Determine channel
    const channel = individual.contactInfo?.preferredChannel || 'email';
    
    // Create message
    let messageText = '';
    if (channel === 'email') {
      messageText = `Reminder: Please complete your background check by clicking this link: ${getIndividualLink(customer, individual)}`;
    } else if (channel === 'sms') {
      messageText = `Reminder: Background check required. Click to complete: ${getIndividualLink(customer, individual)}`;
    }
    
    // Add communication record
    await customerRepository.addCommunication(
      action.customerId,
      action.individualId,
      {
        channel,
        status: 'sent',
        messageId: `msg_${Date.now()}`,
        message: messageText
      }
    );
    
    // Schedule next reminder if needed
    const reminderFrequency = customer.communicationSettings?.reminderFrequency || 7; // days
    const maxReminders = customer.communicationSettings?.maxReminders || 3;
    
    // Count existing reminders
    const reminderCount = (individual.communications || [])
      .filter(comm => comm.message && comm.message.startsWith('Reminder:'))
      .length;
    
    if (reminderCount < maxReminders) {
      const nextReminderDate = new Date();
      nextReminderDate.setDate(nextReminderDate.getDate() + reminderFrequency);
      
      await customerRepository.addScheduledAction(
        action.customerId,
        action.individualId,
        {
          type: 'reminder',
          scheduledFor: nextReminderDate
        }
      );
      
      console.log(`Scheduled next reminder for ${nextReminderDate}`);
    } else {
      console.log(`Maximum reminders (${maxReminders}) reached for individual ${action.individualId}`);
    }
  } catch (error) {
    console.error(`Error sending reminder to individual ${action.individualId}:`, error);
  }
}

// Function to send an expiration notice
async function sendExpirationNotice(action) {
  console.log(`Sending expiration notice to individual ${action.individualId}`);
  
  try {
    // Get the customer and individual
    const customer = await customerRepository.findById(action.customerId);
    if (!customer) {
      console.error(`Customer ${action.customerId} not found`);
      return;
    }
    
    const individual = customer.individuals.find(ind => ind.id === action.individualId);
    if (!individual) {
      console.error(`Individual ${action.individualId} not found`);
      return;
    }
    
    // Determine channel
    const channel = individual.contactInfo?.preferredChannel || 'email';
    
    // Create message
    let messageText = '';
    if (channel === 'email') {
      messageText = `Your background check link will expire soon. Please complete it by clicking this link: ${getIndividualLink(customer, individual)}`;
    } else if (channel === 'sms') {
      messageText = `Your background check link will expire soon. Click to complete: ${getIndividualLink(customer, individual)}`;
    }
    
    // Add communication record
    await customerRepository.addCommunication(
      action.customerId,
      action.individualId,
      {
        channel,
        status: 'sent',
        messageId: `msg_${Date.now()}`,
        message: messageText
      }
    );
    
    // Update status to expired after expiration date
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1); // Expire in 1 day
    
    await customerRepository.addScheduledAction(
      action.customerId,
      action.individualId,
      {
        type: 'expire',
        scheduledFor: expirationDate
      }
    );
  } catch (error) {
    console.error(`Error sending expiration notice to individual ${action.individualId}:`, error);
  }
}

// Function to send a follow-up
async function sendFollowUp(action) {
  console.log(`Sending follow-up to individual ${action.individualId}`);
  
  try {
    // Get the customer and individual
    const customer = await customerRepository.findById(action.customerId);
    if (!customer) {
      console.error(`Customer ${action.customerId} not found`);
      return;
    }
    
    const individual = customer.individuals.find(ind => ind.id === action.individualId);
    if (!individual) {
      console.error(`Individual ${action.individualId} not found`);
      return;
    }
    
    // Determine channel
    const channel = individual.contactInfo?.preferredChannel || 'email';
    
    // Create message
    let messageText = '';
    if (channel === 'email') {
      messageText = `Follow-up: We noticed you started but didn't complete your background check. Please finish by clicking this link: ${getIndividualLink(customer, individual)}`;
    } else if (channel === 'sms') {
      messageText = `Follow-up: Please complete your background check: ${getIndividualLink(customer, individual)}`;
    }
    
    // Add communication record
    await customerRepository.addCommunication(
      action.customerId,
      action.individualId,
      {
        channel,
        status: 'sent',
        messageId: `msg_${Date.now()}`,
        message: messageText
      }
    );
  } catch (error) {
    console.error(`Error sending follow-up to individual ${action.individualId}:`, error);
  }
}

// Helper function to get individual link
function getIndividualLink(customer, individual) {
  return `${customer.link}&puid=${individual.id}`;
}

// Connect to database and start processing
async function start() {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Process due actions
    await processDueActions();
    
    // Exit process
    process.exit(0);
  } catch (error) {
    console.error('Error in scheduler:', error);
    process.exit(1);
  }
}

// Start the scheduler
start();