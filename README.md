# KeyMaker App

A React-based application for generating and analyzing keys for background check configurations.

## Features

- Generate keys with customizable settings:
  - Language selection (English, Spanish, French)
  - Consent options (Driver's License, Drug Test, Biometric Data)
  - Required steps (Education, Professional License, Residence History, Employment History)
  - Timeline configurations for history requirements

- Analyze existing keys:
  - Detailed breakdown of key contents
  - Validation of key format and structure
  - Clear display of all settings and requirements

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/keymaker-app.git
   cd keymaker-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:4000
   ```

### Building for Production

To create a production build:

```bash
npm run build
```

The build output will be in the `dist` directory.

## Key Structure

The generated keys follow this structure:
1. Language code (2 chars)
2. Initial bit (1)
3. Consents (3 bits)
4. Steps (4 bits)
5. Residence timeline (3 bits)
6. Employment timeline (3 bits)

## Development

- Built with React and Vite
- Styled with styled-components
- Modern UI with responsive design
- Hot Module Replacement enabled

## License

This project is licensed under the MIT License - see the LICENSE file for details. 