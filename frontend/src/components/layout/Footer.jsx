import { Link } from 'react-router-dom'
import { Cat, Heart, Mail, Github, Twitter } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export function Footer() {
  const { user } = useAuth()

  const accountLinks = user
    ? [
        { to: '/dashboard', label: 'My Dashboard' },
        { to: '/dashboard/applications', label: 'My Applications' },
      ]
    : [
        { to: '/login', label: 'Sign In' },
        { to: '/register', label: 'Register' },
      ]

  return (
    <footer className="bg-neutral-900 border-t border-neutral-800 mt-auto">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <Cat className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-display font-bold text-lg">PawsHome</span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
              Connecting loving families with cats in need. Every cat deserves a warm home and endless cuddles.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-brand-500 transition-colors flex items-center justify-center">
                <Twitter className="w-4 h-4 text-neutral-400 hover:text-white" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-brand-500 transition-colors flex items-center justify-center">
                <Github className="w-4 h-4 text-neutral-400 hover:text-white" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-brand-500 transition-colors flex items-center justify-center">
                <Mail className="w-4 h-4 text-neutral-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Adopt</h4>
            <ul className="space-y-2">
              {[
                { to: '/cats', label: 'Available Cats' },
                { to: '/about', label: 'How it Works' },
                { to: '/cats?status=available', label: 'Ready to Adopt' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-neutral-400 hover:text-brand-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2">
              {accountLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-neutral-400 hover:text-brand-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} PawsHome. Made with <Heart className="inline w-3.5 h-3.5 text-brand-500" /> for cats everywhere.
          </p>
          <div className="flex gap-5">
            <a href="#" className="text-neutral-500 hover:text-neutral-300 text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-neutral-500 hover:text-neutral-300 text-xs transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
