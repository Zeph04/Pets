<?php

namespace App\Repositories;

use App\Interfaces\PetRepositoryInterface;
use App\Models\Pet;
use Illuminate\Pagination\LengthAwarePaginator;

class PetRepository implements PetRepositoryInterface
{
    public function getAllPaginated(array $filters = []): LengthAwarePaginator
    {
        $query = Pet::with(['owner', 'images']);

        if (! empty($filters['search'])) {
            $query->search($filters['search']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['breed'])) {
            $query->byBreed($filters['breed']);
        }

        if (! empty($filters['gender'])) {
            $query->byGender($filters['gender']);
        }

        if (! empty($filters['is_featured'])) {
            $query->featured();
        }

        // Sorting
        $sortField     = $filters['sort_by']    ?? 'created_at';
        $sortDirection = $filters['sort_order'] ?? 'desc';
        $allowedSorts  = ['name', 'created_at', 'birthday', 'breed'];

        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
        }

        return $query->paginate($filters['per_page'] ?? 12);
    }

    public function getAvailableForAdoption(array $filters = []): LengthAwarePaginator
    {
        return $this->getAllPaginated(array_merge($filters, ['status' => Pet::STATUS_AVAILABLE]));
    }

    public function findById(string $id): ?Pet
    {
        return Pet::with(['owner', 'images', 'vaccinations', 'medicalRecords'])
            ->find($id);
    }

    public function findByIdOrFail(string $id): Pet
    {
        return Pet::with(['owner', 'images', 'vaccinations', 'medicalRecords'])
            ->findOrFail($id);
    }

    public function create(array $data): Pet
    {
        return Pet::create($data);
    }

    public function update(Pet $pet, array $data): Pet
    {
        $pet->update($data);

        return $pet->fresh(['owner', 'images']);
    }

    public function delete(Pet $pet): bool
    {
        return (bool) $pet->delete();
    }
}
