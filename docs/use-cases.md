# KeyMaker Use Cases

## Overview

The KeyMaker application implements three primary use cases that work together to provide a complete background check configuration and tracking solution:

1. **Key Maker**: Create and configure background check keys
2. **Key Analyzer**: Analyze and interpret existing keys
3. **Invite and Track**: Manage customers and track individual background checks

## 1. Key Maker

The Key Maker use case allows users to create and configure background check keys with specific requirements.

### Features

- **Language Selection**: Choose the language for the background check process
- **Personal Information Requirements**: Configure which personal information is required (email, phone, address)
- **Consent Requirements**: Specify which consents are needed (drug test, tax forms, biometric)
- **Verification Steps**: Select which verification steps are required (education, professional license)
- **Timeline Requirements**: Set the required history periods for residence and employment
- **Key Generation**: Generate a standardized key encoding all requirements
- **Customer Management**: Create and manage customer links with the generated key
- **Individual Tracking**: Add individuals to customers for tracking

### Implementation

The Key Maker is implemented in the `KeyMaker.jsx` component, which provides a user interface for configuring all aspects of a background check key. The component uses the following structure:

- Configuration options organized in cards
- Real-time key generation based on selected options
- Copy functionality for sharing keys
- Customer and individual management integration
- Database environment selection (local/production)

### Data Flow

1. User selects configuration options
2. Component generates a key in real-time
3. User can save the key and associate it with a customer
4. Customer links can be shared for background check collection
5. Individuals can be added to customers for tracking

## 2. Key Analyzer

The Key Analyzer use case allows users to analyze and interpret existing keys to understand their requirements.

### Features

- **Key Parsing**: Parse and validate key format
- **Requirement Display**: Show detailed breakdown of key requirements
- **Visual Representation**: Present requirements in a user-friendly format
- **Validation**: Verify key format and structure

### Implementation

The Key Analyzer is implemented in the `KeyAnalyzer.jsx` component, which provides a user interface for analyzing keys. The component uses the following structure:

- Input field for entering a key
- Validation of key format
- Detailed breakdown of key components
- Visual representation of requirements

### Data Flow

1. User enters a key
2. Component validates the key format
3. If valid, component parses the key and displays its requirements
4. If invalid, component shows an error message

## 3. Invite and Track

The Invite and Track use case allows users to manage customers, send invitations for background checks, and track completion status.

### Features

- **Customer Management**: Add and view customers
- **Individual Management**: Add and remove individuals for each customer
- **Invitation Links**: Generate unique links for each individual
- **Status Tracking**: Track completion status for each individual

### Implementation

The Invite and Track use case is implemented in the `InviteAndTrack.jsx` component, which provides a user interface for managing customers and individuals. The component uses the following structure:

- Customer management section
- Individual management section
- Link generation and copying
- Status tracking

### Data Flow

1. User adds a customer
2. User adds individuals to the customer
3. System generates unique links for each individual
4. User shares links with individuals
5. System tracks completion status

## Integration Between Use Cases

The three use cases are integrated to provide a complete solution:

1. **Key Maker → Key Analyzer**: Keys created in the Key Maker can be analyzed in the Key Analyzer
2. **Key Maker → Invite and Track**: Keys created in the Key Maker are used in the Invite and Track system
3. **Invite and Track → Key Analyzer**: Links generated in the Invite and Track system use keys that can be analyzed

## Database Integration

All three use cases are integrated with the backend database:

- **MongoDB** for production persistence
- **In-memory database** for development and testing
- **Local storage fallback** for offline functionality

The database stores:
- Keys with their configuration
- Customers with their information
- Individuals with their status

## API Integration

The use cases communicate with the backend API through the `api.js` service, which provides methods for:

- Key management
- Customer management
- Individual management

The API follows RESTful principles and supports both MongoDB and in-memory database modes.