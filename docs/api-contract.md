# API Contract: KeyMaker and Trua Collect Integration

## Overview

This document defines the API contract between the KeyMaker application and the Trua Collect application. It specifies the endpoints, request/response formats, authentication mechanisms, and error handling for the integration between these two systems.

## Base URLs

- **KeyMaker API**: `https://api.keymaker.trua.me`
- **Trua Collect API**: `https://api.collect.trua.me`

## Authentication

### API Key Authentication

For direct API calls between systems:

- Header: `X-API-Key: <api_key>`
- The API key must be included in all requests
- Different API keys are used for different environments (development, staging, production)

### Webhook Authentication

For webhook calls:

- Header: `X-Webhook-Signature: <signature>`
- The signature is a HMAC-SHA256 hash of the request body using a shared secret
- Format: `t=<timestamp>,v1=<signature>`
- Example: `t=1617981389,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd`

## Endpoints

### 1. KeyMaker Webhook Endpoint

#### Receive Status Updates from Trua Collect

```
POST /api/webhook/collect
```

**Request Headers:**
```
Content-Type: application/json
X-Webhook-Signature: t=1617981389,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
```

**Request Body:**
```json
{
  "event": "status_update",
  "customerId": "cust_12345",
  "individualId": "ind_67890",
  "status": "in_progress",
  "timestamp": "2025-04-09T16:00:00Z",
  "progress": {
    "currentStep": "identity_verification",
    "completedSteps": ["consent", "personal_info"],
    "totalSteps": 5,
    "percentComplete": 40
  },
  "metadata": {
    "browser": "Chrome",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  }
}
```

**Response (Success):**
```
Status: 200 OK
```

**Response Body:**
```json
{
  "received": true,
  "timestamp": "2025-04-09T16:00:05Z"
}
```

**Response (Error):**
```
Status: 400 Bad Request
```

```json
{
  "error": "Invalid request format",
  "message": "Missing required field: individualId"
}
```

#### Receive Completion Notification from Trua Collect

```
POST /api/webhook/collect/complete
```

**Request Headers:**
```
Content-Type: application/json
X-Webhook-Signature: t=1617981389,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
```

**Request Body:**
```json
{
  "event": "collection_complete",
  "customerId": "cust_12345",
  "individualId": "ind_67890",
  "timestamp": "2025-04-09T17:30:00Z",
  "collectionData": {
    "completedAt": "2025-04-09T17:30:00Z",
    "completedSteps": ["consent", "personal_info", "identity_verification", "document_upload", "signature"],
    "totalSteps": 5,
    "percentComplete": 100
  },
  "metadata": {
    "browser": "Chrome",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  }
}
```

**Response (Success):**
```
Status: 200 OK
```

```json
{
  "received": true,
  "timestamp": "2025-04-09T17:30:05Z",
  "nextSteps": {
    "backgroundCheckInitiated": true,
    "estimatedCompletionTime": "2025-04-12T17:30:00Z"
  }
}
```

### 2. Trua Collect Link Generation

#### Generate Collection Link

```
POST /api/customers/{customerId}/individuals/{individualId}/collect-link
```

**Request Headers:**
```
Content-Type: application/json
X-API-Key: api_key_12345
```

**Request Body:**
```json
{
  "returnUrl": "https://api.keymaker.trua.me/webhook/collect",
  "expiresIn": 604800,  // 7 days in seconds
  "metadata": {
    "source": "invite_email",
    "campaign": "spring_onboarding"
  }
}
```

**Response (Success):**
```
Status: 200 OK
```

```json
{
  "collectLink": "https://collect.trua.me/start?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2025-04-16T12:00:00Z",
  "metadata": {
    "source": "invite_email",
    "campaign": "spring_onboarding"
  }
}
```

### 3. Status Inquiry API

#### Get Individual Collection Status

```
GET /api/customers/{customerId}/individuals/{individualId}/status
```

**Request Headers:**
```
X-API-Key: api_key_12345
```

**Response (Success):**
```
Status: 200 OK
```

