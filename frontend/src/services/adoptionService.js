import api from '@/api/axios'

export const adoptionService = {
  // User's own applications
  async getMyApplications(params = {}) {
    const res = await api.get('/adoptions', { params })
    return res.data
  },

  async getOne(id) {
    const res = await api.get(`/adoptions/${id}`)
    return res.data.data
  },

  async create(data) {
    const res = await api.post('/adoptions', data)
    return res.data.data
  },

  async apply(data) {
    const res = await api.post('/adoptions', data)
    return res.data.data
  },

  // Admin
  async adminGetAll(params = {}) {
    const res = await api.get('/admin/adoptions', { params })
    return res.data
  },

  async adminGetOne(id) {
    const res = await api.get(`/admin/adoptions/${id}`)
    return res.data.data
  },

  async updateStatus(id, status, notes = null) {
    const res = await api.put(`/admin/adoptions/${id}/status`, { status, notes })
    return res.data.data
  },
}
