# Sequence Diagrams
## Invite Process Flow
## Invite and Track Process Flow

The following sequence diagrams illustrate the interaction between the KeyMaker application, Trua Collect, and the individual during the invitation and collection process.

### 1. Invitation and Collection Process

```mermaid
sequenceDiagram
    participant Admin as Administrator
    participant KeyMaker as KeyMaker (Invite)
    participant TruaCollect as Trua Collect
    participant Individual as Individual

    Admin->>KeyMaker: Add Individual
    Admin->>KeyMaker: Select Communication Channel
    Admin->>KeyMaker: Send Invitation
    KeyMaker->>TruaCollect: Generate Unique Link
    TruaCollect-->>KeyMaker: Return Link
    KeyMaker->>Individual: Send Invitation with Link
    KeyMaker->>KeyMaker: Record Communication Attempt
    Individual->>TruaCollect: Access Link
    Individual->>TruaCollect: Start Collection
    TruaCollect->>KeyMaker: Update Status (Started)
    KeyMaker-->>Admin: View Status
    Individual->>TruaCollect: Complete Collection
    TruaCollect->>KeyMaker: Update Status (Completed)
    KeyMaker-->>Admin: View Completion
```

### 2. Resend Invitation Process

```mermaid
sequenceDiagram
    participant Admin as Administrator
    participant KeyMaker as KeyMaker (Invite)
    participant Individual as Individual

    Admin->>KeyMaker: Select Individual
    Admin->>KeyMaker: View Status History
    KeyMaker-->>Admin: Status History
    Admin->>KeyMaker: Resend Invitation
    KeyMaker->>Individual: Resend Invitation
    KeyMaker->>KeyMaker: Record Resend Attempt
    KeyMaker-->>Admin: Confirmation
```

### 3. Webhook Status Update Process

```mermaid
sequenceDiagram
    participant TruaCollect as Trua Collect
    participant Webhook as KeyMaker Webhook Endpoint
    participant Database as KeyMaker Database
    participant Admin as Administrator

    TruaCollect->>Webhook: Status Update (individualId, status, progress)
    Webhook->>Webhook: Verify Signature
    Webhook->>Database: Update Individual Status
    Database-->>Webhook: Confirmation
    Webhook-->>TruaCollect: 200 OK
    Admin->>Database: View Updated Status
    Database-->>Admin: Status Information
```

### 4. Scheduled Reminder Process

```mermaid
sequenceDiagram
    participant Scheduler as KeyMaker Scheduler
    participant Database as KeyMaker Database
    participant CommService as Communication Service
    participant Individual as Individual

    Scheduler->>Database: Check for Scheduled Actions
    Database-->>Scheduler: Return Due Actions
    Scheduler->>CommService: Process Reminder Action
    CommService->>Individual: Send Reminder
    Individual-->>CommService: Delivery Status
    Scheduler->>Database: Update Action Status
    Scheduler->>Database: Schedule Next Action
    Database-->>Scheduler: Confirmation
```

### 5. Entity Relationship Diagram

```mermaid
erDiagram
    CUSTOMER ||--o{ INDIVIDUAL : has
    CUSTOMER {
        string id
        string name
        string link
        string endpoint
        object communicationSettings
        object webhookSettings
        date createdAt
        date updatedAt
    }
    INDIVIDUAL {
        string id
        string status
        object contactInfo
        array communications
        object collectionProgress
        object metadata
        array scheduledActions
        date createdAt
        date updatedAt
    }
    COMMUNICATION_TEMPLATE ||--o{ CUSTOMER : uses
    COMMUNICATION_TEMPLATE {
        string id
        string name
        string channel
        string subject
        string content
        date createdAt
        date updatedAt
    }
    KEY ||--o{ CUSTOMER : associates
    KEY {
        string value
        string language
        object personalInfo
        object consents
        object residenceHistory
        object employmentHistory
        boolean education
        boolean professionalLicense
        string signature
        date createdAt
    }
```

These Mermaid diagrams illustrate the key interactions between the different components of the system during the invitation and collection process, as well as the data relationships. They provide a visual representation of the data flow and the responsibilities of each component.