```json
{
  "individualId": "ind_67890",
  "status": "in_progress",
  "lastUpdated": "2025-04-09T16:00:00Z",
  "progress": {
    "currentStep": "identity_verification",
    "completedSteps": ["consent", "personal_info"],
    "totalSteps": 5,
    "percentComplete": 40
  },
  "communications": [
    {
      "channel": "email",
      "timestamp": "2025-04-08T12:00:00Z",
      "status": "delivered"
    },
    {
      "channel": "email",
      "timestamp": "2025-04-09T12:00:00Z",
      "status": "delivered"
    }
  ],
  "collectLink": {
    "url": "https://collect.trua.me/start?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2025-04-16T12:00:00Z",
    "active": true
  }
}
```

## Event Types

The following event types are supported in the webhook notifications:

| Event Type | Description |
|------------|-------------|
| `status_update` | Individual's status has been updated |
| `collection_started` | Individual has started the collection process |
| `step_completed` | Individual has completed a step in the collection process |
| `collection_complete` | Individual has completed the entire collection process |
| `collection_expired` | Collection link has expired without completion |
| `collection_abandoned` | Individual started but abandoned the collection process |

## Status Codes

The following status codes are used to represent an individual's progress:

| Status Code | Description |
|-------------|-------------|
| `pending` | Individual has been added but not yet invited |
| `invited` | Invitation has been sent but collection not started |
| `started` | Individual has accessed the collection link |
| `in_progress` | Individual is actively completing the collection |
| `completed` | Individual has completed the entire collection |
| `expired` | Collection link has expired without completion |
| `failed` | Collection process encountered an error |

## Error Handling

### Error Response Format

All error responses follow this format:

```json
{
  "error": "error_code",
  "message": "Human-readable error message",
  "details": {
    "field": "specific_field",
    "reason": "specific reason"
  }
}
```

### Common Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | `invalid_request` | The request was malformed or missing required fields |
| 401 | `unauthorized` | Authentication failed |
| 403 | `forbidden` | The authenticated user doesn't have permission |
| 404 | `not_found` | The requested resource was not found |
| 409 | `conflict` | The request conflicts with the current state |
| 429 | `rate_limited` | Too many requests, please try again later |
| 500 | `server_error` | An unexpected error occurred on the server |

## Webhook Signature Verification

To verify the authenticity of webhook calls, the signature in the `X-Webhook-Signature` header should be validated:

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  // Extract timestamp and signature value
  const [timestamp, signatureValue] = signature.split(',');
  const timestampValue = timestamp.split('=')[1];
  const hashValue = signatureValue.split('=')[1];
  
  // Create expected signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${timestampValue}.${JSON.stringify(payload)}`)
    .digest('hex');
  
  // Compare signatures using constant-time comparison
  return crypto.timingSafeEqual(
    Buffer.from(hashValue),
    Buffer.from(expectedSignature)
  );
}
```

## Rate Limiting

- API calls are rate-limited to 100 requests per minute per API key
- Webhook endpoints are rate-limited to 1000 requests per minute per customer
- When rate limits are exceeded, a 429 status code is returned

## Versioning

- The API version is specified in the URL: `/api/v1/...`
- The current version is v1
- When breaking changes are introduced, a new version will be created

## Testing

### Test Endpoints

For testing the integration, the following test endpoints are available:

- Test Webhook: `https://api.keymaker.trua.me/test/webhook/collect`
- Test Status Update: `https://api.keymaker.trua.me/test/status-update`

### Test API Keys

- Development: `dev_api_key_12345`
- Staging: `stg_api_key_67890`
- Production: `prod_api_key_abcdef`

## Implementation Timeline

| Phase | Feature | Estimated Completion |
|-------|---------|----------------------|
| 1 | Basic Webhook Integration | Q2 2025 |
| 2 | Enhanced Status Tracking | Q3 2025 |
| 3 | Multi-channel Communication | Q3 2025 |
| 4 | Advanced Analytics | Q4 2025 |

## Support

For integration support, please contact:
- Email: integration-support@trua.me
- API Documentation: https://docs.keymaker.trua.me/api
- Status Page: https://status.trua.me