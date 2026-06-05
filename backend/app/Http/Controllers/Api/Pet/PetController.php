<?php

namespace App\Http\Controllers\Api\Pet;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pet\StorePetRequest;
use App\Http\Requests\Pet\UpdatePetRequest;
use App\Http\Resources\PetImageResource;
use App\Http\Resources\PetResource;
use App\Models\Pet;
use App\Models\PetImage;
use App\Services\AdoptionService;
use App\Services\ImageService;
use App\Services\PetService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PetController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly PetService    $petService,
        private readonly ImageService  $imageService,
        private readonly AdoptionService $adoptionService,
    ) {}

    /**
     * GET /api/pets — Public listing with filters, sorting, pagination
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'search', 'status', 'breed', 'gender', 'is_featured',
            'sort_by', 'sort_order', 'per_page',
        ]);

        $pets = $this->petService->listAvailablePets($filters);

        return $this->paginatedResponse(
            PetResource::collection($pets),
            'Cats retrieved successfully.'
        );
    }

    /**
     * GET /api/pets/{pet} — Public single pet
     */
    public function show(Pet $pet): JsonResponse
    {
        $pet->load(['owner', 'images', 'vaccinations', 'medicalRecords']);

        return $this->successResponse(
            new PetResource($pet),
            'Cat retrieved successfully.'
        );
    }

    /**
     * POST /api/pets — Create a new pet (auth required)
     */
    public function store(StorePetRequest $request): JsonResponse
    {
        $this->authorize('create', Pet::class);

        $data = array_merge($request->validated(), [
            'user_id' => $request->user()->id,
        ]);

        $pet = $this->petService->createPet(
            data: $data,
            imageFile: $request->file('image'),
        );

        return $this->createdResponse(
            new PetResource($pet->load(['owner', 'images'])),
            'Cat created successfully.'
        );
    }

    /**
     * PUT /api/pets/{pet} — Update a pet
     */
    public function update(UpdatePetRequest $request, Pet $pet): JsonResponse
    {
        $this->authorize('update', $pet);

        $updated = $this->petService->updatePet(
            pet: $pet,
            data: $request->validated(),
            imageFile: $request->file('image'),
        );

        return $this->successResponse(
            new PetResource($updated->load(['owner', 'images'])),
            'Cat updated successfully.'
        );
    }

    /**
     * DELETE /api/pets/{pet} — Soft-delete a pet
     */
    public function destroy(Pet $pet): JsonResponse
    {
        $this->authorize('delete', $pet);

        $this->petService->deletePet($pet);

        return $this->noContentResponse('Cat deleted successfully.');
    }

    /**
     * POST /api/pets/{pet}/images — Upload additional images
     */
    public function uploadImage(Request $request, Pet $pet): JsonResponse
    {
        $this->authorize('update', $pet);

        $request->validate([
            'image'      => ['required', 'image', 'mimes:jpeg,png,webp,jpg', 'max:5120'],
            'is_primary' => ['sometimes', 'boolean'],
        ]);

        $image = $this->imageService->uploadPetImage(
            $pet,
            $request->file('image'),
            isPrimary: $request->boolean('is_primary', false),
        );

        return $this->createdResponse(
            new PetImageResource($image),
            'Image uploaded successfully.'
        );
    }

    /**
     * DELETE /api/pets/{pet}/images/{image}
     */
    public function deleteImage(Pet $pet, PetImage $image): JsonResponse
    {
        $this->authorize('update', $pet);

        if ($image->pet_id !== $pet->id) {
            return $this->forbiddenResponse('Image does not belong to this cat.');
        }

        $this->imageService->deletePetImage($image);

        return $this->noContentResponse('Image deleted successfully.');
    }
}
