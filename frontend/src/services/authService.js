import api from '@/api/axios'

const TOKEN_KEY = 'pawshome_token'
const USER_KEY  = 'pawshome_user'

export const authService = {
  async register(data) {
    const res = await api.post('/auth/register', data)
    return res.data
  },

  async login(credentials) {
    const res = await api.post('/auth/login', credentials)
    const { token, user } = res.data.data
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return { token, user }
  },

  async logout() {
    await api.post('/auth/logout')
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  async me() {
    const res = await api.get('/auth/me')
    return res.data.data
  },

  getStoredToken: () => localStorage.getItem(TOKEN_KEY),
  getStoredUser:  () => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY))
    } catch {
      return null
    }
  },
  clearStorage: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}
