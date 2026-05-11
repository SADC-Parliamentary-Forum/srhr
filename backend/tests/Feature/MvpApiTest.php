<?php

use App\Models\AccessRequest;
use App\Models\User;

it('returns public dashboard data', function () {
    $this->getJson('/api/public/dashboard')
        ->assertOk()
        ->assertJsonStructure([
            'regional_progress',
            'country_count',
            'country_total',
            'public_report_count',
            'outcomes',
            'country_statuses',
            'recent_reports',
        ]);
});

it('approves a pending access request and creates a user', function () {
    $admin = User::where('email', 'ronald@sadc-pf.org')->firstOrFail();

    $request = AccessRequest::create([
        'name' => 'Pending User',
        'email' => 'pending@example.org',
        'organization' => 'Test Org',
        'role_requested' => 'me_officer',
        'password' => 'Password123!',
        'status' => 'pending',
    ]);

    $token = $admin->createToken('test')->plainTextToken;

    $this->withHeader('Authorization', "Bearer {$token}")
        ->postJson("/api/admin/access-requests/{$request->id}/approve")
        ->assertOk()
        ->assertJsonPath('message', 'Access request approved.');

    $this->assertDatabaseHas('users', ['email' => 'pending@example.org']);
    $this->assertDatabaseHas('access_requests', ['id' => $request->id, 'status' => 'approved']);
});

it('allows an admin to create a user directly', function () {
    $admin = User::where('email', 'ronald@sadc-pf.org')->firstOrFail();
    $token = $admin->createToken('test')->plainTextToken;

    $this->withHeader('Authorization', "Bearer {$token}")
        ->postJson('/api/admin/users', [
            'name' => 'Created User',
            'email' => 'created@example.org',
            'password' => 'Password123!',
            'organization' => 'Secretariat',
            'role' => 'me_officer',
            'status' => 'active',
        ])
        ->assertCreated()
        ->assertJsonPath('message', 'User created.');

    $this->assertDatabaseHas('users', ['email' => 'created@example.org', 'status' => 'active']);
});

it('allows an admin to create a role', function () {
    $admin = User::where('email', 'ronald@sadc-pf.org')->firstOrFail();
    $token = $admin->createToken('test')->plainTextToken;

    $this->withHeader('Authorization', "Bearer {$token}")
        ->postJson('/api/admin/roles', [
            'name' => 'Data Editor',
            'permissions' => ['view_dashboard', 'upload_indicators'],
        ])
        ->assertCreated()
        ->assertJsonPath('message', 'Role created.')
        ->assertJsonPath('role.name', 'data_editor');
});

it('creates an admin notification entry for registration requests', function () {
    $this->postJson('/api/auth/register-request', [
        'name' => 'Notify User',
        'email' => 'notify@example.org',
        'organization' => 'Test Org',
        'country' => 'Malawi',
        'role_requested' => 'me_officer',
        'reason' => 'Need access for reporting.',
        'password' => 'Password123!',
    ])->assertCreated();

    $this->assertDatabaseHas('activity_logs', [
        'subject_type' => 'access_request',
        'action' => 'Registration request submitted: notify@example.org',
    ]);
});
