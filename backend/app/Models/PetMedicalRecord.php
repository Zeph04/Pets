<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PetMedicalRecord extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'pet_id',
        'record_type',
        'visit_date',
        'vet_name',
        'clinic_name',
        'diagnosis',
        'treatment',
        'notes',
        'cost',
    ];

    protected function casts(): array
    {
        return [
            'visit_date' => 'date',
            'cost'       => 'decimal:2',
            'deleted_at' => 'datetime',
        ];
    }

    const TYPES = ['checkup', 'surgery', 'emergency', 'deworming', 'dental', 'other'];

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class);
    }
}
