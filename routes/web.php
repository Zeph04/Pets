<?php

use App\Models\Pet;
use Illuminate\Support\Facades\Route;
use Livewire\Volt\Volt;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::view('/', 'welcome');

Route::view('dashboard', 'dashboard')
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::view('profile', 'profile')
    ->middleware(['auth'])
    ->name('profile');

//Pet Routes
Route::view('pets', 'pets.index')
    ->middleware(['auth'])
    ->name('pets.index');

Route::view('pets/create', 'pets.create')
    ->middleware(['auth'])
    ->name('pets.create');

Volt::route('pets/{pet}/edit', 'pets.edit-pet')
    ->middleware(['auth'])
    ->name('pets.edit');

Route::get('pets/{pet}', function (Pet $pet) {
    if (! $pet->for_adoption) {
        abort(404);
    }
    $user = $pet->user;

    return view('pets.view', ['pet' => $pet, 'user' => $user]);
})->name('pets.view');

require __DIR__ . '/auth.php';
