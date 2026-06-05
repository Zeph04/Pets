<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pet extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'breed',
        'species',
        'birthday',
        'gender',
        'color',
        'description',
        'weight',
        'status',
        'is_featured',
        'featured_image',
    ];

    protected function casts(): array
    {
        return [
            'birthday'    => 'date',
            'weight'      => 'float',
            'is_featured' => 'boolean',
            'deleted_at'  => 'datetime',
        ];
    }

    // ─── Status Constants ────────────────────────────────────────────────────

    const STATUS_AVAILABLE   = 'available';
    const STATUS_PENDING     = 'pending';
    const STATUS_ADOPTED     = 'adopted';
    const STATUS_UNAVAILABLE = 'unavailable';

    const STATUSES = [
        self::STATUS_AVAILABLE,
        self::STATUS_PENDING,
        self::STATUS_ADOPTED,
        self::STATUS_UNAVAILABLE,
    ];

    const GENDER_MALE   = 'male';
    const GENDER_FEMALE = 'female';

    // ─── Relationships ────────────────────────────────────────────────────────

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(PetImage::class)->orderBy('sort_order');
    }

    public function primaryImage(): ?PetImage
    {
        return $this->images()->where('is_primary', true)->first()
            ?? $this->images()->first();
    }

    public function medicalRecords(): HasMany
    {
        return $this->hasMany(PetMedicalRecord::class)->latest('visit_date');
    }

    public function vaccinations(): HasMany
    {
        return $this->hasMany(Vaccination::class)->latest('administered_date');
    }

    public function adoptionApplications(): HasMany
    {
        return $this->hasMany(AdoptionApplication::class);
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_AVAILABLE);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeByBreed(Builder $query, string $breed): Builder
    {
        return $query->where('breed', 'like', "%{$breed}%");
    }

    public function scopeByGender(Builder $query, string $gender): Builder
    {
        return $query->where('gender', $gender);
    }

    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function (Builder $q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('breed', 'like', "%{$search}%")
              ->orWhere('color', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    // ─── Computed Attributes ──────────────────────────────────────────────────

    public function getAgeAttribute(): string
    {
        if (! $this->birthday) {
            return 'Unknown';
        }

        $months = (int) $this->birthday->diffInMonths(now());

        if ($months < 12) {
            return $months . ' ' . str('month')->plural($months);
        }

        $years = (int) $this->birthday->diffInYears(now());

        return $years . ' ' . str('year')->plural($years);
    }

    public function getFeaturedImageUrlAttribute(): ?string
    {
        if ($this->featured_image) {
            return str_starts_with($this->featured_image, 'http')
                ? $this->featured_image
                : '/storage/' . $this->featured_image;
        }

        $primary = $this->images->where('is_primary', true)->first() ?? $this->images->first();

        return $primary ? $primary->url : null;
    }
}
