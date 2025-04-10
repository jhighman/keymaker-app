# Components Documentation

## Overview

The KeyMaker application consists of three main components that implement the core use cases of the application.

## Core Components

### App.jsx
The root component of the application that sets up the theme provider, global styles, and routing.

```jsx
import { ThemeProvider } from 'styled-components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalStyle, theme } from './theme';
import KeyMaker from './components/KeyMaker';
import KeyAnalyser from './components/KeyAnalyser';
import Invite from './components/Invite';
import Navigation from './components/Navigation';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<KeyMaker />} />
          <Route path="/analyze" element={<KeyAnalyser />} />
          <Route path="/analyse" element={<KeyAnalyser />} />
          <Route path="/invite" element={<Invite />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};
```

### KeyMaker.jsx
The component that handles key creation and management.

Key features:
- Key generation with configurable options
- Key display and copying
- Customer link management
- Database environment selection (local/production)
- Individual tracking integration

### KeyAnalyser.jsx
The component that handles key analysis and interpretation.

Key features:
- Key parsing and validation
- Detailed breakdown of key components
- Visual representation of key requirements
- Support for the KeyMaker key format
### Invite.jsx
### InviteAndTrack.jsx
The component that manages customer invitations and tracks individual background checks.

Key features:
- Customer management (add, view, select)
- Individual management (add, delete, track)
- Contact information management (email, phone, preferred channel)
- Communication channels (email, SMS)
- Invitation management (send, resend)
- Status tracking with multiple states (pending, invited, started, in_progress, completed, expired, failed)
- Modal interfaces for adding individuals and sending invitations
- Link generation and copying

## Component Hierarchy

```
App
├── Navigation
└── Routes
    ├── KeyMaker
    │   ├── ConfigurationGrid
    │   │   ├── LanguageCard
    │   │   ├── PersonalInfoCard
    │   │   ├── ConsentsCard
    │   │   ├── VerificationStepsCard
    │   │   └── TimelineCard
    │   └── OutputGrid
    │       ├── OutputCard
    │       ├── CollectionLinkCard
    │       └── CustomerLinkCard
    ├── KeyAnalyser
    │   ├── InputGroup
    │   └── ResultCard
    │       ├── LanguageSection
    │       ├── PersonalInfoSection
    │       ├── ConsentsSection
    │       ├── ResidenceHistorySection
    │       ├── EmploymentHistorySection
    │       └── AdditionalRequirementsSection
    └── Invite
        ├── CustomerCard
        │   ├── CustomerInput
        │   └── CustomerList
        └── DetailCard
            ├── IndividualSection
            └── IndividualList
```

## Component Props

### KeyMaker Component
- `theme`: Theme object from styled-components
- `onKeyGenerate`: Callback function for key generation
- `onKeyCopy`: Callback function for copying keys

## Styling

Components are styled using styled-components with the following principles:
- Consistent spacing using theme variables
- Responsive design
- Accessible color contrast
- Interactive states (hover, focus, active)

## Best Practices

1. Component Organization
   - Keep components focused and single-responsibility
   - Use proper prop types
   - Maintain consistent naming conventions

2. State Management
   - Use local state for component-specific data
   - Implement proper state updates
   - Handle side effects appropriately

3. Performance
   - Optimize re-renders
   - Use proper key props
   - Implement proper event handling