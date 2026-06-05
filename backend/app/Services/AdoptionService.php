<?php

namespace App\Services;

use App\Interfaces\AdoptionRepositoryInterface;
use App\Models\AdoptionApplication;
use App\Models\Pet;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class AdoptionService
{
    public function __construct(
        private readonly AdoptionRepositoryInterface $adoptionRepository,
    ) {}

    public function listApplications(array $filters = []): LengthAwarePaginator
    {
        return $this->adoptionRepository->getAllPaginated($filters);
    }

    public function getUserApplications(string $userId, array $filters = []): LengthAwarePaginator
    {
        return $this->adoptionRepository->getUserApplications($userId, $filters);
    }

    public function getApplication(string $id): AdoptionApplication
    {
        return $this->adoptionRepository->findByIdOrFail($id);
    }

    /**
     * Submit a new adoption application.
     *
     * @throws ValidationException if a non-rejected application already exists.
     */
    public function submitApplication(array $data, string $applicantId): AdoptionApplication
    {
        // Guard: one active application per pet per user
        if ($this->adoptionRepository->hasActiveApplication($data['pet_id'], $applicantId)) {
            throw ValidationException::withMessages([
                'pet_id' => ['You already have an active application for this cat.'],
            ]);
        }

        // Guard: pet must be available
        $pet = Pet::findOrFail($data['pet_id']);
        if ($pet->status !== Pet::STATUS_AVAILABLE) {
            throw ValidationException::withMessages([
                'pet_id' => ['This cat is no longer available for adoption.'],
            ]);
        }

        return $this->adoptionRepository->create(array_merge($data, [
            'applicant_id' => $applicantId,
        ]));
    }

    /**
     * Admin approves an adoption application.
     */
    public function approveApplication(AdoptionApplication $application, string $adminId, ?string $notes = null): AdoptionApplication
    {
        // Update the pet status to 'adopted'
        $application->pet->update(['status' => Pet::STATUS_ADOPTED]);

        // Reject all other pending applications for this pet
        AdoptionApplication::where('pet_id', $application->pet_id)
            ->where('id', '!=', $application->id)
            ->whereIn('status', [AdoptionApplication::STATUS_PENDING, AdoptionApplication::STATUS_REVIEWING])
            ->each(function ($other) use ($adminId) {
                $this->adoptionRepository->updateStatus(
                    $other,
                    AdoptionApplication::STATUS_REJECTED,
                    'Another applicant was selected for this cat.',
                    $adminId
                );
            });

        return $this->adoptionRepository->updateStatus(
            $application,
            AdoptionApplication::STATUS_APPROVED,
            $notes,
            $adminId
        );
    }

    /**
     * Admin rejects an adoption application.
     */
    public function rejectApplication(
        AdoptionApplication $application,
        string $adminId,
        string $reason
    ): AdoptionApplication {
        $updated = $this->adoptionRepository->updateStatus(
            $application,
            AdoptionApplication::STATUS_REJECTED,
            $reason,
            $adminId
        );

        $application->update(['rejection_reason' => $reason]);

        return $updated;
    }

    /**
     * Admin updates application status generically.
     */
    public function updateStatus(
        AdoptionApplication $application,
        string $status,
        string $adminId,
        ?string $notes = null
    ): AdoptionApplication {
        return $this->adoptionRepository->updateStatus($application, $status, $notes, $adminId);
    }
}
