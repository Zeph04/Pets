<?php

namespace App\Policies;

use App\Models\AdoptionApplication;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AdoptionPolicy
{
    use HandlesAuthorization;

    public function view(User $user, AdoptionApplication $application): bool
    {
        return $user->isAdmin()
            || $application->applicant_id === $user->id;
    }

    public function update(User $user, AdoptionApplication $application): bool
    {
        return $application->applicant_id === $user->id
            && $application->canBeEditedByApplicant();
    }

    public function adminUpdate(User $user): bool
    {
        return $user->isStaff();
    }
}
