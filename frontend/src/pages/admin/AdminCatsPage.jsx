import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/axios'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Pagination } from '@/components/ui/Pagination'
import { Modal } from '@/components/ui/Modal'
import { PetForm } from '@/components/pets/PetForm'
import { ImageOff, RefreshCw, Search, Plus, Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['available', 'pending', 'adopted', 'unavailable']

export function AdminCatsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingPet, setEditingPet] = useState(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-cats', page, search],
    queryFn:  () => api.get('/admin/pets', { params: { page, per_page: 15, search: search || undefined } }).then(r => r.data),
  })

  const statusMutation = useMutation({
    mutationFn: ({ petId, status }) => api.put(`/admin/pets/${petId}/status`, { status }),
    onSuccess:  () => {
      toast.success('Cat status updated.')
      qc.invalidateQueries({ queryKey: ['admin-cats'] })
    },
    onError: () => toast.error('Failed to update status.'),
  })

  const pets = data?.data ?? []
  const meta = data?.meta ?? {}

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Cats Management</h1>
          <p className="text-neutral-400 text-sm mt-1">
            {meta.total ? `${meta.total} cats total` : 'Manage all cat profiles'}
          </p>
        </div>
        <button 
          onClick={() => { setEditingPet(null); setShowModal(true); }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" /> Add Cat
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <input
          type="text"
          placeholder="Search by name or breed…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="input bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500 pl-10"
          id="admin-cats-search"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : (
        <>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Cat</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider hidden sm:table-cell">Breed</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider hidden md:table-cell">Gender</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {pets.length > 0 ? pets.map(pet => {
                  const primaryImg = pet.images?.find(i => i.is_primary) ?? pet.images?.[0]
                  return (
                    <tr key={pet.id} className="hover:bg-neutral-950/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {primaryImg ? (
                            <img src={primaryImg.url} alt={pet.name} className="w-10 h-10 rounded-lg object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center">
                              <ImageOff className="w-4 h-4 text-neutral-600" />
                            </div>
                          )}
                          <span className="text-white font-medium text-sm">{pet.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-neutral-400 text-sm">{pet.breed ?? '—'}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-neutral-400 text-sm capitalize">{pet.gender ?? '—'}</td>
                      <td className="px-4 py-3"><Badge status={pet.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            defaultValue={pet.status}
                            onChange={e => statusMutation.mutate({ petId: pet.id, status: e.target.value })}
                            disabled={statusMutation.isPending}
                            className="select-custom text-xs bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-lg pl-2.5 py-1.5 hover:bg-neutral-700 hover:border-neutral-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s} className="capitalize">{s}</option>
                            ))}
                          </select>
                          {statusMutation.isPending && <RefreshCw className="w-3.5 h-3.5 text-brand-400 animate-spin" />}
                          <button
                            onClick={() => { setEditingPet(pet); setShowModal(true); }}
                            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                            title="Edit Cat"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-neutral-500">
                      No cats found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {meta.last_page > 1 && (
            <Pagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              onPageChange={setPage}
              className="mt-5"
            />
          )}
        </>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingPet ? `Edit ${editingPet.name}` : 'Add New Cat'}
        size="lg"
      >
        <PetForm 
          pet={editingPet} 
          onSuccess={() => setShowModal(false)} 
        />
      </Modal>
    </div>
  )
}
