import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/axios'
import { Skeleton } from '@/components/ui/Skeleton'
import { Pagination } from '@/components/ui/Pagination'
import { format } from 'date-fns'
import { ToggleLeft, ToggleRight, Search } from 'lucide-react'
import toast from 'react-hot-toast'

export function AdminUsersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search],
    queryFn:  () => api.get('/admin/users', { params: { page, per_page: 15, search: search || undefined } }).then(r => r.data),
  })

  const toggleMutation = useMutation({
    mutationFn: (userId) => api.patch(`/admin/users/${userId}/toggle`),
    onSuccess:  () => {
      toast.success('User status updated.')
      qc.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => toast.error('Failed to update user status.'),
  })

  const users = data?.data ?? []
  const meta  = data?.meta ?? {}

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Users</h1>
          <p className="text-neutral-400 text-sm mt-1">
            {meta.total ? `${meta.total} registered users` : 'Manage user accounts'}
          </p>
        </div>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <input
          type="text"
          placeholder="Search users by name or email…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="input bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500 pl-10"
          id="admin-users-search"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : (
        <>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase">User</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase hidden sm:table-cell">Roles</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase hidden md:table-cell">Joined</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase">Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {users.length > 0 ? users.map(user => (
                  <tr key={user.id} className="hover:bg-neutral-950/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-white text-sm font-medium">{user.name}</p>
                          <p className="text-neutral-500 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex gap-1.5 flex-wrap">
                        {user.roles?.map(r => (
                          <span key={r} className="badge-admin capitalize text-xs">{r}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-neutral-400 text-sm">
                      {format(new Date(user.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${user.is_active ? 'badge-available' : 'badge-rejected'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleMutation.mutate(user.id)}
                        disabled={toggleMutation.isPending}
                        className={`flex items-center gap-1.5 text-sm transition-colors ${
                          user.is_active
                            ? 'text-red-400 hover:text-red-300'
                            : 'text-emerald-400 hover:text-emerald-300'
                        }`}
                      >
                        {user.is_active
                          ? <ToggleRight className="w-5 h-5" />
                          : <ToggleLeft className="w-5 h-5" />
                        }
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-neutral-500">
                      No users found.
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
    </div>
  )
}
