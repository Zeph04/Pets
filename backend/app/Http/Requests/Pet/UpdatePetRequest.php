<?php

namespace App\Http\Requests\Pet;

use App\Models\Pet;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'        => ['sometimes', 'string', 'min:1', 'max:100'],
            'breed'       => ['sometimes', 'string', 'max:100'],
            'species'     => ['sometimes', 'string', 'max:50'],
            'birthday'    => ['nullable', 'date', 'before:today'],
            'gender'      => ['sometimes', Rule::in(['male', 'female', 'unknown'])],
            'color'       => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:2000'],
            'weight'      => ['nullable', 'numeric', 'min:0.1', 'max:50'],
            'status'      => ['sometimes', Rule::in(Pet::STATUSES)],
            'is_featured' => ['sometimes', 'boolean'],
            'image'       => ['nullable', 'image', 'mimes:jpeg,png,webp,jpg', 'max:5120'],
        ];
    }
}
