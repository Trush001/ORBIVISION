/**
 * ORBIVISION API Client Configuration
 * 
 * In production on Render (or other static hosts), VITE_API_BASE_URL points to
 * the deployed FastAPI backend web service (e.g. https://orbivision-api.onrender.com).
 * 
 * In local development or Docker Nginx setups, VITE_API_BASE_URL defaults to an
 * empty string (''), routing requests relatively (/api/...) through Vite's local
 * dev proxy (http://127.0.0.1:8000) or Docker Nginx gateway.
 */

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();

// Strip any trailing slash for consistent concatenation
export const API_BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

/**
 * Returns a fully qualified API URL in production, or a relative URL in local development.
 * @param {string} endpoint - The API endpoint path (e.g. '/api/inquiries')
 * @returns {string} The resolved request URL
 */
export const getApiUrl = (endpoint) => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
};
