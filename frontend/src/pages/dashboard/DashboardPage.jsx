import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useMyAdoptions } from '@/hooks/useAdoptions'
import { Cat, Heart, User, ArrowRight, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'

export function DashboardPage() {
  const { user } = useAuth()
  const { data, isLoading } = useMyAdoptions({ per_page: 5 })
  const applications = data?.data ?? []

  const stats = [
    {
      icon: Heart,
      label: 'My Applications',
      value: data?.meta?.total ?? '—',
      to: '/dashboard/applications',
      color: 'text-brand-400 bg-brand-500/15 border-brand-500/20',
    },
    {
      icon: Cat,
      label: 'Available Cats',
      value: 'Browse',
      to: '/cats',
      color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/20',
    },
    {
      icon: User,
      label: 'My Profile',
      value: 'Manage',
      to: '/dashboard/profile',
      color: 'text-purple-400 bg-purple-500/15 border-purple-500/20',
    },
  ]

  return (
    <div>
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-neutral-400 mt-1 text-sm">
          Here's a summary of your adoption journey with PawsHome.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, to, color }) => (
          <Link
            key={to}
            to={to}
            className="group bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-white mb-0.5">{isLoading ? '…' : value}</div>
            <div className="text-neutral-400 text-sm flex items-center gap-1">
              {label}
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-lg">Recent Applications</h2>
          <Link
            to="/dashboard/applications"
            className="text-brand-400 hover:text-brand-300 text-sm flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : applications.length > 0 ? (
          <div className="space-y-3">
            {applications.map(app => (
              <div
                key={app.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors"
              >
                {app.pet?.primary_image ? (
                  <img src={app.pet.primary_image} alt={app.pet.name} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center text-xl">🐱</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">{app.pet?.name ?? 'Cat'}</p>
                  <p className="text-neutral-500 text-xs flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge status={app.status} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Heart className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-400 text-sm">No applications yet</p>
            <Link to="/cats" className="btn-primary mt-4 btn-sm">
              Browse Cats
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
