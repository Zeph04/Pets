<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class AdoptionApplication extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'pet_id',
        'applicant_id',
        'status',
        'reason',
        'living_situation',
        'has_other_pets',
        'other_pets_description',
        'has_children',
        'children_ages',
        'experience',
        'references',
        'preferred_date',
        'rejection_reason',
        'reviewed_by',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'has_other_pets'  => 'boolean',
            'has_children'    => 'boolean',
            'preferred_date'  => 'date',
            'reviewed_at'     => 'datetime',
            'deleted_at'      => 'datetime',
        ];
    }

    // ─── Status Constants ────────────────────────────────────────────────────

    const STATUS_PENDING   = 'pending';
    const STATUS_REVIEWING = 'reviewing';
    const STATUS_APPROVED  = 'approved';
    const STATUS_REJECTED  = 'rejected';
    const STATUS_COMPLETED = 'completed';

    const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_REVIEWING,
        self::STATUS_APPROVED,
        self::STATUS_REJECTED,
        self::STATUS_COMPLETED,
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class);
    }

    public function applicant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'applicant_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(AdoptionStatus::class, 'application_id')->latest();
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }

    public function canBeEditedByApplicant(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }
}
