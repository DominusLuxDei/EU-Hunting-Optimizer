import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@mantine/core/styles.css'; // Import Mantine styles
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <BrowserRouter basename="/EU-Hunting-Optimizer"> {/* Add basename */}
        <App />
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
);