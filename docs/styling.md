# Styling Documentation

## Overview

The KeyMaker application uses styled-components for styling with a theme-based approach. This ensures consistent styling across the application and makes it easy to maintain and modify the design system.

## Theme Configuration

The theme is defined in `theme.js` and includes:

### Colors
```javascript
colors: {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#FFFFFF',
  text: '#000000',
  // ... other colors
}
```

### Typography
```javascript
typography: {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: {
    small: '14px',
    medium: '16px',
    large: '18px',
  },
  // ... other typography settings
}
```

### Spacing
```javascript
spacing: {
  small: '8px',
  medium: '16px',
  large: '24px',
  // ... other spacing values
}
```

## Global Styles

Global styles are defined using styled-components' `createGlobalStyle`:

```javascript
export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    background-color: ${({ theme }) => theme.colors.background};
  }
  // ... other global styles
`;
```

## Component Styling

Components are styled using styled-components with the following patterns:

### Basic Styling
```javascript
const StyledComponent = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.text};
`;
```

### Responsive Design
```javascript
const ResponsiveComponent = styled.div`
  width: 100%;
  @media (min-width: 768px) {
    width: 50%;
  }
`;
```

### Interactive States
```javascript
const InteractiveComponent = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;
```

## Best Practices

1. Theme Usage
   - Always use theme variables for colors, spacing, and typography
   - Maintain consistency in style naming
   - Use semantic color names

2. Responsive Design
   - Mobile-first approach
   - Use breakpoints consistently
   - Test across different screen sizes

3. Accessibility
   - Maintain sufficient color contrast
   - Use appropriate font sizes
   - Include focus states for interactive elements

4. Performance
   - Minimize style recalculations
   - Use CSS-in-JS efficiently
   - Optimize for production builds 