import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { petService } from '@/services/petService'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components/ui/Spinner'
import { Badge } from '@/components/ui/Badge'
import {
  ArrowLeft, Heart, MapPin, Calendar, Syringe,
  Weight, Palette, Info, ImageOff,
} from 'lucide-react'

export function CatDetailPage() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()

  const { data: pet, isLoading, isError } = useQuery({
    queryKey: ['pet', id],
    queryFn:  () => petService.getOne(id),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !pet) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white gap-4">
        <span className="text-6xl">😿</span>
        <h2 className="text-2xl font-bold">Cat not found</h2>
        <Link to="/cats" className="btn-primary">Back to Cats</Link>
      </div>
    )
  }

  const primaryImage = pet.images?.find(i => i.is_primary) ?? pet.images?.[0]
  const otherImages  = pet.images?.filter(i => i.id !== primaryImage?.id) ?? []
  const isAvailable  = pet.status === 'available'

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="container-page py-8">
        {/* Back link */}
        <Link to="/cats" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to all cats
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Images */}
          <div className="space-y-3">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800">
              {primaryImage ? (
                <img
                  src={primaryImage.url}
                  alt={pet.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageOff className="w-12 h-12 text-neutral-600" />
                </div>
              )}
            </div>

            {otherImages.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {otherImages.map(img => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt={pet.name}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-neutral-700 hover:border-brand-500 cursor-pointer shrink-0 transition-colors"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-display font-bold">{pet.name}</h1>
                {pet.breed && <p className="text-neutral-400 mt-1">{pet.breed}</p>}
              </div>
              <Badge status={pet.status} />
            </div>

            {/* Quick info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {[
                { icon: Calendar, label: 'Age', value: pet.age ?? 'Unknown' },
                { icon: Heart,    label: 'Gender', value: pet.gender ?? 'Unknown', capitalize: true },
                { icon: Weight,   label: 'Weight', value: pet.weight ? `${pet.weight} kg` : 'Unknown' },
                { icon: Palette,  label: 'Color', value: pet.color ?? 'Unknown' },
                { icon: MapPin,   label: 'Location', value: pet.location ?? 'Shelter' },
                { icon: Syringe,  label: 'Vaccines', value: `${pet.vaccinations?.length ?? 0} recorded` },
              ].map(({ icon: Icon, label, value, capitalize }) => (
                <div key={label} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 text-neutral-500 text-xs mb-1">
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </div>
                  <p className={`text-sm font-medium text-white ${capitalize ? 'capitalize' : ''}`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Description */}
            {pet.description && (
              <div className="mb-6">
                <div className="flex items-center gap-2 text-neutral-400 text-sm mb-2">
                  <Info className="w-4 h-4" /> About {pet.name}
                </div>
                <p className="text-neutral-300 leading-relaxed text-sm">{pet.description}</p>
              </div>
            )}

            {/* Adopt CTA */}
            <div className="border-t border-neutral-800 pt-6">
              {isAvailable ? (
                isAuthenticated ? (
                  <Link to={`/adopt/${pet.id}`} className="btn-primary btn-lg w-full justify-center">
                    <Heart className="w-5 h-5" />
                    Apply to Adopt {pet.name}
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link to="/login" state={{ from: `/adopt/${pet.id}` }} className="btn-primary btn-lg w-full justify-center">
                      Sign in to Apply
                    </Link>
                    <p className="text-center text-neutral-500 text-sm">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-brand-400 hover:underline">Register free</Link>
                    </p>
                  </div>
                )
              ) : (
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center">
                  <p className="text-neutral-400 text-sm">
                    {pet.name} is not currently available for adoption.
                  </p>
                  <Link to="/cats" className="btn-secondary mt-3">
                    Browse Other Cats
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vaccinations */}
        {pet.vaccinations?.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-display font-semibold mb-4">Vaccination Records</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pet.vaccinations.map(v => (
                <div key={v.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Syringe className="w-4 h-4 text-brand-400" />
                    <span className="font-medium text-sm">{v.vaccine_name}</span>
                  </div>
                  <p className="text-neutral-500 text-xs">
                    {new Date(v.administered_at).toLocaleDateString()}
                    {v.next_due_date && ` · Next due: ${new Date(v.next_due_date).toLocaleDateString()}`}
                  </p>
                  {v.notes && <p className="text-neutral-400 text-xs mt-1">{v.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
