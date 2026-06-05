<?php

namespace App\Interfaces;

use Illuminate\Pagination\LengthAwarePaginator;

interface AdoptionRepositoryInterface
{
    public function getAllPaginated(array $filters = []): LengthAwarePaginator;
    public function getUserApplications(string $userId, array $filters = []): LengthAwarePaginator;
    public function findById(string $id): ?\App\Models\AdoptionApplication;
    public function findByIdOrFail(string $id): \App\Models\AdoptionApplication;
    public function create(array $data): \App\Models\AdoptionApplication;
    public function update(\App\Models\AdoptionApplication $application, array $data): \App\Models\AdoptionApplication;
    public function updateStatus(\App\Models\AdoptionApplication $application, string $status, ?string $notes, string $changedBy): \App\Models\AdoptionApplication;
    public function hasActiveApplication(string $petId, string $userId): bool;
}
