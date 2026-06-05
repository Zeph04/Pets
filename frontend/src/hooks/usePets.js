import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { petService } from '@/services/petService'
import toast from 'react-hot-toast'

// ── Query Keys ────────────────────────────────────────────────────────────────
export const petKeys = {
  all:    ['pets'],
  lists:  () => [...petKeys.all, 'list'],
  list:   (filters) => [...petKeys.lists(), filters],
  detail: (id) => [...petKeys.all, 'detail', id],
}

// ── Queries ───────────────────────────────────────────────────────────────────
export function usePets(filters = {}) {
  return useQuery({
    queryKey: petKeys.list(filters),
    queryFn:  () => petService.getAll(filters),
    placeholderData: (prev) => prev, // keep showing old data during pagination
  })
}

export function usePet(id) {
  return useQuery({
    queryKey: petKeys.detail(id),
    queryFn:  () => petService.getOne(id),
    enabled:  !!id,
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────
export function useCreatePet() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => petService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: petKeys.all })
      toast.success('Cat added successfully! 🐱')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create cat')
    },
  })
}

export function useUpdatePet(id) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => petService.update(id, data),
    onSuccess: (updated) => {
      qc.setQueryData(petKeys.detail(id), updated)
      qc.invalidateQueries({ queryKey: petKeys.all })
      toast.success('Cat updated! ✨')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update cat')
    },
  })
}

export function useDeletePet() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => petService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: petKeys.all })
      toast.success('Cat removed.')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete cat')
    },
  })
}

export function useUploadPetImage(petId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ file, isPrimary }) => petService.uploadImage(petId, file, isPrimary),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: petKeys.all })
      toast.success('Image uploaded! 📸')
    },
    onError: () => toast.error('Image upload failed'),
  })
}
