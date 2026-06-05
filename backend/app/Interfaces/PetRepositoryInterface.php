<?php

namespace App\Interfaces;

use Illuminate\Pagination\LengthAwarePaginator;

interface PetRepositoryInterface
{
    public function getAllPaginated(array $filters = []): LengthAwarePaginator;
    public function findById(string $id): ?\App\Models\Pet;
    public function findByIdOrFail(string $id): \App\Models\Pet;
    public function create(array $data): \App\Models\Pet;
    public function update(\App\Models\Pet $pet, array $data): \App\Models\Pet;
    public function delete(\App\Models\Pet $pet): bool;
    public function getAvailableForAdoption(array $filters = []): LengthAwarePaginator;
}
