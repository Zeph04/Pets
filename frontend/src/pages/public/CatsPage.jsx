import { useState } from 'react'
import { Search, SlidersHorizontal, X, Cat } from 'lucide-react'
import { usePets } from '@/hooks/usePets'
import { PetCard } from '@/components/pets/PetCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { Pagination } from '@/components/ui/Pagination'

const STATUS_OPTIONS = ['all', 'available', 'pending', 'adopted']
const GENDER_OPTIONS  = ['all', 'male', 'female']

export function CatsPage() {
  const [page,    setPage]    = useState(1)
  const [search,  setSearch]  = useState('')
  const [status,  setStatus]  = useState('')
  const [gender,  setGender]  = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading, isFetching } = usePets({
    page,
    per_page: 12,
    search:  search || undefined,
    status:  status || undefined,
    gender:  gender || undefined,
  })

  const pets     = data?.data ?? []
  const meta     = data?.meta ?? {}
  const hasMore  = meta.current_page < meta.last_page

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
  }

  const clearFilters = () => {
    setSearch('')
    setStatus('')
    setGender('')
    setPage(1)
  }

  const hasActiveFilters = search || status || gender

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <div className="bg-neutral-900 border-b border-neutral-800 py-10">
        <div className="container-page">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-2">Our residents</p>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">Available Cats</h1>
          <p className="text-neutral-400">
            {meta.total ? `${meta.total} cat${meta.total !== 1 ? 's' : ''} looking for a home` : 'Browse cats looking for a loving home'}
          </p>
        </div>
      </div>

      <div className="container-page py-8">
        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-3">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                id="cat-search"
                type="text"
                placeholder="Search by name or breed…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                className="input bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500 pl-10"
              />
              {search && (
                <button type="button" onClick={() => { setSearch(''); setPage(1) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`btn gap-2 ${showFilters ? 'bg-brand-500 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-brand-300" />}
            </button>
          </div>

          {showFilters && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-wrap gap-5 items-end">
              <div>
                <label className="label text-neutral-300">Status</label>
                <div className="flex gap-2 flex-wrap">
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => { setStatus(s === 'all' ? '' : s); setPage(1) }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                        (status === s) || (s === 'all' && !status)
                          ? 'bg-brand-500 text-white'
                          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label text-neutral-300">Gender</label>
                <div className="flex gap-2">
                  {GENDER_OPTIONS.map(g => (
                    <button
                      key={g}
                      onClick={() => { setGender(g === 'all' ? '' : g); setPage(1) }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                        (gender === g) || (g === 'all' && !gender)
                          ? 'bg-brand-500 text-white'
                          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors ml-auto"
                >
                  <X className="w-3.5 h-3.5" /> Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Grid */}
        <div className={`transition-opacity duration-200 ${isFetching ? 'opacity-70' : 'opacity-100'}`}>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
            </div>
          ) : pets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pets.map(pet => <PetCard key={pet.id} pet={pet} />)}
            </div>
          ) : (
            <div className="text-center py-24">
              <Cat className="w-16 h-16 mx-auto text-neutral-700 mb-4" />
              <h3 className="text-neutral-300 text-lg font-semibold">No cats found</h3>
              <p className="text-neutral-500 text-sm mt-1">Try adjusting your filters or search terms.</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="btn-primary mt-4">
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta.last_page > 1 && (
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={setPage}
            className="mt-10"
          />
        )}
      </div>
    </div>
  )
}
