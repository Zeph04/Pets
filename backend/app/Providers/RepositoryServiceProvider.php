<?php

namespace App\Providers;

use App\Interfaces\AdoptionRepositoryInterface;
use App\Interfaces\PetRepositoryInterface;
use App\Repositories\AdoptionRepository;
use App\Repositories\PetRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register interface-to-implementation bindings.
     * This is what makes the Repository pattern testable — you can swap
     * implementations in tests by re-binding the interface.
     */
    public function register(): void
    {
        $this->app->bind(PetRepositoryInterface::class, PetRepository::class);
        $this->app->bind(AdoptionRepositoryInterface::class, AdoptionRepository::class);
    }

    public function boot(): void
    {
        //
    }
}
