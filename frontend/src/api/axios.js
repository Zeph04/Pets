import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Only send credentials (cookies) when proxying locally.
  // In production, we use Bearer tokens so withCredentials must be false
  // to avoid CORS preflight failures across Vercel → Render.
  withCredentials: !import.meta.env.VITE_API_URL,
})

// ── Request interceptor: inject auth token ─────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pawshome_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: handle 401 globally ─────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state and redirect to login
      localStorage.removeItem('pawshome_token')
      localStorage.removeItem('pawshome_user')
      // Fire a custom event so AuthContext can react without circular imports
      window.dispatchEvent(new CustomEvent('auth:expired'))
    }
    return Promise.reject(error)
  }
)

export default api
