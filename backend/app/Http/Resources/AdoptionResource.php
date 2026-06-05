<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdoptionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                     => $this->id,
            'status'                 => $this->status,
            'reason'                 => $this->reason,
            'living_situation'       => $this->living_situation,
            'has_other_pets'         => $this->has_other_pets,
            'other_pets_description' => $this->other_pets_description,
            'has_children'           => $this->has_children,
            'children_ages'          => $this->children_ages,
            'experience'             => $this->experience,
            'references'             => $this->references,
            'preferred_date'         => $this->preferred_date?->toDateString(),
            'rejection_reason'       => $this->when(
                $this->isRejected(),
                $this->rejection_reason
            ),
            'reviewed_at'            => $this->reviewed_at?->toISOString(),
            'pet'                    => new PetResource($this->whenLoaded('pet')),
            'applicant'              => new UserResource($this->whenLoaded('applicant')),
            'reviewer'               => new UserResource($this->whenLoaded('reviewer')),
            'status_history'         => $this->whenLoaded('statusHistory'),
            'created_at'             => $this->created_at->toISOString(),
            'updated_at'             => $this->updated_at->toISOString(),
        ];
    }
}
