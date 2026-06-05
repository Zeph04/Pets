<?php

use App\Http\Controllers\Api\Admin\AdminAdoptionController;
use App\Http\Controllers\Api\Admin\AdminPetController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Adoption\AdoptionController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Pet\PetController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — PawsHome Cat Adoption Platform
|--------------------------------------------------------------------------
*/

// ── Authentication ────────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register'])
        ->middleware('throttle:10,1');
    Route::post('login', [AuthController::class, 'login'])
        ->middleware('throttle:10,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });
});

// ── Public: Pets ─────────────────────────────────────────────────────────────
Route::get('pets', [PetController::class, 'index']);
Route::get('pets/{pet}', [PetController::class, 'show']);

// ── Authenticated: Pets ───────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('pets', [PetController::class, 'store']);
    Route::put('pets/{pet}', [PetController::class, 'update']);
    Route::delete('pets/{pet}', [PetController::class, 'destroy']);
    Route::post('pets/{pet}/images', [PetController::class, 'uploadImage']);
    Route::delete('pets/{pet}/images/{image}', [PetController::class, 'deleteImage']);
});

// ── Authenticated: Adoptions ──────────────────────────────────────────────────
Route::middleware('auth:sanctum')->prefix('adoptions')->group(function () {
    Route::get('/', [AdoptionController::class, 'index']);
    Route::post('/', [AdoptionController::class, 'store']);
    Route::get('{adoption}', [AdoptionController::class, 'show']);
});

// ── Authenticated: User Profile ───────────────────────────────────────────────
Route::middleware('auth:sanctum')->prefix('user')->group(function () {
    Route::get('profile', [UserController::class, 'profile']);
    Route::patch('profile', [UserController::class, 'updateProfile']);
    Route::patch('password', [UserController::class, 'updatePassword']);
    Route::post('avatar', [UserController::class, 'uploadAvatar']);
    Route::get('applications', [UserController::class, 'myApplications']);
});

// ── Admin ─────────────────────────────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'role:admin|staff'])
    ->prefix('admin')
    ->group(function () {
        // Dashboard
        Route::get('dashboard', [AdminUserController::class, 'dashboard']);

        // Cats management
        Route::get('pets', [AdminPetController::class, 'index']);
        Route::put('pets/{pet}/status', [AdminPetController::class, 'updateStatus']);

        // Adoption management
        Route::get('adoptions', [AdminAdoptionController::class, 'index']);
        Route::get('adoptions/{adoption}', [AdminAdoptionController::class, 'show']);
        Route::put('adoptions/{adoption}/status', [AdminAdoptionController::class, 'updateStatus']);

        // User management (admin only)
        Route::middleware('role:admin')->group(function () {
            Route::get('users', [AdminUserController::class, 'index']);
            Route::get('users/{user}', [AdminUserController::class, 'show']);
            Route::patch('users/{user}/toggle', [AdminUserController::class, 'toggle']);
        });
    });
