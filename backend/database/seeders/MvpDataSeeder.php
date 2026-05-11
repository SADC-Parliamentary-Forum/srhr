<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\Country;
use App\Models\Evidence;
use App\Models\Indicator;
use App\Models\Report;
use App\Models\ReportingPeriod;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MvpDataSeeder extends Seeder
{
    public function run(): void
    {
        $periods = collect([
            ['year' => 2026, 'quarter' => 2, 'label' => 'Q2 2026', 'is_active' => true],
            ['year' => 2026, 'quarter' => 1, 'label' => 'Q1 2026', 'is_active' => true],
            ['year' => 2025, 'quarter' => 4, 'label' => 'Q4 2025', 'is_active' => false],
        ])->map(fn (array $period) => ReportingPeriod::query()->updateOrCreate(['label' => $period['label']], $period));

        $malawi = Country::query()->where('slug', 'malawi')->firstOrFail();
        $kenyaLike = Country::query()->where('slug', 'zambia')->firstOrFail();
        $tanzania = Country::query()->where('slug', 'tanzania')->firstOrFail();
        $regional = null;

        $users = [
            [
                'name' => 'Ronald Windwaai',
                'email' => 'ronald@sadc-pf.org',
                'organization' => 'SADC Parliamentary Forum',
                'country_id' => $malawi->id,
                'password' => 'Password123!',
                'status' => 'active',
                'role' => 'super_admin',
            ],
            [
                'name' => 'Jane Mwangi',
                'email' => 'jane@sadc-pf.org',
                'organization' => 'Regional Secretariat',
                'country_id' => $tanzania->id,
                'password' => 'Password123!',
                'status' => 'active',
                'role' => 'me_officer',
            ],
            [
                'name' => 'Grace Mutahi',
                'email' => 'grace@sadc-pf.org',
                'organization' => 'Regional Secretariat',
                'country_id' => $kenyaLike->id,
                'password' => 'Password123!',
                'status' => 'active',
                'role' => 'country_reviewer',
            ],
        ];

        $userModels = collect($users)->map(function (array $payload) {
            $role = $payload['role'];
            unset($payload['role']);

            $user = User::query()->updateOrCreate(
                ['email' => $payload['email']],
                array_merge($payload, ['last_login_at' => now()->subHours(rand(1, 72))])
            );
            $user->syncRoles([$role]);

            return $user;
        });

        $indicatorSeeds = [
            [$malawi, $periods[0], 'I2.1', 'O2', 'SRHR Bill domesticated', 'achieved', 82, '+5%'],
            [$malawi, $periods[0], 'I3.1', 'O3', 'Budget allocation increased', 'on-track', 69, '+8%'],
            [$malawi, $periods[0], 'I4.1', 'O4', 'Youth clinics operational', 'at-risk', 41, '-3%'],
            [$malawi, $periods[0], 'I5.1', 'O5', 'GBV laws enacted', 'achieved', 78, '+2%'],
            [$tanzania, $periods[1], 'I2.1', 'O2', 'SRHR Bill domesticated', 'on-track', 61, '+3%'],
            [$tanzania, $periods[1], 'I3.2', 'O3', 'Maternal health funding', 'on-track', 64, '+4%'],
            [$tanzania, $periods[1], 'I4.2', 'O4', 'Adolescent service utilization', 'achieved', 74, '+6%'],
            [$kenyaLike, $periods[1], 'I5.2', 'O5', 'Survivor support centers', 'on-track', 58, '+4%'],
        ];

        foreach ($indicatorSeeds as [$country, $period, $code, $outcome, $name, $status, $value, $trend]) {
            Indicator::query()->updateOrCreate(
                ['country_id' => $country->id, 'reporting_period_id' => $period->id, 'code' => $code, 'name' => $name],
                [
                    'outcome_code' => $outcome,
                    'status' => $status,
                    'value' => $value,
                    'trend' => $trend,
                    'is_public' => true,
                ]
            );
        }

        $reportSeeds = [
            [
                'user_id' => $userModels[0]->id,
                'country_id' => $malawi->id,
                'reporting_period_id' => $periods[0]->id,
                'title' => 'Malawi April 2026 Monthly',
                'type' => 'Monthly Update',
                'status' => 'draft',
                'summary' => 'Monthly narrative on indicator performance, evidence coverage, and implementation risks.',
                'completion' => 45,
                'due_at' => now()->addDays(5),
                'published_at' => null,
                'is_public' => false,
                'file_size' => '1.2 MB',
            ],
            [
                'user_id' => $userModels[2]->id,
                'country_id' => $kenyaLike->id,
                'reporting_period_id' => $periods[1]->id,
                'title' => 'Zambia Q1 Impact Review',
                'type' => 'Quarterly Update',
                'status' => 'approved',
                'summary' => 'Quarterly review of parliamentary oversight, budget execution, and service uptake.',
                'completion' => 100,
                'due_at' => now()->addDays(10),
                'published_at' => now()->subDays(12),
                'is_public' => true,
                'file_size' => '0.9 MB',
            ],
            [
                'user_id' => $userModels[1]->id,
                'country_id' => $tanzania->id,
                'reporting_period_id' => $periods[1]->id,
                'title' => 'Tanzania Budget Alignment',
                'type' => 'Research Brief',
                'status' => 'review',
                'summary' => 'Analysis of spending execution against planned SRHR activities and country targets.',
                'completion' => 76,
                'due_at' => now()->addDays(18),
                'published_at' => null,
                'is_public' => false,
                'file_size' => '1.5 MB',
            ],
            [
                'user_id' => $userModels[0]->id,
                'country_id' => null,
                'reporting_period_id' => $periods[1]->id,
                'title' => 'SADC Regional SRHR Synthesis 2026',
                'type' => 'Annual Report',
                'status' => 'published',
                'summary' => 'Regional synthesis of SRHR progress, country compliance trends, and parliamentary oversight findings.',
                'completion' => 100,
                'due_at' => now()->addDays(30),
                'published_at' => now()->subDays(20),
                'is_public' => true,
                'file_size' => '2.4 MB',
            ],
        ];

        foreach ($reportSeeds as $seed) {
            Report::query()->updateOrCreate(
                ['slug' => Str::slug($seed['title'])],
                array_merge($seed, [
                    'slug' => Str::slug($seed['title']),
                    'download_url' => '/downloads/'.Str::slug($seed['title']).'.pdf',
                ])
            );
        }

        $evidence = Evidence::query()->updateOrCreate(
            ['title' => 'Malawi Youth Outreach Case Study'],
            [
                'user_id' => $userModels[0]->id,
                'country_id' => $malawi->id,
                'reporting_period_id' => $periods[0]->id,
                'description' => 'Qualitative evidence package supporting youth clinic utilization improvements.',
                'evidence_type' => 'Story',
                'tags' => ['youth', 'outreach', 'maternal-health'],
                'linked_indicators' => ['I4.1', 'I3.1'],
                'status' => 'submitted',
                'files' => [],
            ]
        );

        $activities = [
            [$userModels[0], $malawi, 'Uploaded Q1 indicator data', 'upload_file', 'Indicator workbook synced'],
            [$userModels[0], $malawi, 'Draft saved: Malawi April 2026', 'description', 'Monthly report draft updated'],
            [$userModels[2], $kenyaLike, 'Zambia Q1 report approved', 'check_circle', 'Regional reviewer completed approval'],
            [$userModels[1], $tanzania, 'Budget variance flagged for review', 'warning', 'Under-utilisation detected in activity cluster'],
            [$userModels[0], $malawi, 'Evidence document uploaded', 'attach_file', $evidence->title],
        ];

        foreach ($activities as $index => [$user, $country, $action, $icon, $description]) {
            ActivityLog::query()->updateOrCreate(
                ['action' => $action, 'created_at' => now()->subDays($index)->startOfHour()],
                [
                    'user_id' => $user->id,
                    'country_id' => $country?->id,
                    'subject_type' => 'seed',
                    'subject_id' => $index + 1,
                    'icon' => $icon,
                    'metadata' => ['description' => $description],
                ]
            );
        }
    }
}
