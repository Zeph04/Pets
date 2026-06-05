import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/axios'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Pagination } from '@/components/ui/Pagination'
import { Modal } from '@/components/ui/Modal'
import { format } from 'date-fns'
import { Eye, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['pending', 'reviewing', 'approved', 'rejected', 'withdrawn']

export function AdminAdoptionsPage() {
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-adoptions', page],
    queryFn:  () => api.get('/admin/adoptions', { params: { page, per_page: 15 } }).then(r => r.data),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status, notes }) => api.put(`/admin/adoptions/${id}/status`, { status, notes }),
    onSuccess: () => {
      toast.success('Application status updated.')
      qc.invalidateQueries({ queryKey: ['admin-adoptions'] })
      setShowModal(false)
    },
    onError: () => toast.error('Failed to update status.'),
  })

  const applications = data?.data ?? []
  const meta         = data?.meta ?? {}

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-white">Adoption Applications</h1>
        <p className="text-neutral-400 text-sm mt-1">
          {meta.total ? `${meta.total} total applications` : 'Review and manage all adoption applications'}
        </p>
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
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase">Applicant</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase hidden sm:table-cell">Cat</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase hidden md:table-cell">Submitted</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {applications.length > 0 ? applications.map(app => (
                  <tr key={app.id} className="hover:bg-neutral-950/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white text-sm font-medium">{app.applicant?.name ?? '—'}</p>
                      <p className="text-neutral-500 text-xs">{app.applicant?.email}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-neutral-300 text-sm">{app.pet?.name ?? '—'}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-neutral-400 text-sm">
                      {format(new Date(app.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3"><Badge status={app.status} /></td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { setSelected(app); setShowModal(true) }}
                        className="btn-ghost btn-sm"
                      >
                        <Eye className="w-4 h-4" /> Review
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-neutral-500">
                      No applications found.
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

      {/* Review Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={`Review: ${selected?.applicant?.name}'s Application`}
      >
        {selected && (
          <ReviewForm
            application={selected}
            statusOptions={STATUS_OPTIONS}
            isPending={statusMutation.isPending}
            onSubmit={(status, notes) => statusMutation.mutate({ id: selected.id, status, notes })}
          />
        )}
      </Modal>
    </div>
  )
}

function ReviewForm({ application: app, statusOptions, isPending, onSubmit }) {
  const [status, setStatus] = useState(app.status)
  const [notes,  setNotes]  = useState('')

  return (
    <div className="space-y-5">
      {/* Application details */}
      <div className="bg-neutral-950 rounded-xl p-4 space-y-3 text-sm">
        <div>
          <span className="text-neutral-500">Pet:</span>
          <span className="text-white ml-2">{app.pet?.name}</span>
        </div>
        <div>
          <span className="text-neutral-500">Applicant:</span>
          <span className="text-white ml-2">{app.applicant?.name} ({app.applicant?.email})</span>
        </div>
        {app.living_situation && (
          <div>
            <span className="text-neutral-500">Living Situation:</span>
            <span className="text-white ml-2 capitalize">{app.living_situation}</span>
          </div>
        )}
        {app.experience && (
          <div>
            <span className="text-neutral-500 block mb-1">Experience:</span>
            <p className="text-neutral-300 bg-neutral-900 rounded-lg p-3">{app.experience}</p>
          </div>
        )}
        {app.reason && (
          <div>
            <span className="text-neutral-500 block mb-1">Reason for adoption:</span>
            <p className="text-neutral-300 bg-neutral-900 rounded-lg p-3">{app.reason}</p>
          </div>
        )}
      </div>

      {/* Update status */}
      <div>
        <label className="label text-neutral-300">Update Status</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="input bg-neutral-950 border-neutral-700 text-white capitalize"
        >
          {statusOptions.map(s => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label text-neutral-300">Notes for applicant <span className="text-neutral-500">(optional)</span></label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          placeholder="Add any notes or feedback for the applicant…"
          className="input bg-neutral-950 border-neutral-700 text-white resize-none"
        />
      </div>

      <button
        onClick={() => onSubmit(status, notes)}
        disabled={isPending || status === app.status}
        className="btn-primary w-full justify-center"
      >
        {isPending && <RefreshCw className="w-4 h-4 animate-spin" />}
        {isPending ? 'Saving…' : 'Update Application'}
      </button>
    </div>
  )
}
