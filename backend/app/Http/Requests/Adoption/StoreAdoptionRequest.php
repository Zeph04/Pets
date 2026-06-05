<?php

namespace App\Http\Requests\Adoption;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdoptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pet_id'                 => ['required', 'uuid', 'exists:pets,id'],
            'reason'                 => ['required', 'string', 'min:50', 'max:2000'],
            'living_situation'       => ['required', 'string', 'min:20', 'max:1000'],
            'has_other_pets'         => ['required', 'boolean'],
            'other_pets_description' => ['required_if:has_other_pets,true', 'nullable', 'string', 'max:500'],
            'has_children'           => ['required', 'boolean'],
            'children_ages'          => ['required_if:has_children,true', 'nullable', 'string', 'max:100'],
            'experience'             => ['nullable', 'string', 'max:1000'],
            'references'             => ['nullable', 'string', 'max:500'],
            'preferred_date'         => ['nullable', 'date', 'after:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'reason.min'             => 'Please tell us a bit more about why you want to adopt this cat (at least 50 characters).',
            'living_situation.min'   => 'Please describe your living situation in more detail.',
            'preferred_date.after'   => 'The preferred adoption date must be in the future.',
        ];
    }
}
