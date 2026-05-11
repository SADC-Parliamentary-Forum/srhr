<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AccessRequest;
use App\Models\ActivityLog;
use App\Models\Country;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->status !== 'active') {
            throw ValidationException::withMessages([
                'email' => ['Your account is not active. Please contact an administrator.'],
            ]);
        }

        $token = $user->createToken('srhr-portal')->plainTextToken;
        $user->forceFill(['last_login_at' => now()])->save();

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'country' => $user->country?->name,
                'roles' => $user->getRoleNames()->values(),
            ],
        ]);
    }

    public function registerRequest(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:access_requests,email', 'unique:users,email'],
            'organization' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:100'],
            'role_requested' => ['required', 'string', 'max:100'],
            'reason' => ['nullable', 'string', 'max:2000'],
            'password' => ['required', 'string', 'min:12'],
        ]);

        $country = Country::query()->where('name', $validated['country'])->orWhere('code', $validated['country'])->first();

        $accessRequest = AccessRequest::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'organization' => $validated['organization'],
            'country_id' => $country?->id,
            'role_requested' => $validated['role_requested'],
            'reason' => $validated['reason'] ?? null,
            'password' => $validated['password'],
            'ip_address' => $request->ip(),
        ]);

        ActivityLog::create([
            'user_id' => null,
            'country_id' => $country?->id,
            'action' => "Registration request submitted: {$accessRequest->email}",
            'subject_type' => 'access_request',
            'subject_id' => $accessRequest->id,
            'icon' => 'person_add',
            'metadata' => [
                'email' => $accessRequest->email,
                'organization' => $accessRequest->organization,
                'role_requested' => $accessRequest->role_requested,
                'country' => $country?->name,
            ],
            'created_at' => now(),
        ]);

        return response()->json(['message' => 'Registration request submitted successfully.'], 201);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['country', 'roles']);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'organization' => $user->organization,
            'country' => $user->country?->name,
            'roles' => $user->getRoleNames()->values(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }
}
