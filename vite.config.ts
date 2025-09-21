import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        // order matters: decorators FIRST
        plugins: [
          ['@babel/plugin-proposal-decorators', { version: '2023-01' }],
          ['@babel/plugin-transform-class-properties', { loose: true }],
          ['@babel/plugin-transform-private-methods', { loose: true }],
          ['@babel/plugin-transform-private-property-in-object', { loose: true }],
          ['@babel/plugin-transform-class-static-block', { loose: true }],
        ],
      },
    }),
  ],
});
