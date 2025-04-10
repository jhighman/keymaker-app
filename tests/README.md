# Testing Documentation

This directory contains tests for the KeyMaker application, covering both frontend and backend components.

## Test Structure

- `setup.js`: Configuration for frontend tests
- `InviteAndTrack.test.jsx`: Tests for the InviteAndTrack component
- `api.service.test.js`: Tests for the API service

The backend tests are located in the `backend/tests` directory:

- `setup.js`: Configuration for backend tests
- `customer.model.test.js`: Tests for the Customer model
- `customer.repository.test.js`: Tests for the customer repository
- `webhook.routes.test.js`: Tests for the webhook routes
- `scheduler.test.js`: Tests for the scheduler

## Running Tests

### Frontend Tests

To run the frontend tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Backend Tests

To run the backend tests:

```bash
# Navigate to the backend directory
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

The test suite covers:

1. **Frontend Components**:
   - Rendering of components
   - User interactions (clicking buttons, filling forms)
   - State management
   - API integration

2. **API Service**:
   - Local storage operations
   - API requests
   - Error handling

3. **Backend Models**:
   - Data validation
   - Schema functionality
   - Relationships between models

4. **Backend Repositories**:
   - CRUD operations
   - Business logic
   - Error handling

5. **Webhook Integration**:
   - Request handling
   - Signature verification
   - Status updates
   - Scheduled actions

6. **Scheduler**:
   - Processing due actions
   - Sending communications
   - Updating statuses

## Adding New Tests

When adding new features, please follow these guidelines for testing:

1. Create a new test file for each major component or service
2. Use descriptive test names that explain what is being tested
3. Mock external dependencies (API calls, database, etc.)
4. Test both success and failure scenarios
5. Aim for high test coverage, especially for critical business logic

## Continuous Integration

Tests are automatically run as part of the CI/CD pipeline. Pull requests cannot be merged unless all tests pass.