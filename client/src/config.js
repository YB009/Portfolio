// Configuration for different environments
const config = {
  // API base URL - will be different in development vs production
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  
  // Build the full API URL for endpoints
  getApiUrl: (endpoint) => {
    const baseUrl = config.apiBaseUrl.replace(/\/$/, '') // Remove trailing slash
    const cleanEndpoint = endpoint.replace(/^\//, '') // Remove leading slash
    const fullUrl = `${baseUrl}/${cleanEndpoint}`
    
    // Debug logging in development
    if (import.meta.env.DEV) {
      console.log('API URL Debug:', {
        VITE_API_URL: import.meta.env.VITE_API_URL,
        apiBaseUrl: config.apiBaseUrl,
        endpoint,
        fullUrl
      })
    }
    
    return fullUrl
  }
}

export default config
