<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdoptionResource;
use App\Models\AdoptionApplication;
use App\Services\AdoptionService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminAdoptionController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly AdoptionService $adoptionService,
    ) {}

    /**
     * GET /api/admin/adoptions — All applications (admin view)
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'search', 'per_page']);
        $applications = $this->adoptionService->listApplications($filters);

        return $this->paginatedResponse(
            AdoptionResource::collection($applications),
            'Applications retrieved.'
        );
    }

    /**
     * GET /api/admin/adoptions/{adoption}
     */
    public function show(AdoptionApplication $adoption): JsonResponse
    {
        $adoption->load(['pet.images', 'applicant', 'reviewer', 'statusHistory.changedBy']);

        return $this->successResponse(
            new AdoptionResource($adoption),
            'Application retrieved.'
        );
    }

    /**
     * PUT /api/admin/adoptions/{adoption}/status
     */
    public function updateStatus(Request $request, AdoptionApplication $adoption): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(AdoptionApplication::STATUSES)],
            'notes'  => ['nullable', 'string', 'max:1000'],
        ]);

        if ($validated['status'] === AdoptionApplication::STATUS_APPROVED) {
            $updated = $this->adoptionService->approveApplication(
                $adoption,
                $request->user()->id,
                $validated['notes'] ?? null
            );
        } elseif ($validated['status'] === AdoptionApplication::STATUS_REJECTED) {
            $updated = $this->adoptionService->rejectApplication(
                $adoption,
                $request->user()->id,
                $validated['notes'] ?? 'Application rejected.'
            );
        } else {
            $updated = $this->adoptionService->updateStatus(
                $adoption,
                $validated['status'],
                $request->user()->id,
                $validated['notes'] ?? null
            );
        }

        return $this->successResponse(
            new AdoptionResource($updated),
            'Application status updated.'
        );
    }
}
