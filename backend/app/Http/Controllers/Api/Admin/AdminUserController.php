<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/admin/users
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::with('roles');

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role = $request->role) {
            $query->whereHas('roles', fn ($q) => $q->where('name', $role));
        }

        $users = $query->latest()->paginate($request->per_page ?? 15);

        return $this->paginatedResponse(
            UserResource::collection($users),
            'Users retrieved.'
        );
    }

    /**
     * GET /api/admin/users/{user}
     */
    public function show(User $user): JsonResponse
    {
        $user->load(['roles', 'pets', 'adoptionApplications.pet']);

        return $this->successResponse(
            new UserResource($user),
            'User retrieved.'
        );
    }

    /**
     * PATCH /api/admin/users/{user}/toggle — Toggle active/inactive
     */
    public function toggle(User $user): JsonResponse
    {
        // Protect admin accounts from being deactivated
        if ($user->isAdmin()) {
            return $this->forbiddenResponse('Admin accounts cannot be deactivated.');
        }

        $user->update(['is_active' => ! $user->is_active]);

        $status = $user->is_active ? 'activated' : 'deactivated';

        return $this->successResponse(
            new UserResource($user->fresh('roles')),
            "User account {$status}."
        );
    }

    /**
     * GET /api/admin/dashboard — Stats summary
     */
    public function dashboard(): JsonResponse
    {
        return $this->successResponse([
            'total_cats'        => \App\Models\Pet::count(),
            'available_cats'    => \App\Models\Pet::available()->count(),
            'total_users'       => User::count(),
            'active_users'      => User::where('is_active', true)->count(),
            'total_applications'     => \App\Models\AdoptionApplication::count(),
            'pending_applications'   => \App\Models\AdoptionApplication::where('status', 'pending')->count(),
            'approved_adoptions'     => \App\Models\AdoptionApplication::where('status', 'approved')->count(),
        ], 'Dashboard stats retrieved.');
    }
}
