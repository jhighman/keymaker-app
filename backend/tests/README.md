# Backend Tests

This directory contains tests for the KeyMaker backend application.

## Test Structure

- `setup.js`: Configuration for backend tests
- `customer.model.test.js`: Tests for the Customer model
- `customer.repository.test.js`: Tests for the customer repository
- `webhook.routes.test.js`: Tests for the webhook routes
- `scheduler.test.js`: Tests for the scheduler

## Running Tests

To run the backend tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

The test suite covers:

1. **Models**:
   - Data validation
   - Schema functionality
   - Relationships between models
   - Pre-save middleware

2. **Repositories**:
   - CRUD operations
   - Business logic
   - Error handling
   - Database interactions

3. **API Routes**:
   - Request handling
   - Response formatting
   - Error handling
   - Authentication/authorization

4. **Webhook Integration**:
   - Request handling
   - Signature verification
   - Status updates
   - Scheduled actions

5. **Scheduler**:
   - Processing due actions
   - Sending communications
   - Updating statuses
   - Error handling

## Testing Approach

### Unit Tests

Unit tests focus on testing individual components in isolation. Dependencies are mocked to ensure that only the component under test is being evaluated.

### Integration Tests

Integration tests verify that different components work together correctly. These tests may involve multiple components and may interact with a test database.

### API Tests

API tests verify that the API endpoints work as expected. These tests use supertest to make HTTP requests to the API and verify the responses.

## Test Database

Tests use an in-memory MongoDB database to avoid affecting the development or production databases. The database is cleared between tests to ensure test isolation.

## Adding New Tests

When adding new features, please follow these guidelines for testing:

1. Create a new test file for each major component
2. Use descriptive test names that explain what is being tested
3. Mock external dependencies when appropriate
4. Test both success and failure scenarios
5. Aim for high test coverage, especially for critical business logic

## Continuous Integration

Tests are automatically run as part of the CI/CD pipeline. Pull requests cannot be merged unless all tests pass.