/**
 * API base URL from environment. No hardcoded hosts or ports.
 * Set VITE_API_URL in .env (e.g. http://localhost:5000/api for dev, or your backend URL in prod).
 * When unset, uses relative /api (same-origin).
 */
export const getApiBaseUrl = () => {
  const url = (import.meta.env.VITE_API_URL ?? '').trim();
  return url || '/api';
};
