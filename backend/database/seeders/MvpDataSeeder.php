<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MvpDataSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. Reporting periods ──────────────────────────────────────────────
        DB::table('reporting_periods')->delete();

        $periodIds = [];
        $periodDefs = [
            ['year' => 2023, 'quarter' => 1, 'label' => '2023 Q1', 'is_active' => true],
            ['year' => 2023, 'quarter' => 2, 'label' => '2023 Q2', 'is_active' => true],
            ['year' => 2023, 'quarter' => 3, 'label' => '2023 Q3', 'is_active' => true],
            ['year' => 2023, 'quarter' => 4, 'label' => '2023 Q4', 'is_active' => true],
            ['year' => 2024, 'quarter' => 1, 'label' => '2024 Q1', 'is_active' => true],
            ['year' => 2024, 'quarter' => 2, 'label' => '2024 Q2', 'is_active' => true],
            ['year' => 2024, 'quarter' => 3, 'label' => '2024 Q3', 'is_active' => true],
            ['year' => 2024, 'quarter' => 4, 'label' => '2024 Q4', 'is_active' => true],
        ];

        foreach ($periodDefs as $pd) {
            $id = DB::table('reporting_periods')->insertGetId($pd);
            $periodIds[$pd['label']] = $id;
        }

        // Convenience aliases
        $p23q1 = $periodIds['2023 Q1'];
        $p23q2 = $periodIds['2023 Q2'];
        $p23q3 = $periodIds['2023 Q3'];
        $p23q4 = $periodIds['2023 Q4'];
        $p24q1 = $periodIds['2024 Q1'];
        $p24q2 = $periodIds['2024 Q2'];
        $p24q3 = $periodIds['2024 Q3'];
        $p24q4 = $periodIds['2024 Q4'];

        // ── 2. Ensure 3 seed users exist / are up-to-date ────────────────────
        // Country IDs from alphabetical seeding order:
        // 8=Malawi, 14=Tanzania, 15=Zambia, 13=South Africa, 10=Mozambique, 4=DRC, 6=Lesotho
        $userRows = [
            [
                'id'           => 1,
                'name'         => 'Ronald Windwaai',
                'email'        => 'ronald@sadc-pf.org',
                'password'     => bcrypt('Password123!'),
                'organization' => 'SADC Parliamentary Forum',
                'country_id'   => 8,
                'status'       => 'active',
                'last_login_at'=> now()->subHours(2)->toDateTimeString(),
                'created_at'   => now()->toDateTimeString(),
                'updated_at'   => now()->toDateTimeString(),
            ],
            [
                'id'           => 2,
                'name'         => 'Jane Mwangi',
                'email'        => 'jane@sadc-pf.org',
                'password'     => bcrypt('Password123!'),
                'organization' => 'Regional Secretariat',
                'country_id'   => 14,
                'status'       => 'active',
                'last_login_at'=> now()->subHours(5)->toDateTimeString(),
                'created_at'   => now()->toDateTimeString(),
                'updated_at'   => now()->toDateTimeString(),
            ],
            [
                'id'           => 3,
                'name'         => 'Grace Mutahi',
                'email'        => 'grace@sadc-pf.org',
                'password'     => bcrypt('Password123!'),
                'organization' => 'Zambia Parliament',
                'country_id'   => 15,
                'status'       => 'active',
                'last_login_at'=> now()->subHours(18)->toDateTimeString(),
                'created_at'   => now()->toDateTimeString(),
                'updated_at'   => now()->toDateTimeString(),
            ],
        ];

        foreach ($userRows as $row) {
            DB::table('users')->updateOrInsert(['email' => $row['email']], $row);
        }

        // Assign roles via Spatie (must use Eloquent so model_has_roles is populated)
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        $roleMap = [1 => 'super_admin', 2 => 'me_officer', 3 => 'country_reviewer'];
        foreach ($roleMap as $userId => $roleName) {
            $user = \App\Models\User::find($userId);
            if ($user) {
                $user->syncRoles([$roleName]);
            }
        }

        // ── 3. Reports (20) ───────────────────────────────────────────────────
        DB::table('reports')->delete();

        $reports = [
            // Malawi (country 8) – user 1
            [
                'user_id' => 1, 'country_id' => 8, 'reporting_period_id' => $p23q1,
                'title' => 'Malawi SRHR Annual Report 2023',
                'slug'  => 'malawi-srhr-annual-report-2023',
                'type'  => 'Annual', 'status' => 'published', 'completion' => 100,
                'summary' => 'Comprehensive annual review of Malawi SRHR programme performance and parliamentary oversight outcomes.',
                'due_at' => '2023-03-31', 'published_at' => '2023-04-15', 'is_public' => true,
                'file_size' => '2.3 MB', 'download_url' => '/downloads/malawi-srhr-annual-report-2023.pdf',
            ],
            [
                'user_id' => 1, 'country_id' => 8, 'reporting_period_id' => $p23q2,
                'title' => 'Malawi Q2 2023 Progress Report',
                'slug'  => 'malawi-q2-2023-progress-report',
                'type'  => 'Quarterly', 'status' => 'published', 'completion' => 100,
                'summary' => 'Second quarter update on indicator performance and budget utilisation.',
                'due_at' => '2023-07-15', 'published_at' => '2023-07-28', 'is_public' => true,
                'file_size' => '1.1 MB', 'download_url' => '/downloads/malawi-q2-2023-progress-report.pdf',
            ],
            [
                'user_id' => 1, 'country_id' => 8, 'reporting_period_id' => $p24q1,
                'title' => 'Malawi Youth Clinics Research Brief',
                'slug'  => 'malawi-youth-clinics-research-brief',
                'type'  => 'Brief', 'status' => 'approved', 'completion' => 95,
                'summary' => 'Evidence brief on adolescent-friendly service utilisation trends across Malawi health zones.',
                'due_at' => '2024-04-30', 'published_at' => null, 'is_public' => false,
                'file_size' => '0.8 MB', 'download_url' => null,
            ],
            [
                'user_id' => 1, 'country_id' => 8, 'reporting_period_id' => $p24q3,
                'title' => 'Malawi GBV Legislative Review',
                'slug'  => 'malawi-gbv-legislative-review',
                'type'  => 'Research', 'status' => 'draft', 'completion' => 30,
                'summary' => 'Draft analysis of GBV legal framework gaps and recommended domestication pathways.',
                'due_at' => '2024-10-01', 'published_at' => null, 'is_public' => false,
                'file_size' => null, 'download_url' => null,
            ],

            // Tanzania (country 14) – user 2
            [
                'user_id' => 2, 'country_id' => 14, 'reporting_period_id' => $p23q3,
                'title' => 'Tanzania Budget Alignment Report Q3 2023',
                'slug'  => 'tanzania-budget-alignment-report-q3-2023',
                'type'  => 'Quarterly', 'status' => 'published', 'completion' => 100,
                'summary' => 'Analysis of SRHR budget execution versus planned activities and country commitments.',
                'due_at' => '2023-10-15', 'published_at' => '2023-10-20', 'is_public' => true,
                'file_size' => '1.5 MB', 'download_url' => '/downloads/tanzania-budget-alignment-report-q3-2023.pdf',
            ],
            [
                'user_id' => 2, 'country_id' => 14, 'reporting_period_id' => $p24q1,
                'title' => 'Tanzania Maternal Health Brief 2024',
                'slug'  => 'tanzania-maternal-health-brief-2024',
                'type'  => 'Brief', 'status' => 'submitted', 'completion' => 85,
                'summary' => 'Research brief on maternal health funding trends and service access gaps.',
                'due_at' => '2024-05-01', 'published_at' => null, 'is_public' => false,
                'file_size' => '0.9 MB', 'download_url' => null,
            ],
            [
                'user_id' => 2, 'country_id' => 14, 'reporting_period_id' => $p24q2,
                'title' => 'Tanzania Adolescent Services Q2 2024',
                'slug'  => 'tanzania-adolescent-services-q2-2024',
                'type'  => 'Quarterly', 'status' => 'review', 'completion' => 76,
                'summary' => 'Quarterly tracking of adolescent-friendly service uptake and access metrics.',
                'due_at' => '2024-07-31', 'published_at' => null, 'is_public' => false,
                'file_size' => '1.0 MB', 'download_url' => null,
            ],

            // Zambia (country 15) – user 3
            [
                'user_id' => 3, 'country_id' => 15, 'reporting_period_id' => $p23q4,
                'title' => 'Zambia Q4 2023 Compliance Report',
                'slug'  => 'zambia-q4-2023-compliance-report',
                'type'  => 'Quarterly', 'status' => 'published', 'completion' => 100,
                'summary' => 'Quarterly review of parliamentary oversight, budget execution, and service uptake for Zambia.',
                'due_at' => '2024-01-15', 'published_at' => '2024-01-22', 'is_public' => true,
                'file_size' => '1.2 MB', 'download_url' => '/downloads/zambia-q4-2023-compliance-report.pdf',
            ],
            [
                'user_id' => 3, 'country_id' => 15, 'reporting_period_id' => $p24q2,
                'title' => 'Zambia Survivor Support Centre Brief',
                'slug'  => 'zambia-survivor-support-centre-brief',
                'type'  => 'Brief', 'status' => 'approved', 'completion' => 92,
                'summary' => 'Evidence brief documenting GBV survivor support centre reach and case management outcomes.',
                'due_at' => '2024-08-01', 'published_at' => null, 'is_public' => false,
                'file_size' => '0.7 MB', 'download_url' => null,
            ],
            [
                'user_id' => 3, 'country_id' => 15, 'reporting_period_id' => $p24q4,
                'title' => 'Zambia Annual SRHR Overview 2024',
                'slug'  => 'zambia-annual-srhr-overview-2024',
                'type'  => 'Annual', 'status' => 'draft', 'completion' => 20,
                'summary' => 'Draft annual synthesis of programme performance across all outcome areas.',
                'due_at' => '2025-03-01', 'published_at' => null, 'is_public' => false,
                'file_size' => null, 'download_url' => null,
            ],

            // South Africa (country 13) – user 1
            [
                'user_id' => 1, 'country_id' => 13, 'reporting_period_id' => $p23q2,
                'title' => 'South Africa Legal Framework Assessment',
                'slug'  => 'south-africa-legal-framework-assessment',
                'type'  => 'Research', 'status' => 'published', 'completion' => 100,
                'summary' => 'Assessment of SRHR legal domestication progress and gaps in South African parliamentary process.',
                'due_at' => '2023-07-01', 'published_at' => '2023-07-10', 'is_public' => true,
                'file_size' => '1.8 MB', 'download_url' => '/downloads/south-africa-legal-framework-assessment.pdf',
            ],
            [
                'user_id' => 1, 'country_id' => 13, 'reporting_period_id' => $p24q3,
                'title' => 'South Africa Q3 2024 Indicator Report',
                'slug'  => 'south-africa-q3-2024-indicator-report',
                'type'  => 'Quarterly', 'status' => 'submitted', 'completion' => 70,
                'summary' => 'Third quarter indicator data summary with trend analysis and risk flags.',
                'due_at' => '2024-10-15', 'published_at' => null, 'is_public' => false,
                'file_size' => '0.6 MB', 'download_url' => null,
            ],

            // Mozambique (country 10) – user 2
            [
                'user_id' => 2, 'country_id' => 10, 'reporting_period_id' => $p23q3,
                'title' => 'Mozambique Youth Policy Research 2023',
                'slug'  => 'mozambique-youth-policy-research-2023',
                'type'  => 'Research', 'status' => 'published', 'completion' => 100,
                'summary' => 'Research findings on youth policy alignment with SADC SRHR framework targets.',
                'due_at' => '2023-09-30', 'published_at' => '2023-10-05', 'is_public' => true,
                'file_size' => '2.0 MB', 'download_url' => '/downloads/mozambique-youth-policy-research-2023.pdf',
            ],
            [
                'user_id' => 2, 'country_id' => 10, 'reporting_period_id' => $p24q1,
                'title' => 'Mozambique Q1 2024 Budget Brief',
                'slug'  => 'mozambique-q1-2024-budget-brief',
                'type'  => 'Brief', 'status' => 'review', 'completion' => 60,
                'summary' => 'Budget execution brief covering Q1 2024 SRHR allocations and disbursement rates.',
                'due_at' => '2024-04-30', 'published_at' => null, 'is_public' => false,
                'file_size' => '0.5 MB', 'download_url' => null,
            ],

            // DRC (country 4) – user 1
            [
                'user_id' => 1, 'country_id' => 4, 'reporting_period_id' => $p23q4,
                'title' => 'DRC SRHR Baseline Report 2023',
                'slug'  => 'drc-srhr-baseline-report-2023',
                'type'  => 'Annual', 'status' => 'published', 'completion' => 100,
                'summary' => 'Baseline report establishing SRHR programme benchmarks for DRC national portfolio.',
                'due_at' => '2024-01-31', 'published_at' => '2024-02-10', 'is_public' => true,
                'file_size' => '2.7 MB', 'download_url' => '/downloads/drc-srhr-baseline-report-2023.pdf',
            ],
            [
                'user_id' => 1, 'country_id' => 4, 'reporting_period_id' => $p24q2,
                'title' => 'DRC GBV Indicator Update Q2 2024',
                'slug'  => 'drc-gbv-indicator-update-q2-2024',
                'type'  => 'Quarterly', 'status' => 'draft', 'completion' => 15,
                'summary' => 'Early draft of GBV-related indicator updates for second quarter 2024.',
                'due_at' => '2024-08-15', 'published_at' => null, 'is_public' => false,
                'file_size' => null, 'download_url' => null,
            ],

            // Lesotho (country 6) – user 3
            [
                'user_id' => 3, 'country_id' => 6, 'reporting_period_id' => $p23q1,
                'title' => 'Lesotho SRHR Legislative Tracker Q1 2023',
                'slug'  => 'lesotho-srhr-legislative-tracker-q1-2023',
                'type'  => 'Quarterly', 'status' => 'published', 'completion' => 100,
                'summary' => 'Quarterly tracker of SRHR legislative progress and parliamentary committee activities.',
                'due_at' => '2023-04-30', 'published_at' => '2023-05-02', 'is_public' => true,
                'file_size' => '0.9 MB', 'download_url' => '/downloads/lesotho-srhr-legislative-tracker-q1-2023.pdf',
            ],
            [
                'user_id' => 3, 'country_id' => 6, 'reporting_period_id' => $p24q3,
                'title' => 'Lesotho Budget Monitoring Report 2024',
                'slug'  => 'lesotho-budget-monitoring-report-2024',
                'type'  => 'Brief', 'status' => 'submitted', 'completion' => 80,
                'summary' => 'Mid-year budget monitoring with focus on adolescent health line items.',
                'due_at' => '2024-09-30', 'published_at' => null, 'is_public' => false,
                'file_size' => '0.7 MB', 'download_url' => null,
            ],

            // Regional (no country) – user 1
            [
                'user_id' => 1, 'country_id' => null, 'reporting_period_id' => $p23q4,
                'title' => 'SADC Regional SRHR Synthesis 2023',
                'slug'  => 'sadc-regional-srhr-synthesis-2023',
                'type'  => 'Annual', 'status' => 'published', 'completion' => 100,
                'summary' => 'Regional synthesis of SRHR progress, country compliance trends, and parliamentary oversight findings for 2023.',
                'due_at' => '2024-01-15', 'published_at' => '2024-01-20', 'is_public' => true,
                'file_size' => '3.1 MB', 'download_url' => '/downloads/sadc-regional-srhr-synthesis-2023.pdf',
            ],
            [
                'user_id' => 1, 'country_id' => null, 'reporting_period_id' => $p24q4,
                'title' => 'SADC Regional SRHR Synthesis 2024',
                'slug'  => 'sadc-regional-srhr-synthesis-2024',
                'type'  => 'Annual', 'status' => 'draft', 'completion' => 40,
                'summary' => 'Draft regional synthesis consolidating 2024 country submissions and outcome area performance.',
                'due_at' => '2025-02-28', 'published_at' => null, 'is_public' => false,
                'file_size' => null, 'download_url' => null,
            ],
        ];

        $now = now()->toDateTimeString();
        foreach ($reports as &$r) {
            $r['created_at'] = $now;
            $r['updated_at'] = $now;
        }
        unset($r);

        DB::table('reports')->insert($reports);

        // ── 4. Indicators (60) ────────────────────────────────────────────────
        DB::table('indicators')->delete();

        $outcomeNames = [
            'O2_Legal'         => ['I2.1', 'I2.2', 'I2.3'],
            'O3_Budget'        => ['I3.1', 'I3.2', 'I3.3'],
            'O4_Youth'         => ['I4.1', 'I4.2', 'I4.3'],
            'O5_GenderViolence'=> ['I5.1', 'I5.2', 'I5.3'],
        ];

        $indicatorNames = [
            'O2_Legal' => [
                'I2.1' => 'SRHR Model Law domesticated',
                'I2.2' => 'Parliamentary SRHR committee established',
                'I2.3' => 'National SRHR policy reviewed',
            ],
            'O3_Budget' => [
                'I3.1' => 'Domestic SRHR budget allocation increased',
                'I3.2' => 'Maternal health funding disbursed on schedule',
                'I3.3' => 'SRHR budget oversight mechanisms functioning',
            ],
            'O4_Youth' => [
                'I4.1' => 'Adolescent-friendly health facilities operational',
                'I4.2' => 'Youth SRHR service utilisation rate',
                'I4.3' => 'Comprehensive sexuality education coverage',
            ],
            'O5_GenderViolence' => [
                'I5.1' => 'GBV legislation enacted or strengthened',
                'I5.2' => 'Survivor support centres operational',
                'I5.3' => 'GBV case management protocols adopted',
            ],
        ];

        // Country-period combinations to seed indicators for:
        // countries 8,14,15,13,10 × 3 periods each = 15 combos × 4 outcomes = 60 indicators
        $indicatorMatrix = [
            // [country_id, period_id, outcome_area, status, value_base, trend]
            [8,  $p23q1, 'O2_Legal',          'achieved',  82, 'up'],
            [8,  $p23q1, 'O3_Budget',         'on-track',  69, 'up'],
            [8,  $p23q1, 'O4_Youth',          'at-risk',   41, 'down'],
            [8,  $p23q1, 'O5_GenderViolence', 'achieved',  78, 'up'],

            [8,  $p23q3, 'O2_Legal',          'on-track',  74, 'up'],
            [8,  $p23q3, 'O3_Budget',         'achieved',  88, 'up'],
            [8,  $p23q3, 'O4_Youth',          'at-risk',   38, 'down'],
            [8,  $p23q3, 'O5_GenderViolence', 'on-track',  62, 'stable'],

            [8,  $p24q2, 'O2_Legal',          'achieved',  91, 'up'],
            [8,  $p24q2, 'O3_Budget',         'on-track',  72, 'up'],
            [8,  $p24q2, 'O4_Youth',          'on-track',  57, 'up'],
            [8,  $p24q2, 'O5_GenderViolence', 'achieved',  83, 'up'],

            [14, $p23q2, 'O2_Legal',          'on-track',  61, 'up'],
            [14, $p23q2, 'O3_Budget',         'on-track',  64, 'up'],
            [14, $p23q2, 'O4_Youth',          'achieved',  74, 'up'],
            [14, $p23q2, 'O5_GenderViolence', 'at-risk',   33, 'down'],

            [14, $p23q4, 'O2_Legal',          'on-track',  66, 'up'],
            [14, $p23q4, 'O3_Budget',         'at-risk',   48, 'down'],
            [14, $p23q4, 'O4_Youth',          'achieved',  79, 'up'],
            [14, $p23q4, 'O5_GenderViolence', 'on-track',  55, 'stable'],

            [14, $p24q3, 'O2_Legal',          'achieved',  85, 'up'],
            [14, $p24q3, 'O3_Budget',         'on-track',  71, 'up'],
            [14, $p24q3, 'O4_Youth',          'achieved',  80, 'up'],
            [14, $p24q3, 'O5_GenderViolence', 'at-risk',   29, 'down'],

            [15, $p23q1, 'O2_Legal',          'at-risk',   44, 'down'],
            [15, $p23q1, 'O3_Budget',         'on-track',  67, 'stable'],
            [15, $p23q1, 'O4_Youth',          'on-track',  58, 'up'],
            [15, $p23q1, 'O5_GenderViolence', 'on-track',  58, 'up'],

            [15, $p24q1, 'O2_Legal',          'on-track',  70, 'up'],
            [15, $p24q1, 'O3_Budget',         'on-track',  65, 'up'],
            [15, $p24q1, 'O4_Youth',          'achieved',  76, 'up'],
            [15, $p24q1, 'O5_GenderViolence', 'achieved',  81, 'up'],

            [15, $p24q4, 'O2_Legal',          'achieved',  89, 'up'],
            [15, $p24q4, 'O3_Budget',         'at-risk',   42, 'down'],
            [15, $p24q4, 'O4_Youth',          'on-track',  63, 'stable'],
            [15, $p24q4, 'O5_GenderViolence', 'achieved',  77, 'up'],

            [13, $p23q2, 'O2_Legal',          'achieved',  93, 'up'],
            [13, $p23q2, 'O3_Budget',         'achieved',  87, 'up'],
            [13, $p23q2, 'O4_Youth',          'on-track',  65, 'up'],
            [13, $p23q2, 'O5_GenderViolence', 'at-risk',   37, 'down'],

            [13, $p23q4, 'O2_Legal',          'achieved',  95, 'up'],
            [13, $p23q4, 'O3_Budget',         'achieved',  90, 'up'],
            [13, $p23q4, 'O4_Youth',          'achieved',  73, 'up'],
            [13, $p23q4, 'O5_GenderViolence', 'on-track',  52, 'up'],

            [13, $p24q3, 'O2_Legal',          'achieved',  96, 'up'],
            [13, $p24q3, 'O3_Budget',         'on-track',  75, 'stable'],
            [13, $p24q3, 'O4_Youth',          'achieved',  82, 'up'],
            [13, $p24q3, 'O5_GenderViolence', 'at-risk',   31, 'down'],

            [10, $p23q3, 'O2_Legal',          'on-track',  59, 'up'],
            [10, $p23q3, 'O3_Budget',         'at-risk',   40, 'down'],
            [10, $p23q3, 'O4_Youth',          'at-risk',   35, 'down'],
            [10, $p23q3, 'O5_GenderViolence', 'off-track', 18, 'down'],

            [10, $p24q1, 'O2_Legal',          'on-track',  62, 'up'],
            [10, $p24q1, 'O3_Budget',         'at-risk',   43, 'up'],
            [10, $p24q1, 'O4_Youth',          'on-track',  54, 'up'],
            [10, $p24q1, 'O5_GenderViolence', 'at-risk',   27, 'stable'],

            [10, $p24q4, 'O2_Legal',          'on-track',  68, 'up'],
            [10, $p24q4, 'O3_Budget',         'on-track',  60, 'up'],
            [10, $p24q4, 'O4_Youth',          'achieved',  75, 'up'],
            [10, $p24q4, 'O5_GenderViolence', 'on-track',  46, 'up'],
        ];

        $indicators = [];
        foreach ($indicatorMatrix as [$cid, $pid, $outKey, $status, $baseValue, $trend]) {
            [$outCode] = explode('_', $outKey);
            foreach ($outcomeNames[$outKey] as $code) {
                $indicators[] = [
                    'country_id'          => $cid,
                    'reporting_period_id' => $pid,
                    'code'                => $code,
                    'outcome_code'        => $outCode,
                    'name'                => $indicatorNames[$outKey][$code],
                    'status'              => $status,
                    'value'               => $baseValue + rand(-5, 5),
                    'trend'               => $trend,
                    'notes'               => null,
                    'is_public'           => in_array($status, ['achieved', 'on-track']),
                    'created_at'          => $now,
                    'updated_at'          => $now,
                ];
            }
        }

        DB::table('indicators')->insert($indicators);

        // ── 5. Evidence (12) ──────────────────────────────────────────────────
        DB::table('evidences')->delete();

        $evidences = [
            [
                'user_id' => 1, 'country_id' => 8, 'reporting_period_id' => $p23q1,
                'title' => 'Malawi Youth Outreach Case Study',
                'description' => 'Qualitative evidence package supporting youth clinic utilisation improvements in northern Malawi.',
                'evidence_type' => 'Story',
                'status' => 'submitted',
                'tags' => json_encode(['youth', 'outreach', 'maternal-health']),
                'linked_indicators' => json_encode(['I4.1', 'I3.1']),
                'files' => json_encode([]),
            ],
            [
                'user_id' => 1, 'country_id' => 8, 'reporting_period_id' => $p24q2,
                'title' => 'Malawi Parliament SRHR Committee Minutes',
                'description' => 'Official minutes from the parliamentary health committee SRHR oversight session.',
                'evidence_type' => 'Document',
                'status' => 'submitted',
                'tags' => json_encode(['parliament', 'oversight', 'legal']),
                'linked_indicators' => json_encode(['I2.1', 'I2.2']),
                'files' => json_encode([['name' => 'committee-minutes-2024.pdf', 'size' => 204800]]),
            ],
            [
                'user_id' => 2, 'country_id' => 14, 'reporting_period_id' => $p23q2,
                'title' => 'Tanzania Maternal Health Facility Photos',
                'description' => 'Photo documentation of upgraded maternal health facilities in Dar es Salaam region.',
                'evidence_type' => 'Photo',
                'status' => 'submitted',
                'tags' => json_encode(['maternal-health', 'facility', 'infrastructure']),
                'linked_indicators' => json_encode(['I3.2', 'I4.2']),
                'files' => json_encode([
                    ['name' => 'facility-01.jpg', 'size' => 512000],
                    ['name' => 'facility-02.jpg', 'size' => 487000],
                ]),
            ],
            [
                'user_id' => 2, 'country_id' => 14, 'reporting_period_id' => $p24q1,
                'title' => 'Tanzania Budget Utilisation Report',
                'description' => 'Official government document confirming SRHR budget disbursement rates for Q1 2024.',
                'evidence_type' => 'Document',
                'status' => 'draft',
                'tags' => json_encode(['budget', 'government', 'disbursement']),
                'linked_indicators' => json_encode(['I3.1', 'I3.3']),
                'files' => json_encode([['name' => 'tz-budget-q1-2024.pdf', 'size' => 389000]]),
            ],
            [
                'user_id' => 3, 'country_id' => 15, 'reporting_period_id' => $p23q4,
                'title' => 'Zambia GBV Survivor Stories Collection',
                'description' => 'Anonymised survivor testimonials documenting support centre impact across Lusaka Province.',
                'evidence_type' => 'Story',
                'status' => 'submitted',
                'tags' => json_encode(['gbv', 'survivors', 'support-centres']),
                'linked_indicators' => json_encode(['I5.1', 'I5.2']),
                'files' => json_encode([]),
            ],
            [
                'user_id' => 3, 'country_id' => 15, 'reporting_period_id' => $p24q1,
                'title' => 'Zambia Parliament SRHR Caucus Research',
                'description' => 'Research paper produced by the parliamentary SRHR caucus on domestication progress.',
                'evidence_type' => 'Research',
                'status' => 'submitted',
                'tags' => json_encode(['research', 'parliament', 'domestication']),
                'linked_indicators' => json_encode(['I2.1', 'I2.3']),
                'files' => json_encode([['name' => 'zambia-caucus-research-2024.pdf', 'size' => 720000]]),
            ],
            [
                'user_id' => 1, 'country_id' => 13, 'reporting_period_id' => $p23q2,
                'title' => 'South Africa GBV Policy Analysis',
                'description' => 'Independent research analysis of South Africa GBV legal reforms and implementation gaps.',
                'evidence_type' => 'Research',
                'status' => 'submitted',
                'tags' => json_encode(['gbv', 'policy', 'legal-reform']),
                'linked_indicators' => json_encode(['I5.1', 'I5.3']),
                'files' => json_encode([['name' => 'sa-gbv-policy-2023.pdf', 'size' => 1048576]]),
            ],
            [
                'user_id' => 1, 'country_id' => 13, 'reporting_period_id' => $p24q3,
                'title' => 'South Africa Youth Health Programme Photos',
                'description' => 'Visual documentation of school-based comprehensive sexuality education sessions.',
                'evidence_type' => 'Photo',
                'status' => 'draft',
                'tags' => json_encode(['youth', 'cse', 'school']),
                'linked_indicators' => json_encode(['I4.3']),
                'files' => json_encode([
                    ['name' => 'cse-session-01.jpg', 'size' => 394000],
                    ['name' => 'cse-session-02.jpg', 'size' => 421000],
                    ['name' => 'cse-session-03.jpg', 'size' => 368000],
                ]),
            ],
            [
                'user_id' => 2, 'country_id' => 10, 'reporting_period_id' => $p23q3,
                'title' => 'Mozambique Youth Policy Consultation Report',
                'description' => 'Report from national youth consultation on SRHR service access barriers.',
                'evidence_type' => 'Document',
                'status' => 'submitted',
                'tags' => json_encode(['youth', 'consultation', 'access']),
                'linked_indicators' => json_encode(['I4.1', 'I4.2']),
                'files' => json_encode([['name' => 'moz-youth-consultation-2023.pdf', 'size' => 556000]]),
            ],
            [
                'user_id' => 2, 'country_id' => 10, 'reporting_period_id' => $p24q1,
                'title' => 'Mozambique GBV Case Management Training Photos',
                'description' => 'Photos from GBV case management protocol training for front-line health workers.',
                'evidence_type' => 'Photo',
                'status' => 'draft',
                'tags' => json_encode(['gbv', 'training', 'health-workers']),
                'linked_indicators' => json_encode(['I5.3']),
                'files' => json_encode([['name' => 'training-day1.jpg', 'size' => 441000]]),
            ],
            [
                'user_id' => 3, 'country_id' => 6, 'reporting_period_id' => $p23q1,
                'title' => 'Lesotho Parliament SRHR Debate Transcript',
                'description' => 'Official Hansard transcript of the parliamentary debate on the SRHR Model Law domestication bill.',
                'evidence_type' => 'Document',
                'status' => 'submitted',
                'tags' => json_encode(['parliament', 'legislation', 'hansard']),
                'linked_indicators' => json_encode(['I2.1', 'I2.2']),
                'files' => json_encode([['name' => 'lesotho-hansard-srhr-2023.pdf', 'size' => 298000]]),
            ],
            [
                'user_id' => 1, 'country_id' => null, 'reporting_period_id' => $p23q4,
                'title' => 'SADC Regional SRHR Assessment Research',
                'description' => 'Cross-country research assessment underpinning the 2023 regional synthesis report.',
                'evidence_type' => 'Research',
                'status' => 'submitted',
                'tags' => json_encode(['regional', 'synthesis', 'cross-country']),
                'linked_indicators' => json_encode(['I2.1', 'I3.1', 'I4.1', 'I5.1']),
                'files' => json_encode([['name' => 'sadc-regional-assessment-2023.pdf', 'size' => 1572864]]),
            ],
        ];

        foreach ($evidences as &$ev) {
            $ev['created_at'] = $now;
            $ev['updated_at'] = $now;
        }
        unset($ev);

        DB::table('evidences')->insert($evidences);

        // ── 6. Activity logs (25) ─────────────────────────────────────────────
        DB::table('activity_logs')->delete();

        $activityLogs = [
            [
                'user_id' => 1, 'country_id' => 8,
                'action' => 'Report submitted: Malawi SRHR Annual Report 2023',
                'subject_type' => 'report', 'subject_id' => 1,
                'icon' => 'description',
                'metadata' => json_encode(['title' => 'Malawi SRHR Annual Report 2023']),
                'created_at' => now()->subDays(24)->toDateTimeString(),
            ],
            [
                'user_id' => 1, 'country_id' => 8,
                'action' => 'Indicator data uploaded for Malawi Q1 2023',
                'subject_type' => 'indicator', 'subject_id' => null,
                'icon' => 'upload_file',
                'metadata' => json_encode(['period' => '2023 Q1', 'country' => 'Malawi']),
                'created_at' => now()->subDays(23)->toDateTimeString(),
            ],
            [
                'user_id' => 1, 'country_id' => 8,
                'action' => 'Report published: Malawi SRHR Annual Report 2023',
                'subject_type' => 'report', 'subject_id' => 1,
                'icon' => 'public',
                'metadata' => json_encode(['title' => 'Malawi SRHR Annual Report 2023', 'status' => 'published']),
                'created_at' => now()->subDays(22)->toDateTimeString(),
            ],
            [
                'user_id' => 2, 'country_id' => 14,
                'action' => 'Report submitted: Tanzania Budget Alignment Report Q3 2023',
                'subject_type' => 'report', 'subject_id' => 5,
                'icon' => 'description',
                'metadata' => json_encode(['title' => 'Tanzania Budget Alignment Report Q3 2023']),
                'created_at' => now()->subDays(21)->toDateTimeString(),
            ],
            [
                'user_id' => 2, 'country_id' => 14,
                'action' => 'Evidence submitted: Tanzania Maternal Health Facility Photos',
                'subject_type' => 'evidence', 'subject_id' => 3,
                'icon' => 'attach_file',
                'metadata' => json_encode(['title' => 'Tanzania Maternal Health Facility Photos']),
                'created_at' => now()->subDays(20)->toDateTimeString(),
            ],
            [
                'user_id' => 3, 'country_id' => 15,
                'action' => 'Report approved: Zambia Q4 2023 Compliance Report',
                'subject_type' => 'report', 'subject_id' => 8,
                'icon' => 'check_circle',
                'metadata' => json_encode(['title' => 'Zambia Q4 2023 Compliance Report', 'status' => 'approved']),
                'created_at' => now()->subDays(19)->toDateTimeString(),
            ],
            [
                'user_id' => 1, 'country_id' => null,
                'action' => 'Regional synthesis draft started: SADC Regional SRHR Synthesis 2023',
                'subject_type' => 'report', 'subject_id' => 19,
                'icon' => 'edit_note',
                'metadata' => json_encode(['title' => 'SADC Regional SRHR Synthesis 2023']),
                'created_at' => now()->subDays(18)->toDateTimeString(),
            ],
            [
                'user_id' => 1, 'country_id' => 13,
                'action' => 'Report published: South Africa Legal Framework Assessment',
                'subject_type' => 'report', 'subject_id' => 11,
                'icon' => 'public',
                'metadata' => json_encode(['title' => 'South Africa Legal Framework Assessment', 'status' => 'published']),
                'created_at' => now()->subDays(17)->toDateTimeString(),
            ],
            [
                'user_id' => 2, 'country_id' => 10,
                'action' => 'Evidence submitted: Mozambique Youth Policy Consultation Report',
                'subject_type' => 'evidence', 'subject_id' => 9,
                'icon' => 'attach_file',
                'metadata' => json_encode(['title' => 'Mozambique Youth Policy Consultation Report']),
                'created_at' => now()->subDays(16)->toDateTimeString(),
            ],
            [
                'user_id' => 3, 'country_id' => 6,
                'action' => 'Report published: Lesotho SRHR Legislative Tracker Q1 2023',
                'subject_type' => 'report', 'subject_id' => 17,
                'icon' => 'public',
                'metadata' => json_encode(['title' => 'Lesotho SRHR Legislative Tracker Q1 2023', 'status' => 'published']),
                'created_at' => now()->subDays(15)->toDateTimeString(),
            ],
            [
                'user_id' => 1, 'country_id' => null,
                'action' => 'Report published: SADC Regional SRHR Synthesis 2023',
                'subject_type' => 'report', 'subject_id' => 19,
                'icon' => 'public',
                'metadata' => json_encode(['title' => 'SADC Regional SRHR Synthesis 2023', 'status' => 'published']),
                'created_at' => now()->subDays(14)->toDateTimeString(),
            ],
            [
                'user_id' => 3, 'country_id' => 15,
                'action' => 'Evidence submitted: Zambia GBV Survivor Stories Collection',
                'subject_type' => 'evidence', 'subject_id' => 5,
                'icon' => 'attach_file',
                'metadata' => json_encode(['title' => 'Zambia GBV Survivor Stories Collection']),
                'created_at' => now()->subDays(13)->toDateTimeString(),
            ],
            [
                'user_id' => 1, 'country_id' => 4,
                'action' => 'Report published: DRC SRHR Baseline Report 2023',
                'subject_type' => 'report', 'subject_id' => 15,
                'icon' => 'public',
                'metadata' => json_encode(['title' => 'DRC SRHR Baseline Report 2023', 'status' => 'published']),
                'created_at' => now()->subDays(12)->toDateTimeString(),
            ],
            [
                'user_id' => 2, 'country_id' => 14,
                'action' => 'Budget variance flagged: Tanzania Q4 2023',
                'subject_type' => 'indicator', 'subject_id' => null,
                'icon' => 'warning',
                'metadata' => json_encode(['period' => '2023 Q4', 'country' => 'Tanzania', 'issue' => 'Under-utilisation detected in activity cluster']),
                'created_at' => now()->subDays(11)->toDateTimeString(),
            ],
            [
                'user_id' => 3, 'country_id' => 15,
                'action' => 'Evidence submitted: Zambia Parliament SRHR Caucus Research',
                'subject_type' => 'evidence', 'subject_id' => 6,
                'icon' => 'attach_file',
                'metadata' => json_encode(['title' => 'Zambia Parliament SRHR Caucus Research']),
                'created_at' => now()->subDays(10)->toDateTimeString(),
            ],
            [
                'user_id' => 2, 'country_id' => 10,
                'action' => 'Indicator data uploaded for Mozambique Q1 2024',
                'subject_type' => 'indicator', 'subject_id' => null,
                'icon' => 'upload_file',
                'metadata' => json_encode(['period' => '2024 Q1', 'country' => 'Mozambique']),
                'created_at' => now()->subDays(9)->toDateTimeString(),
            ],
            [
                'user_id' => 1, 'country_id' => 8,
                'action' => 'Report submitted: Malawi Q2 2023 Progress Report',
                'subject_type' => 'report', 'subject_id' => 2,
                'icon' => 'description',
                'metadata' => json_encode(['title' => 'Malawi Q2 2023 Progress Report']),
                'created_at' => now()->subDays(8)->toDateTimeString(),
            ],
            [
                'user_id' => 1, 'country_id' => 8,
                'action' => 'Evidence submitted: Malawi Parliament SRHR Committee Minutes',
                'subject_type' => 'evidence', 'subject_id' => 2,
                'icon' => 'attach_file',
                'metadata' => json_encode(['title' => 'Malawi Parliament SRHR Committee Minutes']),
                'created_at' => now()->subDays(7)->toDateTimeString(),
            ],
            [
                'user_id' => 1, 'country_id' => 13,
                'action' => 'Evidence submitted: South Africa GBV Policy Analysis',
                'subject_type' => 'evidence', 'subject_id' => 7,
                'icon' => 'attach_file',
                'metadata' => json_encode(['title' => 'South Africa GBV Policy Analysis']),
                'created_at' => now()->subDays(6)->toDateTimeString(),
            ],
            [
                'user_id' => 3, 'country_id' => 6,
                'action' => 'Report submitted: Lesotho Budget Monitoring Report 2024',
                'subject_type' => 'report', 'subject_id' => 18,
                'icon' => 'description',
                'metadata' => json_encode(['title' => 'Lesotho Budget Monitoring Report 2024']),
                'created_at' => now()->subDays(5)->toDateTimeString(),
            ],
            [
                'user_id' => 2, 'country_id' => 14,
                'action' => 'Report submitted: Tanzania Maternal Health Brief 2024',
                'subject_type' => 'report', 'subject_id' => 6,
                'icon' => 'description',
                'metadata' => json_encode(['title' => 'Tanzania Maternal Health Brief 2024']),
                'created_at' => now()->subDays(4)->toDateTimeString(),
            ],
            [
                'user_id' => 1, 'country_id' => null,
                'action' => 'Regional SRHR Synthesis 2024 draft created',
                'subject_type' => 'report', 'subject_id' => 20,
                'icon' => 'edit_note',
                'metadata' => json_encode(['title' => 'SADC Regional SRHR Synthesis 2024']),
                'created_at' => now()->subDays(3)->toDateTimeString(),
            ],
            [
                'user_id' => 1, 'country_id' => null,
                'action' => 'Evidence submitted: SADC Regional SRHR Assessment Research',
                'subject_type' => 'evidence', 'subject_id' => 12,
                'icon' => 'attach_file',
                'metadata' => json_encode(['title' => 'SADC Regional SRHR Assessment Research']),
                'created_at' => now()->subDays(2)->toDateTimeString(),
            ],
            [
                'user_id' => 2, 'country_id' => 14,
                'action' => 'Indicator data uploaded for Tanzania Q3 2024',
                'subject_type' => 'indicator', 'subject_id' => null,
                'icon' => 'upload_file',
                'metadata' => json_encode(['period' => '2024 Q3', 'country' => 'Tanzania']),
                'created_at' => now()->subDays(1)->toDateTimeString(),
            ],
            [
                'user_id' => 1, 'country_id' => 8,
                'action' => 'Report created: Malawi GBV Legislative Review',
                'subject_type' => 'report', 'subject_id' => 4,
                'icon' => 'description',
                'metadata' => json_encode(['title' => 'Malawi GBV Legislative Review']),
                'created_at' => now()->toDateTimeString(),
            ],
        ];

        DB::table('activity_logs')->insert($activityLogs);
    }
}
