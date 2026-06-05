import { useQuery } from '@tanstack/react-query'
import api from '@/api/axios'
import { Skeleton } from '@/components/ui/Skeleton'
import { Cat, Heart, Users, TrendingUp } from 'lucide-react'

export function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then(r => r.data.data),
  })

  const stats = [
    {
      label: 'Total Cats',
      value: data?.total_pets ?? '—',
      icon: Cat,
      color: 'text-brand-400 bg-brand-500/15 border-brand-500/20',
    },
    {
      label: 'Adoptions',
      value: data?.total_adoptions ?? '—',
      icon: Heart,
      color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/20',
    },
    {
      label: 'Users',
      value: data?.total_users ?? '—',
      icon: Users,
      color: 'text-purple-400 bg-purple-500/15 border-purple-500/20',
    },
    {
      label: 'Pending Reviews',
      value: data?.pending_applications ?? '—',
      icon: TrendingUp,
      color: 'text-amber-400 bg-amber-500/15 border-amber-500/20',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white">Admin Dashboard</h1>
        <p className="text-neutral-400 text-sm mt-1">Overview of PawsHome platform activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {isLoading ? <Skeleton className="h-8 w-16 inline-block" /> : value}
            </div>
            <div className="text-neutral-400 text-sm">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Manage Cats', desc: 'View and update cat profiles, statuses, and availability.', to: '/admin/cats', icon: Cat },
          { title: 'Review Adoptions', desc: 'Process pending adoption applications and update statuses.', to: '/admin/adoptions', icon: Heart },
          { title: 'Manage Users', desc: 'View and manage user accounts and permissions.', to: '/admin/users', icon: Users },
        ].map(({ title, desc, icon: Icon }) => (
          <div key={title} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-colors">
            <Icon className="w-7 h-7 text-brand-400 mb-3" />
            <h3 className="text-white font-semibold mb-1">{title}</h3>
            <p className="text-neutral-400 text-sm">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
