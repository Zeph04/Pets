<?php

namespace App\Providers;

use App\Models\AdoptionApplication;
use App\Models\Pet;
use App\Policies\AdoptionPolicy;
use App\Policies\PetPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings.
     */
    protected $policies = [
        Pet::class                => PetPolicy::class,
        AdoptionApplication::class => AdoptionPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
