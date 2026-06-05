<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdoptionResource;
use App\Http\Resources\UserResource;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/user/profile
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user()->load('roles');

        return $this->successResponse(new UserResource($user), 'Profile retrieved.');
    }

    /**
     * PATCH /api/user/profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'    => ['sometimes', 'string', 'max:255'],
            'phone'   => ['sometimes', 'nullable', 'string', 'max:20'],
            'address' => ['sometimes', 'nullable', 'string', 'max:500'],
        ]);

        $user = $request->user();
        $user->update($validated);

        return $this->successResponse(
            new UserResource($user->fresh()->load('roles')),
            'Profile updated successfully.'
        );
    }

    /**
     * PATCH /api/user/password
     */
    public function updatePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password'         => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
        ]);

        $user = $request->user();

        if (! Hash::check($validated['current_password'], $user->password)) {
            return $this->errorResponse('Current password is incorrect.', 422);
        }

        $user->update(['password' => Hash::make($validated['password'])]);

        // Revoke all tokens and force re-login for security
        $user->tokens()->delete();

        return $this->successResponse(null, 'Password updated. Please log in again.');
    }

    /**
     * POST /api/user/avatar
     */
    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpeg,png,webp,jpg', 'max:2048'],
        ]);

        $user = $request->user();

        // Delete old avatar
        if ($user->avatar) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return $this->successResponse(
            new UserResource($user->fresh()->load('roles')),
            'Avatar updated successfully.'
        );
    }

    /**
     * GET /api/user/applications — List user's own adoption applications
     */
    public function myApplications(Request $request): JsonResponse
    {
        $applications = $request->user()
            ->adoptionApplications()
            ->with(['pet.images', 'statuses'])
            ->latest()
            ->paginate(10);

        return $this->paginatedResponse(
            AdoptionResource::collection($applications),
            'Applications retrieved.'
        );
    }
}
