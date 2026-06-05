import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Shield, Clock, Star, Cat, Users } from 'lucide-react'
import { usePets } from '@/hooks/usePets'
import { useAuth } from '@/context/AuthContext'
import { PetCard } from '@/components/pets/PetCard'
import { Skeleton } from '@/components/ui/Skeleton'

const stats = [
  { icon: Cat, label: 'Cats in our care', value: '120+' },
  { icon: Heart, label: 'Successful adoptions', value: '850+' },
  { icon: Users, label: 'Happy families', value: '800+' },
  { icon: Star, label: 'Years of service', value: '5+' },
]

const steps = [
  {
    icon: '🔍',
    title: 'Browse Our Cats',
    desc: 'Explore our available cats and find your perfect furry companion.',
  },
  {
    icon: '📝',
    title: 'Submit Application',
    desc: 'Fill out our adoption application to tell us about your home.',
  },
  {
    icon: '🤝',
    title: 'Meet & Greet',
    desc: "We'll arrange a meeting with your potential new family member.",
  },
  {
    icon: '🏠',
    title: 'Welcome Home!',
    desc: 'Bring your new cat home and start making memories together.',
  },
]

export function HomePage() {
  const { user } = useAuth()
  const { data, isLoading } = usePets({ per_page: 6, status: 'available', is_featured: true })
  const featuredPets = data?.data ?? []

  return (
    <div className="text-white">
      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Gradient BG */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(249,115,22,0.3), transparent)',
          }}
        />
        {/* Floating orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-brand-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="container-page relative z-10 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-500/15 border border-brand-500/25 rounded-full px-4 py-1.5 text-brand-400 text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
              New cats available every week
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Find Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">
                Purrfect
              </span>
              <br />
              Companion
            </h1>

            <p className="text-xl text-neutral-400 leading-relaxed mb-10 max-w-xl">
              Give a cat a loving forever home. Browse our available cats, submit an adoption application, and start your journey with a new furry family member.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/cats" className="btn-primary btn-lg group">
                Browse Available Cats
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="btn-secondary btn-lg">
                How it Works
              </Link>
            </div>

            {/* Stats bar */}
            <div className="flex flex-wrap gap-8 mt-14">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-brand-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{value}</div>
                    <div className="text-xs text-neutral-500">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Cats ── */}
      <section className="py-20 bg-neutral-900">
        <div className="container-page">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-2">Meet our cats</p>
              <h2 className="section-title text-white">Featured Cats</h2>
            </div>
            <Link
              to="/cats"
              className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-2xl" />
              ))}
            </div>
          ) : featuredPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPets.map(pet => <PetCard key={pet.id} pet={pet} />)}
            </div>
          ) : (
            <div className="text-center py-20 text-neutral-500">
              <Cat className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No featured cats at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="py-20 bg-neutral-950">
        <div className="container-page">
          <div className="text-center mb-14">
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-2">Simple process</p>
            <h2 className="section-title text-white text-3xl">How Adoption Works</h2>
            <p className="text-neutral-400 mt-3 max-w-xl mx-auto">
              We've made the adoption process as smooth as possible so you can focus on what matters — welcoming your new companion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="relative bg-neutral-900 rounded-2xl p-6 border border-neutral-800 hover:border-brand-500/30 transition-all duration-300 group"
              >
                <div className="absolute -top-3 -left-3 w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  {i + 1}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-white font-semibold mb-2 group-hover:text-brand-400 transition-colors">{step.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-r from-brand-600 to-brand-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="container-page relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Ready to Give a Cat a Forever Home?
          </h2>
          <p className="text-brand-100 text-lg mb-8 max-w-xl mx-auto">
            Join hundreds of families who've found their perfect feline companion through PawsHome.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/cats" className="btn bg-white text-brand-700 hover:bg-brand-50 btn-lg font-semibold">
              Start Browsing <ArrowRight className="w-5 h-5" />
            </Link>
            {!user && (
              <Link to="/register" className="btn border-2 border-white/40 text-white hover:bg-white/10 btn-lg">
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
