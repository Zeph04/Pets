<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdoptionStatus extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_id',
        'status',
        'notes',
        'changed_by',
    ];

    public function application(): BelongsTo
    {
        return $this->belongsTo(AdoptionApplication::class, 'application_id');
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
