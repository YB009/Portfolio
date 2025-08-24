// Configuration for different environments
const config = {
  // API base URL - will be different in development vs production
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  
  // Build the full API URL for endpoints
  getApiUrl: (endpoint) => {
    const baseUrl = config.apiBaseUrl.replace(/\/$/, '') // Remove trailing slash
    const cleanEndpoint = endpoint.replace(/^\//, '') // Remove leading slash
    return `${baseUrl}/${cleanEndpoint}`
  }
}

export default config
