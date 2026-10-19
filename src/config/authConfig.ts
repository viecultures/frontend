// Temporary frontend-only sign-in. Set VITE_AUTH_MODE=backend to restore API auth.
export const isLocalAuthMode = import.meta.env?.VITE_AUTH_MODE !== 'backend';
