import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./lib/i18n";
import { SettingsProvider } from "./context/SettingsContext";
import { GamificationProvider } from "./context/GamificationContext";
import { App } from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <GamificationProvider>
          <App />
        </GamificationProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>
);

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
  } else {
    // In development mode, automatically unregister any stale service workers on localhost
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }
}
