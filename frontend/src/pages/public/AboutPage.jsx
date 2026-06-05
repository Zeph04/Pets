import { Link } from 'react-router-dom'
import { Heart, ShieldCheck, Clock, Star, Cat, ArrowRight } from 'lucide-react'

const values = [
  {
    icon: Heart,
    title: 'Cat Welfare First',
    desc: 'Every decision we make puts the wellbeing of our cats at the center. We ensure all cats are healthy, vaccinated, and ready for their new home.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted Process',
    desc: 'Our adoption process is thorough but fair — we screen adopters carefully to ensure every cat goes to a loving, permanent home.',
  },
  {
    icon: Clock,
    title: '5+ Years of Service',
    desc: 'Since 2019, we have been connecting cats with families. Our experience means we know how to make successful matches.',
  },
  {
    icon: Star,
    title: 'Ongoing Support',
    desc: "We don't disappear after adoption. We provide guidance and are always available for questions about your new cat.",
  },
]

const process = [
  {
    step: '01',
    title: 'Browse Available Cats',
    desc: 'Explore our catalog of cats looking for homes. Filter by age, gender, breed, and personality to find your perfect match.',
  },
  {
    step: '02',
    title: 'Create an Account',
    desc: 'Register for a free account to submit adoption applications and track your application status.',
  },
  {
    step: '03',
    title: 'Submit Application',
    desc: 'Fill out our adoption application with information about your home, lifestyle, and why you want to adopt.',
  },
  {
    step: '04',
    title: 'Review Process',
    desc: 'Our team reviews your application, and we may reach out for additional questions or a home visit.',
  },
  {
    step: '05',
    title: 'Meet Your Cat',
    desc: 'Once approved, we arrange a meet-and-greet so you and your potential new family member can get acquainted.',
  },
  {
    step: '06',
    title: 'Welcome Home!',
    desc: "After a successful meeting, you'll bring your new cat home and start building your bond together.",
  },
]

export function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 py-20 border-b border-neutral-800">
        <div className="container-page text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500/15 border border-brand-500/25 mb-6">
            <Cat className="w-8 h-8 text-brand-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">About PawsHome</h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We are a passionate team of cat lovers dedicated to finding forever homes for cats in need. 
            Our platform makes cat adoption simple, transparent, and joyful.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="py-20 container-page">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">Our Mission</p>
          <h2 className="text-3xl font-display font-bold mb-4">Every Cat Deserves a Loving Home</h2>
          <p className="text-neutral-400 leading-relaxed">
            PawsHome was founded with a single purpose: to reduce the number of cats without homes by creating 
            meaningful connections between cats and the families who will cherish them. We believe the right 
            match changes lives — for both the cat and the family.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-brand-500/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-brand-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-neutral-900 border-y border-neutral-800">
        <div className="container-page">
          <div className="text-center mb-12">
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">The Process</p>
            <h2 className="text-3xl font-display font-bold">How Adoption Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {process.map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
                  {step}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 container-page text-center">
        <h2 className="text-3xl font-display font-bold mb-4">Ready to Find Your Cat?</h2>
        <p className="text-neutral-400 mb-8 max-w-md mx-auto">
          Start browsing our available cats today and take the first step toward welcoming a new family member.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/cats" className="btn-primary btn-lg">
            Browse Cats <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/register" className="btn-secondary btn-lg">
            Create Account
          </Link>
        </div>
      </section>
    </div>
  )
}
