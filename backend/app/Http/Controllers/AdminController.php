<?php

namespace App\Http\Controllers;

use App\Models\AccessRequest;
use App\Models\ActivityLog;
use App\Models\Country;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
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
            'roles' => Role::query()
                ->with('permissions')
                ->orderBy('name')
                ->get()
                ->map(fn (Role $role) => [
                    'name' => $role->name,
                    'permissions' => $role->permissions->pluck('name')->values(),
                ]),
            'permissions' => Permission::query()->orderBy('name')->pluck('name')->values(),
            'countries' => Country::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function createUser(Request $request): JsonResponse
    {
        $this->ensureCanManageUsers($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:12'],
            'organization' => ['nullable', 'string', 'max:255'],
            'country_id' => ['nullable', 'exists:countries,id'],
            'role' => ['required', 'string', 'exists:roles,name'],
            'status' => ['nullable', 'in:active,inactive'],
        ]);

        $role = Role::query()->where('name', $validated['role'])->firstOrFail();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'organization' => $validated['organization'] ?? null,
            'country_id' => $validated['country_id'] ?? null,
            'status' => $validated['status'] ?? 'active',
            'email_verified_at' => now(),
        ]);

        $user->syncRoles([$role->name]);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'country_id' => $user->country_id,
            'action' => "User created: {$user->email}",
            'subject_type' => 'user',
            'subject_id' => $user->id,
            'icon' => 'person_add',
            'metadata' => [
                'email' => $user->email,
                'role' => $role->name,
            ],
            'created_at' => now(),
        ]);

        return response()->json([
            'message' => 'User created.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $role->name,
                'country' => $user->country?->name ?? 'Regional',
                'status' => $user->status,
                'lastLogin' => 'Never',
            ],
        ], 201);
    }

    public function createRole(Request $request): JsonResponse
    {
        $this->ensureCanManageUsers($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $roleName = Str::of($validated['name'])->trim()->lower()->replace(' ', '_')->value();
        abort_if($roleName === '', 422, 'Role name is required.');
        abort_if(Role::query()->where('name', $roleName)->exists(), 422, 'This role already exists.');
        $guardName = 'web';

        $role = DB::transaction(function () use ($request, $validated, $roleName, $guardName) {
            $role = Role::create([
                'name' => $roleName,
                'guard_name' => $guardName,
            ]);

            $permissionModels = Permission::query()
                ->where('guard_name', $guardName)
                ->whereIn('name', $validated['permissions'] ?? [])
                ->get();

            $role->syncPermissions($permissionModels);

            ActivityLog::create([
                'user_id' => $request->user()->id,
                'country_id' => null,
                'action' => "Role created: {$role->name}",
                'subject_type' => 'role',
                'subject_id' => $role->id,
                'icon' => 'badge',
                'metadata' => [
                    'permissions' => $permissionModels->pluck('name')->values(),
                ],
                'created_at' => now(),
            ]);

            return $role->load('permissions');
        });

        return response()->json([
            'message' => 'Role created.',
            'role' => [
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->values(),
            ],
        ], 201);
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

    public function updateUser(Request $request, User $user): JsonResponse
    {
        $this->ensureCanManageUsers($request);

        $validated = $request->validate([
            'name'         => ['sometimes', 'string', 'max:255'],
            'organization' => ['nullable', 'string', 'max:255'],
            'country_id'   => ['nullable', 'exists:countries,id'],
            'role'         => ['sometimes', 'string', 'exists:roles,name'],
        ]);

        if (isset($validated['role'])) {
            $user->syncRoles([$validated['role']]);
            unset($validated['role']);
        }

        $user->update($validated);

        return response()->json(['message' => 'User updated.']);
    }

    public function toggleUserStatus(Request $request, User $user): JsonResponse
    {
        $this->ensureCanManageUsers($request);

        $newStatus = $user->status === 'active' ? 'inactive' : 'active';
        $user->update(['status' => $newStatus]);

        ActivityLog::create([
            'user_id'      => $request->user()->id,
            'country_id'   => null,
            'action'       => "User {$newStatus}: {$user->email}",
            'subject_type' => 'user',
            'subject_id'   => $user->id,
            'icon'         => $newStatus === 'active' ? 'person_check' : 'person_off',
            'metadata'     => ['email' => $user->email],
            'created_at'   => now(),
        ]);

        return response()->json(['status' => $newStatus]);
    }

    public function auditLogs(Request $request): JsonResponse
    {
        $this->ensureCanManageUsers($request);

        $logs = ActivityLog::query()
            ->with(['user', 'country'])
            ->latest('created_at')
            ->take(100)
            ->get()
            ->map(fn ($log) => [
                'id'           => $log->id,
                'action'       => $log->action,
                'subject_type' => $log->subject_type,
                'subject_id'   => $log->subject_id,
                'icon'         => $log->icon ?? 'update',
                'user'         => $log->user?->name ?? 'System',
                'country'      => $log->country?->name,
                'metadata'     => $log->metadata,
                'created_at'   => $log->created_at?->format('M j, Y H:i'),
            ]);

        return response()->json($logs);
    }

    public function notifications(Request $request): JsonResponse
    {
        $this->ensureCanManageUsers($request);

        $items = ActivityLog::query()
            ->where('subject_type', 'access_request')
            ->latest('created_at')
            ->take(10)
            ->get()
            ->map(fn (ActivityLog $log) => [
                'id' => $log->id,
                'title' => $log->action,
                'icon' => $log->icon ?? 'notifications',
                'time' => $log->created_at?->diffForHumans(),
                'metadata' => $log->metadata ?? [],
            ]);

        return response()->json([
            'count' => AccessRequest::query()->where('status', 'pending')->count(),
            'items' => $items,
        ]);
    }

    public function getConfiguration(Request $request): JsonResponse
    {
        abort_unless($request->user()->can('manage_configuration'), 403);

        return response()->json([
            'organization_name' => 'SADC Parliamentary Forum',
            'default_language'  => 'en',
            'date_format'       => 'M j, Y',
            'timezone'          => 'Africa/Harare',
            'maintenance_mode'  => false,
            'open_registration' => false,
            'require_2fa'       => false,
        ]);
    }

    public function updateConfiguration(Request $request): JsonResponse
    {
        abort_unless($request->user()->can('manage_configuration'), 403);

        // Config changes are not persisted in this MVP (no config table yet)
        return response()->json(['message' => 'Configuration saved.']);
    }
}
