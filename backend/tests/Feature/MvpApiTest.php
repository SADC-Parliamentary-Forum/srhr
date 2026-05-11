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
