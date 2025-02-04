import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@mantine/core/styles.css'; // Import Mantine styles
import { MantineProvider } from '@mantine/core';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <App />
    </MantineProvider>
  </StrictMode>,
);