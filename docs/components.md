# Components Documentation

## Overview

The KeyMaker application consists of several key components that work together to provide the key management interface.

## Core Components

### App.jsx
The root component of the application that sets up the theme provider and global styles.

```jsx
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, theme } from './theme';
import KeyMaker from './components/KeyMaker';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <KeyMaker />
    </ThemeProvider>
  );
};
```

### KeyMaker.jsx
The main component that handles the key management interface.

Key features:
- Key generation
- Key display
- User interaction handling
- Styled interface elements

## Component Hierarchy

```
App
└── KeyMaker
    ├── KeyDisplay
    ├── KeyControls
    └── KeyActions
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