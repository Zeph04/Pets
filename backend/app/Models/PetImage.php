<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PetImage extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'pet_id',
        'path',
        'alt_text',
        'is_primary',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class);
    }

    // ─── Computed ─────────────────────────────────────────────────────────────

    public function getUrlAttribute(): string
    {
        return '/storage/' . $this->path;
    }
}
