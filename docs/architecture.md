# Application Architecture

## Overview

The KeyMaker application follows a modern full-stack architecture with the following key characteristics:

- React-based frontend with component architecture
- Express.js backend API
- MongoDB for production persistence
- In-memory database option for development
- Repository pattern for database abstraction
- Styled-components for styling
- Theme-based design system
- Vite as the frontend build tool

## Directory Structure

```
keymaker-app/
├── components/        # React components
│   ├── KeyMaker.jsx   # Key creation component
│   ├── KeyAnalyzer.jsx # Key analysis component
│   ├── InviteAndTrack.jsx # Customer and individual tracking
│   └── Navigation.jsx # Navigation component
├── services/          # Frontend services
│   └── api.js         # API service for backend communication
├── config/            # Configuration files
│   └── endpoints.json # API endpoint configuration
├── public/            # Static assets
├── docs/              # Documentation
├── backend/           # Backend API
│   ├── models/        # Mongoose models
│   ├── repositories/  # Data access layer
│   ├── routes/        # API routes
│   ├── database/      # Database connections
│   ├── server.js      # Express server
│   └── config.js      # Backend configuration
├── App.jsx            # Root component
├── index.jsx          # Application entry point
├── theme.js           # Theme configuration
└── vite.config.js     # Vite configuration
```

## Key Architectural Decisions

### 1. Component Structure
- The application uses a multi-page component architecture with routing
- Three main components implement the core use cases:
  - `KeyMaker`: Key creation and management
  - `KeyAnalyzer`: Key analysis and interpretation
  - `InviteAndTrack`: Customer and individual tracking
- Styling is handled through styled-components with a global theme

### 2. State Management
- React's built-in state management (useState, useEffect) is used
- Theme state is managed through styled-components ThemeProvider
- API service for backend communication
- Local storage fallback for offline functionality

### 3. Backend Architecture
- Express.js for the API server
- Repository pattern for database abstraction
- Support for both MongoDB and in-memory database
- RESTful API endpoints for keys, customers, and individuals

### 4. Database Design
- MongoDB for production persistence
- In-memory database for development and testing
- Two main collections: Keys and Customers
- Embedded documents for individuals within customers

### 5. Styling Approach
- Styled-components for component-level styling
- Global styles defined in theme.js
- Responsive design principles
- Consistent design language across components

### 4. Build System
- Vite for fast development and optimized production builds
- PostCSS for CSS processing
- Modern JavaScript features support

## Performance Considerations

- Component-based architecture for optimal rendering
- Theme-based styling for consistent performance
- Optimized build process with Vite
- Database abstraction layer for efficient data access
- In-memory database option for development speed
- Local storage fallback for offline functionality
- Efficient state management with React hooks
- Responsive design for various device sizes