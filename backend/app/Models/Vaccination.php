<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vaccination extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'pet_id',
        'vaccine_name',
        'administered_date',
        'next_due_date',
        'administered_by',
        'batch_number',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'administered_date' => 'date',
            'next_due_date'     => 'date',
        ];
    }

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class);
    }

    public function getIsDueAttribute(): bool
    {
        return $this->next_due_date && $this->next_due_date->isPast();
    }

    public function getIsDueSoonAttribute(): bool
    {
        return $this->next_due_date && $this->next_due_date->isBetween(now(), now()->addDays(30));
    }
}
