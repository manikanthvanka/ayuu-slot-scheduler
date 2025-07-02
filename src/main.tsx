import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext';
import { ScreenFieldsProvider } from './contexts/ScreenFieldsContext';
import { DatabaseProvider } from './contexts/DatabaseContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { LanguageProvider } from './contexts/LanguageContext';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <ScreenFieldsProvider>
          <DatabaseProvider>
            <LoadingProvider>
              <App />
            </LoadingProvider>
          </DatabaseProvider>
        </ScreenFieldsProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);
