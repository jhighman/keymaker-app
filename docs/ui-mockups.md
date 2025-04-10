# UI Mockups: Enhanced Invite

## Overview
This document provides UI mockups for the enhanced Invite functionality. These mockups illustrate the user interface for the new features described in the future requirements document.
This document provides UI mockups for the enhanced Invite and Track functionality. These mockups illustrate the user interface for the new features described in the future requirements document.
## 1. Main Invite Dashboard
## 1. Main Invite and Track Dashboard

```mermaid
graph TD
    subgraph Header
        Title["INVITE AND TRACK"]
        Description["Manage collection invites and track completion status"]
    end
    
    subgraph LeftPanel["Customers Panel"]
        CustomerInput["Enter customer name"]
        AddCustomerButton["+ Add Customer"]
        CustomerList["Customer List"]
        Customer1["• Acme Corporation (5)"]
        Customer2["• TechStart Inc (3)"]
        Customer3["• Global Services (0)"]
        
        CustomerInput --> AddCustomerButton
        AddCustomerButton --> CustomerList
        CustomerList --> Customer1
        CustomerList --> Customer2
        CustomerList --> Customer3
    end
    
    subgraph RightPanel["Customer Details"]
        CustomerHeader["CUSTOMER DETAILS: Acme Corporation"]
        AddIndividualButton["+ Add Individual"]
        
        IndividualSection["INDIVIDUALS (5)"]
        
        Individual1["john.doe@example.com<br>Status: Completed<br>[Copy Link] [Send] [Delete]"]
        Individual2["sarah.smith@example.com<br>Status: In Progress (2/5 steps)<br>[Copy Link] [Send] [Delete]"]
        Individual3["mike.jones@example.com<br>Status: Invited (not started)<br>[Copy Link] [Send] [Delete]"]
        
        CustomerHeader --> AddIndividualButton
        CustomerHeader --> IndividualSection
        IndividualSection --> Individual1
        IndividualSection --> Individual2
        IndividualSection --> Individual3
    end
    
    Customer1 --> CustomerHeader
```

## 2. Add Individual Modal with Enhanced Options

```mermaid
graph TD
    subgraph AddIndividualModal["ADD INDIVIDUAL"]
        EmailField["Email Address<br>john.doe@example.com"]
        PhoneField["Phone Number (optional)<br>+1 (555) 123-4567"]
        ChannelField["Preferred Communication Channel<br>Email ▼"]
        
        SendOptions["Send Invitation Immediately<br>○ Yes<br>● No, schedule for later"]
        
        ScheduleSection["Schedule Date and Time<br>04/15/2025 ▼ | 10:00 AM ▼"]
        
        ReminderSection["Reminder Settings<br>[✓] Send reminder if not completed<br>Frequency: Every [3] days<br>Maximum reminders: [5]"]
        
        ExpirationSection["Expiration<br>[✓] Set expiration date<br>Expire after [30] days"]
        
        ButtonSection["[Cancel] [Add Individual]"]
        
        EmailField --> PhoneField
        PhoneField --> ChannelField
        ChannelField --> SendOptions
        SendOptions --> ScheduleSection
        ScheduleSection --> ReminderSection
        ReminderSection --> ExpirationSection
        ExpirationSection --> ButtonSection
    end
```

## 3. Individual Detail View with Status Tracking

