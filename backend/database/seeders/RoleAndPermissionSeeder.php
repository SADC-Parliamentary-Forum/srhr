<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'view_public_data',
            'view_dashboard',
            'create_report',
            'submit_report',
            'review_report',
            'approve_report',
            'upload_indicators',
            'upload_budget',
            'upload_evidence',
            'publish_public_content',
            'manage_users',
            'manage_configuration',
            'export_reports',
            'use_ai_assistant',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $roles = [
            'super_admin'        => $permissions,
            'secretariat'        => ['view_dashboard', 'review_report', 'approve_report', 'publish_public_content', 'manage_users', 'export_reports', 'use_ai_assistant'],
            'programme_manager'  => ['view_dashboard', 'create_report', 'submit_report', 'upload_indicators', 'upload_evidence', 'export_reports', 'use_ai_assistant'],
            'me_officer'         => ['view_dashboard', 'upload_indicators', 'upload_evidence', 'export_reports', 'use_ai_assistant'],
            'finance_officer'    => ['view_dashboard', 'upload_budget', 'export_reports'],
            'country_reviewer'   => ['view_dashboard', 'review_report', 'export_reports'],
            'srhr_researcher'    => ['view_dashboard', 'create_report', 'submit_report', 'upload_indicators', 'upload_evidence', 'use_ai_assistant'],
            'communications_user'=> ['view_dashboard', 'publish_public_content', 'export_reports'],
            'partner_viewer'     => ['view_dashboard', 'view_public_data'],
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->syncPermissions($rolePermissions);
        }
    }
}
