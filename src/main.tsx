import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./lib/i18n";
import { SettingsProvider } from "./context/SettingsContext";
import { GamificationProvider } from "./context/GamificationContext";
import { App } from "./App";
import "./index.css";

async function prepareApp() {
  if (import.meta.env.MODE === 'mock' || import.meta.env.VITE_ENABLE_MSW === 'true') {
    const { worker } = await import('./mocks/browser');
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
  return Promise.resolve();
}

prepareApp().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <SettingsProvider>
          <GamificationProvider>
            <App />
          </GamificationProvider>
        </SettingsProvider>
      </BrowserRouter>
    </StrictMode>
  );
});

// PWA Service Worker: only register in production to avoid interfering with Vite dev HMR & dynamic imports
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.warn('[PWA] Service Worker registration failed:', error);
        });
    });
  } else if (import.meta.env.MODE !== 'mock') {
    // In dev mode (not MSW mock mode), clean up any stale custom service workers
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        if (!registration.active?.scriptURL.includes('mockServiceWorker.js')) {
          registration.unregister();
        }
      }
    });
  }
}
