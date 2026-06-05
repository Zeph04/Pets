import { useForm } from 'react-hook-form'
import { useCreatePet, useUpdatePet } from '@/hooks/usePets'
import { Spinner } from '@/components/ui/Spinner'
import { Check, Camera, ImageOff } from 'lucide-react'
import { useState } from 'react'

export function PetForm({ pet = null, onSuccess }) {
  const isEditing = !!pet
  const createPet = useCreatePet()
  const updatePet = useUpdatePet(pet?.id)
  
  const [imagePreview, setImagePreview] = useState(
    pet?.images?.find(i => i.is_primary)?.url || null
  )

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      name: pet?.name || '',
      breed: pet?.breed || '',
      gender: pet?.gender || 'unknown',
      color: pet?.color || '',
      weight: pet?.weight || '',
      birthday: pet?.birthday ? pet.birthday.split('T')[0] : '',
      description: pet?.description || '',
      status: pet?.status || 'available',
      is_featured: pet?.is_featured || false,
    }
  })

  const onSubmit = (data) => {
    // Convert empty strings to null for optional fields if needed, 
    // or just let FormData handle it.
    const fileInput = document.getElementById('pet-image-upload')
    if (fileInput?.files?.[0]) {
      data.image = fileInput.files[0]
    } else {
      delete data.image
    }

    // Format birthday if present
    if (!data.birthday) delete data.birthday

    // Checkbox returns boolean, which is fine
    data.is_featured = data.is_featured ? 1 : 0

    const mutation = isEditing ? updatePet : createPet
    
    mutation.mutate(data, {
      onSuccess: () => {
        if (onSuccess) onSuccess()
      }
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const isPending = createPet.isPending || updatePet.isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Image Upload Area */}
        <div className="sm:w-1/3 flex flex-col gap-2">
          <label className="label text-neutral-300">Profile Image</label>
          <div className="relative aspect-square w-full rounded-2xl border-2 border-dashed border-neutral-700 hover:border-brand-500/50 bg-neutral-900/50 overflow-hidden flex items-center justify-center transition-colors group cursor-pointer">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-4">
                <ImageOff className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                <span className="text-xs text-neutral-500">Upload Image</span>
              </div>
            )}
            
            {/* Overlay for change */}
            <div className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center transition-opacity ${imagePreview ? 'opacity-0 group-hover:opacity-100' : ''}`}>
              <Camera className="w-8 h-8 text-white mb-1" />
              <span className="text-white text-xs font-medium">{imagePreview ? 'Change Image' : 'Choose File'}</span>
            </div>
            
            <input 
              id="pet-image-upload"
              type="file" 
              accept="image/*" 
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageChange}
            />
          </div>
          <p className="text-xs text-neutral-500 mt-1">JPEG, PNG, WEBP up to 5MB.</p>
        </div>

        {/* Form Fields */}
        <div className="sm:w-2/3 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label text-neutral-300">Name *</label>
              <input
                {...register('name', { required: 'Name is required' })}
                className={`input bg-neutral-950 border-neutral-700 text-white ${errors.name ? 'input-error' : ''}`}
                placeholder="Cat's name"
              />
              {errors.name && <p className="error-text">{errors.name.message}</p>}
            </div>
            
            <div>
              <label className="label text-neutral-300">Breed *</label>
              <input
                {...register('breed', { required: 'Breed is required' })}
                className={`input bg-neutral-950 border-neutral-700 text-white ${errors.breed ? 'input-error' : ''}`}
                placeholder="e.g. Domestic Shorthair"
              />
              {errors.breed && <p className="error-text">{errors.breed.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="label text-neutral-300">Gender</label>
              <select
                {...register('gender')}
                className="input select-custom bg-neutral-950 border-neutral-700 text-white capitalize"
              >
                <option value="unknown">Unknown</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            
            <div>
              <label className="label text-neutral-300">Color</label>
              <input
                {...register('color')}
                className="input bg-neutral-950 border-neutral-700 text-white"
                placeholder="e.g. Orange Tabby"
              />
            </div>
            
            <div>
              <label className="label text-neutral-300">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                {...register('weight', { min: 0, max: 50 })}
                className="input bg-neutral-950 border-neutral-700 text-white"
                placeholder="4.5"
              />
            </div>
          </div>

          <div>
            <label className="label text-neutral-300">Birthday (approx)</label>
            <input
              type="date"
              {...register('birthday')}
              className="input bg-neutral-950 border-neutral-700 text-white"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="label text-neutral-300">Description</label>
        <textarea
          {...register('description')}
          rows={4}
          className="input bg-neutral-950 border-neutral-700 text-white resize-none"
          placeholder="Tell us about the cat's personality, history, and needs..."
        />
      </div>

      <div className="flex flex-wrap items-center gap-6 p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center">
            <input 
              type="checkbox" 
              {...register('is_featured')} 
              className="peer appearance-none w-5 h-5 rounded border border-neutral-600 bg-neutral-900 checked:bg-brand-500 checked:border-brand-500 transition-colors"
            />
            <Check className="absolute left-0.5 top-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
          </div>
          <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">Featured Cat (Shows on Home Page)</span>
        </label>
        
        <div className="flex-1 min-w-[200px]">
          <label className="sr-only">Status</label>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-400">Status:</span>
            <select
              {...register('status')}
              className="input select-custom bg-neutral-900 border-neutral-700 text-white py-1.5 h-auto text-sm capitalize"
            >
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="adopted">Adopted</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => onSuccess && onSuccess()}
          className="btn-secondary"
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary min-w-[120px] justify-center"
          disabled={isPending}
        >
          {isPending ? <Spinner size="sm" /> : (isEditing ? 'Save Changes' : 'Add Cat')}
        </button>
      </div>
    </form>
  )
}
