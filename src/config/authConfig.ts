// Authentication Mode configuration. Defaults to backend API unless explicitly set to 'local'.
export const isLocalAuthMode = import.meta.env?.VITE_AUTH_MODE === 'local';
export const isDemoLoginEnabled = isLocalAuthMode || import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEMO_LOGIN === 'true';
