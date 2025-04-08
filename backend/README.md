# KeyMaker Backend API

This is the backend API for the KeyMaker application. It provides persistence with MongoDB and an in-memory database option for development.

## Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (for production mode)

### Installation
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env` (or create a new `.env` file)
   - Set the database mode and MongoDB URI as needed

## Configuration

The backend supports two database modes:
- `memory`: In-memory database for development and testing
- `mongodb`: MongoDB for production use

Configure the mode in the `.env` file:
```
DB_MODE=memory  # 'mongodb' or 'memory'
MONGODB_URI=mongodb://localhost:27017/keymaker
PORT=5000
```

## Running the Server

### Development Mode
```bash
cd backend
npm run dev
```

### Production Mode
```bash
cd backend
npm start
```

## API Endpoints

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

### Individuals

- `POST /api/customers/:id/individuals` - Add individual to customer
- `DELETE /api/customers/:id/individuals/:individualId` - Remove individual from customer
- `PATCH /api/customers/:id/individuals/:individualId/status` - Update individual status

## Database Structure

### Keys Collection
Stores the generated keys with their properties:
- `value`: The key string
- `language`: Language code
- `personalInfo`: Email, phone, address requirements
- `consents`: Required consents
- `residenceHistory`: Residence history requirements
- `employmentHistory`: Employment history requirements
- `education`: Education verification requirement
- `professionalLicense`: Professional license requirement
- `signature`: Signature type

### Customers Collection
Stores customer information:
- `name`: Customer name
- `link`: Collection link
- `endpoint`: API endpoint
- `individuals`: Array of individuals associated with the customer

## Development

### Adding New Features
1. Create or modify models in the `models` directory
2. Update repositories in the `repositories` directory
3. Add or modify routes in the `routes` directory
4. Update the in-memory database implementation if needed

### Testing
The in-memory database mode is perfect for testing as it doesn't require a MongoDB instance.