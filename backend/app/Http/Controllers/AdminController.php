<?php

namespace App\Http\Controllers;

use App\Models\AccessRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class AdminController extends Controller
{
    private function ensureCanManageUsers(Request $request): void
    {
        abort_unless($request->user()?->can('manage_users'), 403);
    }

    public function users(Request $request): JsonResponse
    {
        $this->ensureCanManageUsers($request);

        $users = User::query()
            ->with(['country', 'roles'])
            ->latest()
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first() ?? 'unassigned',
                'country' => $user->country?->name ?? 'Regional',
                'status' => $user->status,
                'lastLogin' => $user->last_login_at?->diffForHumans() ?? 'Never',
            ]);

        $requests = AccessRequest::query()
            ->with('country')
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->map(fn (AccessRequest $requestRow) => [
                'id' => $requestRow->id,
                'name' => $requestRow->name,
                'email' => $requestRow->email,
                'organization' => $requestRow->organization,
                'country' => $requestRow->country?->name ?? 'Unassigned',
                'role_requested' => $requestRow->role_requested,
                'reason' => $requestRow->reason,
                'created_at' => $requestRow->created_at?->diffForHumans(),
            ]);

        return response()->json([
            'users' => $users,
            'access_requests' => $requests,
        ]);
    }

    public function approveAccessRequest(Request $request, AccessRequest $accessRequest): JsonResponse
    {
        $this->ensureCanManageUsers($request);
        abort_if($accessRequest->status !== 'pending', 422, 'This access request has already been processed.');

        $validated = $request->validate([
            'role' => ['nullable', 'string', 'exists:roles,name'],
        ]);

        $roleName = $validated['role'] ?? $accessRequest->role_requested;
        $role = Role::query()->where('name', $roleName)->firstOrFail();

        $user = User::firstOrCreate(
            ['email' => $accessRequest->email],
            [
                'name' => $accessRequest->name,
                'organization' => $accessRequest->organization,
                'country_id' => $accessRequest->country_id,
                'password' => $accessRequest->password ?? str()->random(32),
                'status' => 'active',
            ]
        );

        $user->syncRoles([$role->name]);

        $accessRequest->update([
            'status' => 'approved',
            'admin_notes' => 'Approved via admin dashboard',
        ]);

        return response()->json([
            'message' => 'Access request approved.',
            'user_id' => $user->id,
        ]);
    }
}
