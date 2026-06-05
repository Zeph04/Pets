import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adoptionService } from '@/services/adoptionService'
import toast from 'react-hot-toast'

export const adoptionKeys = {
  all:    ['adoptions'],
  my:     (filters) => [...adoptionKeys.all, 'mine', filters],
  admin:  (filters) => [...adoptionKeys.all, 'admin', filters],
  detail: (id) => [...adoptionKeys.all, 'detail', id],
}

export function useMyAdoptions(filters = {}) {
  return useQuery({
    queryKey: adoptionKeys.my(filters),
    queryFn:  () => adoptionService.getMyApplications(filters),
  })
}

export function useAdoptionDetail(id) {
  return useQuery({
    queryKey: adoptionKeys.detail(id),
    queryFn:  () => adoptionService.getOne(id),
    enabled:  !!id,
  })
}

export function useApplyForAdoption() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => adoptionService.apply(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adoptionKeys.all })
      toast.success('Application submitted! 🐾 We\'ll be in touch.')
    },
    onError: (err) => {
      const message = err.response?.data?.errors?.pet_id?.[0]
        || err.response?.data?.message
        || 'Application failed'
      toast.error(message)
    },
  })
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export function useAdminAdoptions(filters = {}) {
  return useQuery({
    queryKey: adoptionKeys.admin(filters),
    queryFn:  () => adoptionService.adminGetAll(filters),
  })
}

export function useUpdateAdoptionStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, notes }) => adoptionService.updateStatus(id, status, notes),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: adoptionKeys.admin({}) })
      qc.invalidateQueries({ queryKey: adoptionKeys.detail(variables.id) })
      toast.success(`Application ${variables.status}!`)
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  })
}
