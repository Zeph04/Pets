import { Outlet, NavLink, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { LayoutDashboard, Heart, User, LogOut, Cat } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/applications', label: 'My Applications', icon: Heart },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
]

export function DashboardLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 hidden md:flex flex-col">
        <div className="p-5 border-b border-neutral-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Cat className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-display font-bold">PawsHome</span>
          </Link>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar_url}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/30"
            />
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-neutral-400 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-neutral-800 space-y-1">
          <Link
            to="/cats"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
          >
            <Cat className="w-4 h-4" /> Browse Cats
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden bg-neutral-900 border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
              <Cat className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-sm">PawsHome</span>
          </Link>
          <button onClick={logout} className="text-neutral-400 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
