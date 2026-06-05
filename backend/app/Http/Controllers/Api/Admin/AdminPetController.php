<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PetResource;
use App\Models\Pet;
use App\Services\PetService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminPetController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly PetService $petService,
    ) {}

    /**
     * GET /api/admin/pets — All pets including non-available (admin view)
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'status', 'breed', 'gender', 'sort_by', 'sort_order', 'per_page']);
        $pets = $this->petService->listPets($filters);

        return $this->paginatedResponse(
            PetResource::collection($pets),
            'Cats retrieved.'
        );
    }

    /**
     * PUT /api/admin/pets/{pet}/status
     */
    public function updateStatus(Request $request, Pet $pet): JsonResponse
    {
        $request->validate([
            'status' => ['required', Rule::in(Pet::STATUSES)],
        ]);

        $updated = $this->petService->updateStatus($pet, $request->status);

        return $this->successResponse(
            new PetResource($updated),
            "Cat status updated to '{$request->status}'."
        );
    }
}
