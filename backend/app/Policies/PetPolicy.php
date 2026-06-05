<?php

namespace App\Policies;

use App\Models\Pet;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PetPolicy
{
    use HandlesAuthorization;

    public function viewAny(?User $user): bool
    {
        return true; // Public
    }

    public function view(?User $user, Pet $pet): bool
    {
        return true; // Public
    }

    public function create(User $user): bool
    {
        return $user->isStaff();
    }

    public function update(User $user, Pet $pet): bool
    {
        return $user->isAdmin() || $pet->user_id === $user->id;
    }

    public function delete(User $user, Pet $pet): bool
    {
        return $user->isAdmin() || $pet->user_id === $user->id;
    }
}
