import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adoptionService } from '@/services/adoptionService'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Pagination } from '@/components/ui/Pagination'
import { Link } from 'react-router-dom'
import { Heart, Clock, ImageOff, FileText } from 'lucide-react'
import { format } from 'date-fns'

export function MyApplicationsPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['my-applications', page],
    queryFn:  () => adoptionService.getMyApplications({ page, per_page: 10 }),
  })

  const applications = data?.data ?? []
  const meta         = data?.meta ?? {}

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-white">My Applications</h1>
        <p className="text-neutral-400 text-sm mt-1">
          Track all your cat adoption applications in one place.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      ) : applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map(app => (
            <ApplicationCard key={app.id} app={app} />
          ))}

          {meta.last_page > 1 && (
            <Pagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              onPageChange={setPage}
              className="mt-6"
            />
          )}
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center">
          <Heart className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
          <h2 className="text-white font-semibold text-lg mb-1">No applications yet</h2>
          <p className="text-neutral-400 text-sm mb-5">
            Find your perfect feline companion and submit your first adoption application.
          </p>
          <Link to="/cats" className="btn-primary">
            Browse Available Cats
          </Link>
        </div>
      )}
    </div>
  )
}

function ApplicationCard({ app }) {
  const primaryImg = app.pet?.images?.find(i => i.is_primary) ?? app.pet?.images?.[0]
  const latestStatus = app.statuses?.[app.statuses.length - 1]

  return (
    <div className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 transition-colors">
      <div className="flex items-start gap-4">
        {/* Pet image */}
        <div className="shrink-0">
          {primaryImg ? (
            <img
              src={primaryImg.url}
              alt={app.pet?.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-neutral-800 flex items-center justify-center">
              <ImageOff className="w-6 h-6 text-neutral-600" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <Link
                to={`/cats/${app.pet_id}`}
                className="text-white font-semibold hover:text-brand-400 transition-colors"
              >
                {app.pet?.name ?? 'Cat'}
              </Link>
              {app.pet?.breed && (
                <span className="text-neutral-500 text-xs ml-2">{app.pet.breed}</span>
              )}
            </div>
            <Badge status={app.status} />
          </div>

          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Submitted {format(new Date(app.created_at), 'MMM d, yyyy')}
            </span>
            {latestStatus && (
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                Updated {format(new Date(latestStatus.created_at), 'MMM d, yyyy')}
              </span>
            )}
          </div>

          {/* Status timeline */}
          {app.statuses?.length > 0 && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {app.statuses.map((s, idx) => (
                <div
                  key={s.id}
                  className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    idx === app.statuses.length - 1
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                      : 'bg-neutral-800 text-neutral-500'
                  }`}
                >
                  <span className="capitalize">{s.status}</span>
                </div>
              ))}
            </div>
          )}

          {/* Staff notes */}
          {latestStatus?.notes && (
            <p className="mt-2 text-xs text-neutral-400 bg-neutral-950 rounded-lg px-3 py-2 border border-neutral-800">
              <span className="text-neutral-500">Note: </span>{latestStatus.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
