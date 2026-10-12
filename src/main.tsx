import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
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
