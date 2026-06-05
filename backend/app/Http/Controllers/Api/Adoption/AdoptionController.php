<?php

namespace App\Http\Controllers\Api\Adoption;

use App\Http\Controllers\Controller;
use App\Http\Requests\Adoption\StoreAdoptionRequest;
use App\Http\Resources\AdoptionResource;
use App\Models\AdoptionApplication;
use App\Services\AdoptionService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdoptionController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly AdoptionService $adoptionService,
    ) {}

    /**
     * GET /api/adoptions — Current user's applications
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'per_page']);

        $applications = $this->adoptionService->getUserApplications(
            $request->user()->id,
            $filters
        );

        return $this->paginatedResponse(
            AdoptionResource::collection($applications),
            'Applications retrieved.'
        );
    }

    /**
     * POST /api/adoptions — Submit a new application
     */
    public function store(StoreAdoptionRequest $request): JsonResponse
    {
        $application = $this->adoptionService->submitApplication(
            $request->validated(),
            $request->user()->id
        );

        return $this->createdResponse(
            new AdoptionResource($application),
            'Your adoption application has been submitted!'
        );
    }

    /**
     * GET /api/adoptions/{adoption}
     */
    public function show(Request $request, AdoptionApplication $adoption): JsonResponse
    {
        $this->authorize('view', $adoption);

        $adoption->load(['pet.images', 'applicant', 'reviewer', 'statusHistory.changedBy']);

        return $this->successResponse(
            new AdoptionResource($adoption),
            'Application retrieved.'
        );
    }
}