```mermaid
graph TD
    subgraph Header
        Title["INDIVIDUAL DETAILS"]
        Email["john.doe@example.com"]
    end
    
    subgraph LeftPanel["Contact Information"]
        ContactInfo["Email: john.doe@example.com<br>Phone: +1 (555) 123-4567<br>Preferred Channel: Email"]
        EditButton["Edit Contact Info"]
        
        CommunicationHistory["COMMUNICATION HISTORY<br>Apr 8, 2025 9:00 AM<br>Initial invitation (Email)<br>Status: Delivered<br><br>Apr 9, 2025 9:00 AM<br>Reminder #1 (Email)<br>Status: Delivered"]
        SendButton["Send New Communication"]
        
        ScheduledActions["SCHEDULED ACTIONS<br>Apr 12, 2025 9:00 AM<br>Reminder #2<br>Channel: Email"]
        EditScheduleButton["Edit Schedule"]
        
        ContactInfo --> EditButton
        ContactInfo --> CommunicationHistory
        CommunicationHistory --> SendButton
        CommunicationHistory --> ScheduledActions
        ScheduledActions --> EditScheduleButton
    end
    
    subgraph RightPanel["Collection Progress"]
        StatusInfo["Status: In Progress<br>Started: Apr 8, 2025 10:15 AM<br>Last Activity: Apr 9, 2025 2:30 PM<br>Progress: 3/5 steps completed (60%)"]
        
        Steps["[✓] Consent Form<br>[✓] Personal Information<br>[✓] Identity Verification<br>[ ] Document Upload<br>[ ] Signature"]
        RefreshButton["Refresh Status"]
        
        LinkSection["COLLECTION LINK<br>https://collect.trua.me/start?token=...<br>Created: Apr 8, 2025<br>Expires: May 8, 2025"]
        LinkButtons["[Copy Link] [Regenerate Link]"]
        
        StatusInfo --> Steps
        Steps --> RefreshButton
        RefreshButton --> LinkSection
        LinkSection --> LinkButtons
    end
    
    subgraph Actions
        ActionButtons["[Send Reminder Now] [View Collection Data] [Delete Individual]"]
    end
    
    LeftPanel --> Actions
    RightPanel --> Actions
```

## 4. Communication Template Editor

```mermaid
graph TD
    subgraph TemplateEditor["COMMUNICATION TEMPLATE"]
        TemplateName["Template Name<br>Initial Invitation"]
        ChannelSelect["Channel<br>Email ▼"]
        Subject["Subject<br>Background Check Information Required"]
        
        MessageContent["Message Content<br>Dear {{individual.name}},<br><br>{{customer.name}} has requested that you complete a<br>background check as part of their onboarding process.<br><br>Please click the link below to provide the required<br>information:<br><br>{{collection.link}}<br><br>This link will expire on {{collection.expiryDate}}.<br><br>Thank you,<br>{{customer.name}} Team"]
        
        Variables["Available Variables<br>{{individual.name}} - Individual's name<br>{{individual.email}} - Individual's email<br>{{customer.name}} - Customer name<br>{{collection.link}} - Collection link<br>{{collection.expiryDate}} - Link expiration date"]
        
        Buttons["[Cancel] [Test Send] [Save as Draft] [Save Template]"]
        
        TemplateName --> ChannelSelect
        ChannelSelect --> Subject
        Subject --> MessageContent
        MessageContent --> Variables
        Variables --> Buttons
    end
```

## 5. Analytics Dashboard

```mermaid
graph TD
    subgraph Header
        Title["ANALYTICS DASHBOARD"]
        Subtitle["Collection Performance"]
    end
    
    subgraph TopRow
        subgraph CompletionRate["COMPLETION RATE"]
            Rate["75%"]
            Target["Target: 80%<br>Previous Month: 68%"]
        end
        
        subgraph CompletionTime["COMPLETION TIME"]
            AvgTime["Average: 2.3 days"]
            TimeRange["Fastest: 0.5 days<br>Slowest: 12 days"]
        end
    end
    
    subgraph BottomRow
        subgraph StatusBreakdown["STATUS BREAKDOWN"]
            StatusChart["Completed: 75%<br>In Progress: 15%<br>Not Started: 5%<br>Expired: 5%"]
            TotalCount["Total Invitations: 120"]
        end
        
        subgraph CommunicationEffectiveness["COMMUNICATION EFFECTIVENESS"]
            ChannelStats["Channel | Open Rate | Completion<br>Email | 85% | 72%<br>SMS | 92% | 78%"]
        end
    end
    
    subgraph Filters
        FilterOptions["Date Range: [Last 30 Days ▼] Customer: [All Customers ▼]"]
        ExportButton["Export Report"]
    end
    
    Header --> TopRow
    TopRow --> BottomRow
    BottomRow --> Filters
```
These Mermaid diagrams provide a visual representation of the enhanced Invite functionality, including the new features for communication management, status tracking, and analytics. They serve as a guide for the implementation of the user interface and user experience for the enhanced system.
These Mermaid diagrams provide a visual representation of the enhanced Invite and Track functionality, including the new features for communication management, status tracking, and analytics. They serve as a guide for the implementation of the user interface and user experience for the enhanced system.