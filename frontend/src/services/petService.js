import api from '@/api/axios'

export const petService = {
  // Public
  async getAll(params = {}) {
    const res = await api.get('/pets', { params })
    return res.data
  },

  async getOne(id) {
    const res = await api.get(`/pets/${id}`)
    return res.data.data
  },

  // Authenticated
  async create(data) {
    // Use FormData for file uploads
    const formData = toFormData(data)
    const res = await api.post('/pets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.data
  },

  async update(id, data) {
    const formData = toFormData(data)
    // Laravel needs _method override for PUT with FormData
    formData.append('_method', 'PUT')
    const res = await api.post(`/pets/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.data
  },

  async remove(id) {
    await api.delete(`/pets/${id}`)
  },

  async uploadImage(petId, file, isPrimary = false) {
    const formData = new FormData()
    formData.append('image', file)
    if (isPrimary) formData.append('is_primary', '1')
    const res = await api.post(`/pets/${petId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.data
  },

  async deleteImage(petId, imageId) {
    await api.delete(`/pets/${petId}/images/${imageId}`)
  },
}

function toFormData(data) {
  const fd = new FormData()
  Object.entries(data).forEach(([key, val]) => {
    if (val !== null && val !== undefined) {
      fd.append(key, val instanceof File ? val : String(val))
    }
  })
  return fd
}
