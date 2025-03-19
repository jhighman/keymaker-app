import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // This allows the build to be deployed anywhere
  server: {
    port: 4000,
    strictPort: true, // This will fail if port 4000 is not available
    open: true // This will open the browser automatically
  }
}); 