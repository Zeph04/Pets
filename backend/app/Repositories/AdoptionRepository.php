<?php

namespace App\Repositories;

use App\Interfaces\AdoptionRepositoryInterface;
use App\Models\AdoptionApplication;
use App\Models\AdoptionStatus;
use Illuminate\Pagination\LengthAwarePaginator;

class AdoptionRepository implements AdoptionRepositoryInterface
{
    public function getAllPaginated(array $filters = []): LengthAwarePaginator
    {
        $query = AdoptionApplication::with(['pet.images', 'applicant', 'reviewer'])
            ->withTrashed(false);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['search'])) {
            $query->whereHas('applicant', function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%")
                  ->orWhere('email', 'like', "%{$filters['search']}%");
            })->orWhereHas('pet', function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%");
            });
        }

        return $query->latest()->paginate($filters['per_page'] ?? 15);
    }

    public function getUserApplications(string $userId, array $filters = []): LengthAwarePaginator
    {
        $query = AdoptionApplication::with(['pet.images', 'statusHistory'])
            ->where('applicant_id', $userId);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->paginate($filters['per_page'] ?? 10);
    }

    public function findById(string $id): ?AdoptionApplication
    {
        return AdoptionApplication::with(['pet.images', 'applicant', 'reviewer', 'statusHistory.changedBy'])
            ->find($id);
    }

    public function findByIdOrFail(string $id): AdoptionApplication
    {
        return AdoptionApplication::with(['pet.images', 'applicant', 'reviewer', 'statusHistory.changedBy'])
            ->findOrFail($id);
    }

    public function create(array $data): AdoptionApplication
    {
        $application = AdoptionApplication::create($data);

        // Record initial status in audit log
        AdoptionStatus::create([
            'application_id' => $application->id,
            'status'         => AdoptionApplication::STATUS_PENDING,
            'notes'          => 'Application submitted',
            'changed_by'     => $data['applicant_id'],
        ]);

        return $application->load(['pet.images', 'applicant']);
    }

    public function update(AdoptionApplication $application, array $data): AdoptionApplication
    {
        $application->update($data);

        return $application->fresh();
    }

    public function updateStatus(
        AdoptionApplication $application,
        string $status,
        ?string $notes,
        string $changedBy
    ): AdoptionApplication {
        $application->update([
            'status'      => $status,
            'reviewed_by' => $changedBy,
            'reviewed_at' => now(),
        ]);

        // Append to audit log
        AdoptionStatus::create([
            'application_id' => $application->id,
            'status'         => $status,
            'notes'          => $notes,
            'changed_by'     => $changedBy,
        ]);

        return $application->fresh(['pet.images', 'applicant', 'statusHistory.changedBy']);
    }

    public function hasActiveApplication(string $petId, string $userId): bool
    {
        return AdoptionApplication::where('pet_id', $petId)
            ->where('applicant_id', $userId)
            ->whereNotIn('status', [AdoptionApplication::STATUS_REJECTED])
            ->exists();
    }
}
