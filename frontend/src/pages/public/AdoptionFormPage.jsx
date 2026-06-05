import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { petService } from '@/services/petService'
import { adoptionService } from '@/services/adoptionService'
import { Spinner } from '@/components/ui/Spinner'
import { ArrowLeft, Heart, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export function AdoptionFormPage() {
  const { petId } = useParams()
  const navigate   = useNavigate()
  const qc         = useQueryClient()

  const { data: pet, isLoading: petLoading } = useQuery({
    queryKey: ['pet', petId],
    queryFn:  () => petService.getOne(petId),
  })

  const { register, handleSubmit, formState: { errors } } = useForm()

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => adoptionService.create({ ...data, pet_id: petId }),
    onSuccess: () => {
      toast.success("Application submitted! We'll be in touch soon.")
      qc.invalidateQueries({ queryKey: ['my-applications'] })
      navigate('/dashboard/applications')
    },
    onError: (err) => {
      const msg = err?.response?.data?.message ?? 'Failed to submit application.'
      toast.error(msg)
    },
  })

  if (petLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!pet || pet.status !== 'available') {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white gap-4">
        <AlertCircle className="w-12 h-12 text-amber-400" />
        <h2 className="text-xl font-bold">This cat is not available for adoption</h2>
        <Link to="/cats" className="btn-primary">Browse Other Cats</Link>
      </div>
    )
  }

  const primaryImg = pet.images?.find(i => i.is_primary) ?? pet.images?.[0]

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-10">
      <div className="container-page max-w-3xl">
        <Link to={`/cats/${petId}`} className="inline-flex items-center gap-2 text-neutral-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to {pet.name}'s profile
        </Link>

        {/* Pet summary card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-center gap-4 mb-8">
          {primaryImg ? (
            <img src={primaryImg.url} alt={pet.name} className="w-16 h-16 rounded-xl object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-neutral-800 flex items-center justify-center text-2xl">🐱</div>
          )}
          <div>
            <h2 className="text-white font-semibold text-lg">Adopting: {pet.name}</h2>
            <p className="text-neutral-400 text-sm">{pet.breed} · {pet.gender} · {pet.age}</p>
          </div>
          <Heart className="w-6 h-6 text-brand-400 ml-auto" />
        </div>

        {/* Form */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-7">
          <h1 className="text-2xl font-display font-bold mb-1">Adoption Application</h1>
          <p className="text-neutral-400 text-sm mb-6">
            Tell us a little about yourself and your home so we can find the perfect match.
          </p>

          <form onSubmit={handleSubmit(mutate)} className="space-y-5">
            {/* Living situation */}
            <div>
              <label className="label">What type of home do you live in?</label>
              <select
                {...register('living_situation', { required: 'Please select your living situation' })}
                className="input bg-neutral-950 border-neutral-700 text-white"
              >
                <option value="">Select…</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="other">Other</option>
              </select>
              {errors.living_situation && <p className="error-text">{errors.living_situation.message}</p>}
            </div>

            {/* Has yard */}
            <div>
              <label className="label">Do you have a yard or outdoor space?</label>
              <div className="flex gap-4">
                {['yes', 'no'].map(v => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value={v} {...register('has_yard', { required: 'Required' })}
                      className="accent-brand-500" />
                    <span className="text-sm capitalize text-neutral-300">{v}</span>
                  </label>
                ))}
              </div>
              {errors.has_yard && <p className="error-text">{errors.has_yard.message}</p>}
            </div>

            {/* Other pets */}
            <div>
              <label className="label">Do you have other pets?</label>
              <textarea
                {...register('other_pets')}
                rows={2}
                placeholder="If yes, please describe them (species, breed, age)…"
                className="input bg-neutral-950 border-neutral-700 text-white resize-none"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="label">Previous experience with cats *</label>
              <textarea
                {...register('experience', { required: 'Please describe your experience' })}
                rows={3}
                placeholder="Tell us about any previous experience caring for cats or other pets…"
                className="input bg-neutral-950 border-neutral-700 text-white resize-none"
              />
              {errors.experience && <p className="error-text">{errors.experience.message}</p>}
            </div>

            {/* Reason */}
            <div>
              <label className="label">Why do you want to adopt {pet.name}? *</label>
              <textarea
                {...register('reason', { required: 'Please tell us why you want to adopt', minLength: { value: 50, message: 'Please write at least 50 characters' } })}
                rows={4}
                placeholder={`Tell us why ${pet.name} is the right cat for you…`}
                className="input bg-neutral-950 border-neutral-700 text-white resize-none"
              />
              {errors.reason && <p className="error-text">{errors.reason.message}</p>}
            </div>

            {/* Notes */}
            <div>
              <label className="label">Additional notes <span className="text-neutral-500 font-normal">(optional)</span></label>
              <textarea
                {...register('notes')}
                rows={2}
                placeholder="Anything else you'd like us to know?"
                className="input bg-neutral-950 border-neutral-700 text-white resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary btn-lg w-full justify-center mt-2"
              id="submit-adoption"
            >
              {isPending ? <Spinner size="sm" /> : <Heart className="w-5 h-5" />}
              {isPending ? 'Submitting…' : `Submit Adoption Application for ${pet.name}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
