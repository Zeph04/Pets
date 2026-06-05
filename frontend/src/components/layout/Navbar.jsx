import { Link, useLocation } from 'react-router-dom'
import { Cat, Menu, X, Bell, ChevronDown, LogOut, User, LayoutDashboard, ShieldCheck } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { clsx } from 'clsx'

const NAV_LINKS = [
  { to: '/',      label: 'Home'  },
  { to: '/cats',  label: 'Adopt' },
  { to: '/about', label: 'About' },
]

export function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const location    = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen,   setUserOpen]   = useState(false)
  const dropRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setUserOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on navigation
  useEffect(() => setMobileOpen(false), [location.pathname])

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <header className="sticky top-0 z-40 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800/60">
      <nav className="container-page flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow">
            <Cat className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white">
            Paws<span className="text-brand-400">Home</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={clsx(
                'px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200',
                isActive(to)
                  ? 'bg-brand-500/15 text-brand-400'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* Notification bell */}
              <button
                className="relative p-2 rounded-xl text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-500" />
              </button>

              {/* User dropdown */}
              <div className="relative" ref={dropRef}>
                <button
                  id="user-menu-btn"
                  onClick={() => setUserOpen(o => !o)}
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-neutral-800 transition-colors"
                >
                  <img
                    src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? 'U')}&background=ff5a1f&color=fff`}
                    alt={user?.name}
                    className="h-8 w-8 rounded-full object-cover border-2 border-brand-800"
                  />
                  <span className="hidden sm:block text-sm font-medium text-neutral-300 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className={clsx('h-4 w-4 text-neutral-500 transition-transform', userOpen && 'rotate-180')} />
                </button>

                {userOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl py-1 animate-fade-in">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-neutral-800">
                      <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                      <p className="text-neutral-500 text-xs truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-400 hover:bg-brand-500/10 transition-colors"
                      >
                        <ShieldCheck className="h-4 w-4" /> Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-neutral-800" />
                    <button
                      onClick={() => { setUserOpen(false); logout() }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost text-sm text-neutral-400 hover:text-white">Sign In</Link>
              <Link to="/register" className="btn-primary text-sm">Get Started</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden p-2 rounded-xl text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-800 py-3 animate-fade-in">
          <div className="container-page space-y-1">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={clsx(
                  'block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive(to)
                    ? 'bg-brand-500/15 text-brand-400'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                )}
              >
                {label}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="pt-2 pb-1 border-t border-neutral-800 space-y-1">
                <Link to="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-neutral-400 hover:text-white hover:bg-neutral-800">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <Link to="/dashboard/profile" className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-neutral-400 hover:text-white hover:bg-neutral-800">
                  <User className="h-4 w-4" /> Profile
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-brand-400 hover:bg-brand-500/10">
                    <ShieldCheck className="h-4 w-4" /> Admin Panel
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2 pb-1 border-t border-neutral-800">
                <Link to="/login" className="btn btn-secondary flex-1 justify-center text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary flex-1 justify-center text-sm">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
