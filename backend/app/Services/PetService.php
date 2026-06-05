<?php

namespace App\Services;

use App\Interfaces\PetRepositoryInterface;
use App\Models\Pet;
use App\Services\ImageService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PetService
{
    public function __construct(
        private readonly PetRepositoryInterface $petRepository,
        private readonly ImageService $imageService,
    ) {}

    public function listPets(array $filters = []): LengthAwarePaginator
    {
        return $this->petRepository->getAllPaginated($filters);
    }

    public function listAvailablePets(array $filters = []): LengthAwarePaginator
    {
        return $this->petRepository->getAvailableForAdoption($filters);
    }

    public function getPet(string $id): Pet
    {
        return $this->petRepository->findByIdOrFail($id);
    }

    public function createPet(array $data, ?object $imageFile = null): Pet
    {
        return DB::transaction(function () use ($data, $imageFile) {
            $pet = $this->petRepository->create($data);

            if ($imageFile) {
                $this->imageService->uploadPetImage($pet, $imageFile, isPrimary: true);
            }

            return $pet->load('images');
        });
    }

    public function updatePet(Pet $pet, array $data, ?object $imageFile = null): Pet
    {
        return DB::transaction(function () use ($pet, $data, $imageFile) {
            $updated = $this->petRepository->update($pet, $data);

            if ($imageFile) {
                $this->imageService->uploadPetImage($updated, $imageFile, isPrimary: false);
            }

            return $updated->load('images');
        });
    }

    public function deletePet(Pet $pet): bool
    {
        return $this->petRepository->delete($pet);
    }

    public function updateStatus(Pet $pet, string $status): Pet
    {
        return $this->petRepository->update($pet, ['status' => $status]);
    }
}
