// In production on Vercel we call same-origin serverless routes (/api/*).
// In local development we keep localhost server fallback unless VITE_API_URL is set.
const apiBaseUrl = (
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:3001" : "")
).trim();

const config = {
  apiBaseUrl,

  getApiUrl: (endpoint) => {
    const cleanEndpoint = String(endpoint || "").replace(/^\//, "");

    if (!config.apiBaseUrl) {
      return `/${cleanEndpoint}`;
    }

    const baseUrl = config.apiBaseUrl.replace(/\/$/, "");
    return `${baseUrl}/${cleanEndpoint}`;
  },
};

export default config;
