import { Link } from 'react-router-dom'
import { Heart, ImageOff, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

export function PetCard({ pet }) {
  const primaryImage = pet.images?.find(i => i.is_primary) ?? pet.images?.[0]
  const isAvailable  = pet.status === 'available'

  return (
    <Link
      to={`/cats/${pet.id}`}
      className="group block bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-brand-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-800">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={pet.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="w-8 h-8 text-neutral-600" />
          </div>
        )}

        {/* Status badge overlay */}
        <div className="absolute top-3 left-3">
          <Badge status={pet.status} />
        </div>

        {/* Featured badge */}
        {pet.is_featured && (
          <div className="absolute top-3 right-3 bg-brand-500 rounded-full px-2 py-0.5 text-white text-xs font-semibold flex items-center gap-1">
            <Heart className="w-3 h-3" /> Featured
          </div>
        )}

        {/* Hover overlay */}
        {isAvailable && (
          <div className="absolute inset-0 bg-brand-500/0 group-hover:bg-brand-500/10 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white text-brand-700 font-semibold text-sm px-4 py-2 rounded-full shadow-lg">
              Meet {pet.name} →
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-white font-semibold text-lg leading-tight group-hover:text-brand-400 transition-colors">
            {pet.name}
          </h3>
          {pet.gender && (
            <span className="text-neutral-500 text-xs capitalize mt-0.5">{pet.gender}</span>
          )}
        </div>

        {pet.breed && (
          <p className="text-neutral-400 text-sm mb-2">{pet.breed}</p>
        )}

        <div className="flex items-center gap-3 text-xs text-neutral-500">
          {pet.age && <span>{pet.age}</span>}
          {pet.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {pet.location}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
