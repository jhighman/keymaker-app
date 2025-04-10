# KeyMaker Specification

## Overview

KeyMaker is a specification for encoding background check requirements in a compact, human-readable format. It provides a standardized way to specify language preferences, consent requirements, verification steps, and timeline requirements for background checks.

## Documentation Structure

The specification is organized into the following documents:

- [Key Structure](docs/key-structure.md) - Detailed breakdown of the key format and its components
- [Language Codes](docs/language-codes.md) - Supported languages and their codes
- [Consent Options](docs/consent-options.md) - Available consent requirements
- [Verification Steps](docs/verification-steps.md) - Background check verification steps
- [Timeline Specifications](docs/timeline-specifications.md) - Timeline requirements for history checks
- [Validation Rules](docs/validation-rules.md) - Rules for validating keys
- [Usage Examples](docs/usage-examples.md) - Practical examples and use cases
- [Technical Implementation](docs/technical-implementation.md) - Implementation guidelines and code examples

## Quick Reference

### Key Format
```
[Language Code (2)][Initial Bit (1)][Consents (3)][Steps (4)][Residence Timeline (3)][Employment Timeline (3)]
```

### Example Key
```
en1000000000000
```
Breaking down the example:
- Language: English (en)
- Initial Bit: 1
- Consents: None (000)
- Steps: None (0000)
- Residence Timeline: 000 (ignored)
- Employment Timeline: 000 (ignored)

## Features

- **Compact Format**: 16-character string
- **Human Readable**: Easy to understand and share
- **Extensible**: Version bit for future updates
- **Language Support**: Multiple language options
- **Flexible Requirements**: Configurable consents and steps
- **Timeline Control**: Adjustable history periods
- **Persistence**: MongoDB for production and in-memory database for development

## Application Structure

The KeyMaker application consists of:

### Frontend
- React-based web application
- Styled-components for styling
- Vite as the build tool
- Three main components for the core use cases:
  1. **KeyMaker**: Create and configure background check keys with customer and individual management
  2. **KeyAnalyzer**: Analyze and interpret existing keys with detailed requirement breakdown
  3. **InviteAndTrack**: Manage customers, send invitations via multiple channels (email, SMS), and track completion status

### Backend
- Express.js API server
- MongoDB for production persistence
- In-memory database option for development
- Repository pattern for database abstraction

## Getting Started

### Frontend
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

### Backend
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment variables:
   - Set `DB_MODE` to `memory` or `mongodb`
   - Set `MONGODB_URI` if using MongoDB

3. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

4. For more details, see the [Backend README](backend/README.md)

## API Endpoints

The backend provides the following API endpoints:

### Keys
- `GET /api/keys` - Get all keys
- `GET /api/keys/:id` - Get key by ID
- `POST /api/keys` - Create a new key
- `PUT /api/keys/:id` - Update a key
- `DELETE /api/keys/:id` - Delete a key

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create a new customer
- `PUT /api/customers/:id` - Update a customer
- `DELETE /api/customers/:id` - Delete a customer
- `POST /api/customers/:id/individuals` - Add individual to customer
- `DELETE /api/customers/:id/individuals/:individualId` - Remove individual
- `PATCH /api/customers/:id/individuals/:individualId/status` - Update status

## Contributing

Contributions to the KeyMaker specification are welcome. Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This specification is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions and support:
1. Check the documentation
2. Open an issue
3. Contact the maintainers

## Version History

- v1.1.0 (2025-04-08)
  - Added backend API with MongoDB persistence
  - Added in-memory database option for development
  - Implemented repository pattern for database abstraction

- v1.0.0 (2024-03-21)
  - Initial specification release
  - Basic key structure
  - Core validation rules
  - Implementation examples