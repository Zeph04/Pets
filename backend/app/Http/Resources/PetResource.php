<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'name'                => $this->name,
            'breed'               => $this->breed,
            'species'             => $this->species,
            'birthday'            => $this->birthday?->toDateString(),
            'age'                 => $this->age,
            'gender'              => $this->gender,
            'color'               => $this->color,
            'description'         => $this->description,
            'weight'              => $this->weight,
            'status'              => $this->status,
            'is_featured'         => $this->is_featured,
            'featured_image_url'  => $this->featured_image_url,
            'owner'               => new UserResource($this->whenLoaded('owner')),
            'images'              => PetImageResource::collection($this->whenLoaded('images')),
            'vaccinations'        => $this->whenLoaded('vaccinations'),
            'medical_records'     => $this->whenLoaded('medicalRecords'),
            'created_at'          => $this->created_at->toISOString(),
            'updated_at'          => $this->updated_at->toISOString(),
        ];
    }
}
