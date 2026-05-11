<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MvpDataSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $now = now()->toDateTimeString();

        // ── 1. Reporting Periods (2022–2024) ──────────────────────────────────
        DB::table('reporting_periods')->delete();

        $periodIds = [];
        foreach ([2022, 2023, 2024] as $year) {
            foreach ([1, 2, 3, 4] as $q) {
                $id = DB::table('reporting_periods')->insertGetId([
                    'year'       => $year,
                    'quarter'    => $q,
                    'label'      => "{$year} Q{$q}",
                    'is_active'  => ($year === 2024),
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
                $periodIds["{$year} Q{$q}"] = $id;
            }
        }

        $p22q4 = $periodIds['2022 Q4'];
        $p23q1 = $periodIds['2023 Q1'];
        $p23q2 = $periodIds['2023 Q2'];
        $p23q3 = $periodIds['2023 Q3'];
        $p23q4 = $periodIds['2023 Q4'];
        $p24q1 = $periodIds['2024 Q1'];
        $p24q2 = $periodIds['2024 Q2'];
        $p24q3 = $periodIds['2024 Q3'];
        $p24q4 = $periodIds['2024 Q4'];

        // ── 2. Country ID map (safe — looks up by code not position) ──────────
        $c = DB::table('countries')->pluck('id', 'code');
        // $c['MW'], $c['TZ'], etc.

        // ── 3. Users — all 9 roles represented ───────────────────────────────
        $userDefs = [
            // email => [name, org, country_code, role]
            'ronald@sadc-pf.org'     => ['Ronald Windwaai',  'SADC Parliamentary Forum',   'MW', 'super_admin'],
            'sandra@sadc-pf.org'     => ['Sandra Osei',      'SADC Parliamentary Forum',   'ZA', 'secretariat'],
            'patrick@parliament.zm'  => ['Patrick Mwamba',   'Parliament of Zambia',        'ZM', 'programme_manager'],
            'jane@sadc-pf.org'       => ['Jane Mwangi',      'Regional Secretariat',        'TZ', 'me_officer'],
            'david@parliament.mw'    => ['David Chirwa',      'Parliament of Malawi',       'MW', 'finance_officer'],
            'grace@sadc-pf.org'      => ['Grace Mutahi',     'Zambia Parliament',           'ZM', 'country_reviewer'],
            'amara@unfpa.org'        => ['Amara Diallo',     'UNFPA',                       'ZA', 'srhr_researcher'],
            'nomsa@parliament.sz'    => ['Nomsa Dlamini',    'Parliament of Eswatini',      'SZ', 'communications_user'],
            'carlos@who.int'         => ['Carlos Mondlane',  'World Health Organisation',   'MZ', 'partner_viewer'],
            'fatima@parliament.ao'   => ['Fatima Rodrigues', 'Parliament of Angola',        'AO', 'programme_manager'],
        ];

        // Sync PostgreSQL sequence so inserts don't collide with existing rows
        DB::statement("SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 0))");

        $userIds = [];
        foreach ($userDefs as $email => [$name, $org, $cc, $role]) {
            $existing = DB::table('users')->where('email', $email)->first();
            if ($existing) {
                $userId = $existing->id;
                DB::table('users')->where('id', $userId)->update([
                    'name'         => $name,
                    'organization' => $org,
                    'country_id'   => $c[$cc] ?? null,
                    'status'       => 'active',
                    'updated_at'   => $now,
                ]);
            } else {
                $userId = DB::table('users')->insertGetId([
                    'name'               => $name,
                    'email'              => $email,
                    'password'           => bcrypt('Password123!'),
                    'organization'       => $org,
                    'country_id'         => $c[$cc] ?? null,
                    'status'             => 'active',
                    'email_verified_at'  => $now,
                    'last_login_at'      => now()->subHours(rand(1, 48))->toDateTimeString(),
                    'created_at'         => $now,
                    'updated_at'         => $now,
                ]);
            }
            $userIds[$email] = $userId;

            $user = \App\Models\User::find($userId);
            if ($user) {
                $user->syncRoles([$role]);
            }
        }

        $u1 = $userIds['ronald@sadc-pf.org'];      // super_admin
        $u2 = $userIds['sandra@sadc-pf.org'];       // secretariat
        $u3 = $userIds['patrick@parliament.zm'];    // programme_manager
        $u4 = $userIds['jane@sadc-pf.org'];         // me_officer
        $u5 = $userIds['david@parliament.mw'];      // finance_officer
        $u6 = $userIds['grace@sadc-pf.org'];        // country_reviewer
        $u7 = $userIds['amara@unfpa.org'];          // srhr_researcher
        $u8 = $userIds['nomsa@parliament.sz'];      // communications_user
        $u9 = $userIds['fatima@parliament.ao'];     // programme_manager (Angola)

        // ── 4. Reports — all 16 countries ────────────────────────────────────
        DB::table('reports')->delete();

        // [user_id, country_code, period_key, title, type, status, is_public, completion, summary]
        $reportRows = [
            // Malawi
            [$u1, 'MW', $p23q4, 'Malawi SRHR Annual Report 2023',          'Annual',    'published', true,  100, 'Annual review of Malawi SRHR programme outcomes and parliamentary oversight for 2023.'],
            [$u1, 'MW', $p24q4, 'Malawi SRHR Annual Report 2024',          'Annual',    'published', true,  100, 'Annual review of Malawi SRHR programme outcomes and parliamentary oversight for 2024.'],
            [$u4, 'MW', $p24q2, 'Malawi Q2 2024 Monitoring Report',        'Quarterly', 'submitted', false,  80, 'Second quarter 2024 update on indicator performance and budget utilisation.'],
            [$u4, 'MW', $p24q3, 'Malawi Q3 2024 Progress Brief',           'Brief',     'approved',  true,  100, 'Evidence brief on SRHR service utilisation trends across Malawi health zones.'],
            [$u7, 'MW', $p24q1, 'Malawi GBV Legislative Review 2024',      'Research',  'draft',     false,  30, 'Draft analysis of GBV legal framework gaps and domestication pathways.'],
            // Tanzania
            [$u4, 'TZ', $p23q3, 'Tanzania Budget Alignment Report Q3 2023','Quarterly', 'published', true,  100, 'Analysis of SRHR budget execution versus planned activities in Tanzania.'],
            [$u4, 'TZ', $p23q4, 'Tanzania SRHR Annual Report 2023',        'Annual',    'published', true,  100, 'Annual synthesis of Tanzania SRHR programme data and parliamentary oversight findings.'],
            [$u4, 'TZ', $p24q4, 'Tanzania SRHR Annual Report 2024',        'Annual',    'published', true,  100, 'Annual synthesis of Tanzania SRHR programme data and parliamentary oversight findings.'],
            [$u4, 'TZ', $p24q3, 'Tanzania Q3 2024 Data Snapshot',          'Quarterly', 'review',    false,  65, 'Quarterly tracking of SRHR service uptake and access metrics.'],
            // Zambia
            [$u3, 'ZM', $p23q4, 'Zambia Q4 2023 Compliance Report',        'Quarterly', 'published', true,  100, 'Quarterly review of parliamentary oversight and budget execution for Zambia.'],
            [$u3, 'ZM', $p24q4, 'Zambia SRHR Annual Report 2024',          'Annual',    'published', true,  100, 'Annual synthesis of Zambia SRHR programme outcomes for 2024.'],
            [$u6, 'ZM', $p24q3, 'Zambia Youth SRHR Research 2024',         'Research',  'approved',  true,  100, 'Research findings on youth reproductive health service access in Zambia.'],
            [$u3, 'ZM', $p24q2, 'Zambia Survivor Support Centre Brief',    'Brief',     'submitted', false,  85, 'Evidence brief on GBV survivor support centre reach across Lusaka Province.'],
            // South Africa
            [$u2, 'ZA', $p23q2, 'South Africa Legal Framework Assessment', 'Research',  'published', true,  100, 'Assessment of SRHR legal domestication progress in South Africa.'],
            [$u2, 'ZA', $p24q4, 'South Africa SRHR Annual Report 2024',    'Annual',    'published', true,  100, 'Annual SRHR report covering all outcome areas for South Africa 2024.'],
            [$u7, 'ZA', $p24q3, 'South Africa GBV Prevention Brief Q3 2024','Brief',    'published', true,  100, 'Evidence brief on GBV prevention interventions and outcomes Q3 2024.'],
            [$u7, 'ZA', $p24q2, 'South Africa Q2 2024 Research Summary',   'Research',  'submitted', false,  90, 'Research summary on SRHR indicators and trend analysis.'],
            // Mozambique
            [$u4, 'MZ', $p23q3, 'Mozambique Youth Policy Research 2023',   'Research',  'published', true,  100, 'Research findings on youth policy alignment with SADC SRHR framework targets.'],
            [$u9, 'MZ', $p24q4, 'Mozambique SRHR Annual Report 2024',      'Annual',    'published', true,  100, 'Annual SRHR monitoring report for Mozambique 2024.'],
            [$u4, 'MZ', $p24q2, 'Mozambique Q2 2024 Monitoring',           'Quarterly', 'review',    false,  70, 'Quarterly SRHR data snapshot for Mozambique Q2 2024.'],
            // Zimbabwe
            [$u1, 'ZW', $p24q4, 'Zimbabwe SRHR Annual Report 2024',        'Annual',    'published', true,  100, 'Comprehensive annual SRHR report for Zimbabwe 2024.'],
            [$u4, 'ZW', $p24q2, 'Zimbabwe Q2 2024 Progress Report',        'Quarterly', 'draft',     false,  40, 'Draft quarterly SRHR progress report for Zimbabwe Q2 2024.'],
            // Botswana
            [$u1, 'BW', $p24q4, 'Botswana SRHR Annual Report 2024',        'Annual',    'published', true,  100, 'Annual SRHR monitoring and evaluation report for Botswana.'],
            [$u6, 'BW', $p24q3, 'Botswana Q3 2024 Monitoring Brief',       'Brief',     'submitted', false,  85, 'Quarterly SRHR brief covering indicator updates for Botswana Q3 2024.'],
            // Namibia
            [$u1, 'NA', $p24q4, 'Namibia SRHR Annual Report 2024',         'Annual',    'published', true,  100, 'Annual SRHR programme report for Namibia covering all outcome areas.'],
            [$u4, 'NA', $p24q2, 'Namibia Q2 2024 Quarterly Report',        'Quarterly', 'approved',  true,  100, 'Quarterly report on SRHR indicators and service coverage in Namibia.'],
            // Angola
            [$u9, 'AO', $p24q4, 'Angola SRHR Annual Report 2024',          'Annual',    'published', true,  100, 'Annual SRHR report for Angola covering legal frameworks and service access.'],
            [$u9, 'AO', $p24q3, 'Angola Q3 2024 Data Upload',              'Quarterly', 'draft',     false,  30, 'Partial quarterly data submission for Angola Q3 2024.'],
            // Eswatini
            [$u8, 'SZ', $p24q4, 'Eswatini SRHR Annual Report 2024',        'Annual',    'published', true,  100, 'Annual SRHR monitoring report for Eswatini covering all four outcome areas.'],
            [$u8, 'SZ', $p24q2, 'Eswatini Q2 2024 Brief',                  'Brief',     'submitted', false,  75, 'Mid-year SRHR evidence brief for Eswatini 2024.'],
            // Lesotho
            [$u6, 'LS', $p23q1, 'Lesotho SRHR Legislative Tracker Q1 2023','Quarterly', 'published', true,  100, 'Quarterly tracker of SRHR legislative progress in Lesotho.'],
            [$u6, 'LS', $p24q4, 'Lesotho SRHR Annual Report 2024',         'Annual',    'published', true,  100, 'Annual SRHR report for Lesotho 2024 with indicator trend analysis.'],
            [$u6, 'LS', $p24q3, 'Lesotho Budget Monitoring Report 2024',   'Brief',     'submitted', false,  80, 'Mid-year budget monitoring with focus on adolescent health line items.'],
            // DRC
            [$u1, 'CD', $p23q4, 'DRC SRHR Baseline Report 2023',           'Annual',    'published', true,  100, 'Baseline report establishing SRHR programme benchmarks for DRC.'],
            [$u1, 'CD', $p24q4, 'DRC SRHR Annual Report 2024',             'Annual',    'published', true,  100, 'Annual SRHR report for DRC 2024 tracking progress against baseline.'],
            [$u1, 'CD', $p24q3, 'DRC Q3 2024 Progress Report',             'Quarterly', 'draft',     false,  25, 'Early draft of DRC Q3 2024 SRHR progress update.'],
            // Madagascar
            [$u1, 'MG', $p24q4, 'Madagascar SRHR Annual Report 2024',      'Annual',    'approved',  false, 100, 'Annual SRHR report for Madagascar awaiting final publication clearance.'],
            [$u1, 'MG', $p24q2, 'Madagascar Q2 2024 Report',               'Quarterly', 'submitted', false,  88, 'Quarterly SRHR data submission for Madagascar Q2 2024.'],
            // Mauritius
            [$u2, 'MU', $p24q4, 'Mauritius SRHR Annual Report 2024',       'Annual',    'published', true,  100, 'Annual SRHR monitoring report for Mauritius 2024.'],
            [$u2, 'MU', $p24q2, 'Mauritius Q2 2024 Brief',                 'Brief',     'approved',  true,  100, 'Quarterly SRHR evidence brief for Mauritius Q2 2024.'],
            // Seychelles
            [$u2, 'SC', $p24q4, 'Seychelles SRHR Annual Report 2024',      'Annual',    'published', true,  100, 'Annual SRHR report for Seychelles 2024 covering legislative and budget progress.'],
            // Comoros
            [$u1, 'KM', $p24q4, 'Comoros SRHR Annual Report 2024',         'Annual',    'submitted', false,  88, 'Annual SRHR data submission package for Comoros 2024.'],
            // Regional
            [$u1, null, $p23q4, 'SADC Regional SRHR Synthesis 2023',       'Annual',    'published', true,  100, 'Regional synthesis of SRHR progress and country compliance trends for 2023.'],
            [$u1, null, $p24q4, 'SADC Regional SRHR Synthesis 2024',       'Annual',    'published', true,  100, 'Regional synthesis consolidating 2024 country submissions and outcome area performance.'],
            [$u7, null, $p23q4, 'SADC SRHR Research Report 2023',          'Research',  'published', true,  100, 'Cross-country research assessment supporting regional SRHR programme evidence base.'],
            [$u2, null, $p24q2, 'SADC Parliamentary SRHR Brief Q2 2024',   'Brief',     'published', true,  100, 'Mid-year regional brief on parliamentary oversight and SRHR legislative progress.'],
        ];

        $reports = [];
        $usedSlugs = [];
        foreach ($reportRows as [$uid, $cc, $pid, $title, $type, $status, $public, $completion, $summary]) {
            $slug = Str::slug($title);
            if (isset($usedSlugs[$slug])) {
                $slug .= '-' . uniqid();
            }
            $usedSlugs[$slug] = true;
            $reports[] = [
                'user_id'             => $uid,
                'country_id'          => $cc ? ($c[$cc] ?? null) : null,
                'reporting_period_id' => $pid,
                'title'               => $title,
                'slug'                => $slug,
                'type'                => $type,
                'status'              => $status,
                'summary'             => $summary,
                'completion'          => $completion,
                'is_public'           => $public,
                'published_at'        => in_array($status, ['published', 'approved']) ? now()->subDays(rand(3, 60))->toDateTimeString() : null,
                'due_at'              => now()->addDays(rand(20, 90))->toDateTimeString(),
                'file_size'           => in_array($status, ['published', 'approved', 'submitted']) ? rand(512, 5120) . ' KB' : null,
                'download_url'        => null,
                'created_at'          => $now,
                'updated_at'          => $now,
            ];
        }
        DB::table('reports')->insert($reports);

        // ── 5. Indicators — all 16 countries × 4 outcomes × 3 indicators × 4 quarters 2024
        DB::table('indicators')->delete();

        $outcomeIndicators = [
            'O2_Legal' => [
                ['O2.I1', 'O2', 'SRHR legal frameworks domesticated'],
                ['O2.I2', 'O2', 'Parliamentary SRHR committee established and functional'],
                ['O2.I3', 'O2', 'National SRHR policy reviewed and updated (%)'],
            ],
            'O3_Budget' => [
                ['O3.I1', 'O3', 'Domestic SRHR budget allocation increased (%)'],
                ['O3.I2', 'O3', 'SRHR budget disbursement on schedule (%)'],
                ['O3.I3', 'O3', 'Parliamentary SRHR budget oversight score'],
            ],
            'O4_Youth' => [
                ['O4.I1', 'O4', 'Adolescent-friendly health facilities operational'],
                ['O4.I2', 'O4', 'Youth SRHR service utilisation rate (per 1 000)'],
                ['O4.I3', 'O4', 'Comprehensive sexuality education coverage (%)'],
            ],
            'O5_GenderViolence' => [
                ['O5.I1', 'O5', 'GBV legislation enacted or strengthened'],
                ['O5.I2', 'O5', 'Survivor support centres operational (count)'],
                ['O5.I3', 'O5', 'GBV case management protocols adopted (%)'],
            ],
        ];

        // Realistic per-country performance profiles [status_weight, value_range]
        $countryProfiles = [
            'ZA' => ['statuses' => ['achieved', 'achieved', 'on-track', 'on-track'],          'range' => [65, 96]],
            'MU' => ['statuses' => ['achieved', 'on-track', 'on-track', 'on-track'],          'range' => [60, 92]],
            'BW' => ['statuses' => ['on-track', 'on-track', 'achieved', 'at-risk'],           'range' => [50, 88]],
            'NA' => ['statuses' => ['on-track', 'on-track', 'at-risk', 'achieved'],           'range' => [48, 85]],
            'ZM' => ['statuses' => ['on-track', 'at-risk', 'on-track', 'on-track'],           'range' => [45, 82]],
            'TZ' => ['statuses' => ['on-track', 'on-track', 'achieved', 'at-risk'],           'range' => [44, 80]],
            'MW' => ['statuses' => ['achieved', 'on-track', 'at-risk', 'on-track'],           'range' => [42, 85]],
            'SC' => ['statuses' => ['on-track', 'achieved', 'on-track', 'on-track'],          'range' => [55, 88]],
            'ZW' => ['statuses' => ['at-risk', 'on-track', 'on-track', 'at-risk'],            'range' => [35, 72]],
            'MZ' => ['statuses' => ['at-risk', 'at-risk', 'on-track', 'off-track'],           'range' => [25, 65]],
            'LS' => ['statuses' => ['on-track', 'at-risk', 'at-risk', 'on-track'],            'range' => [30, 68]],
            'SZ' => ['statuses' => ['on-track', 'on-track', 'at-risk', 'at-risk'],            'range' => [32, 70]],
            'AO' => ['statuses' => ['at-risk', 'off-track', 'at-risk', 'off-track'],          'range' => [18, 55]],
            'KM' => ['statuses' => ['at-risk', 'at-risk', 'off-track', 'at-risk'],            'range' => [20, 52]],
            'CD' => ['statuses' => ['off-track', 'at-risk', 'off-track', 'at-risk'],          'range' => [15, 48]],
            'MG' => ['statuses' => ['at-risk', 'off-track', 'at-risk', 'at-risk'],            'range' => [22, 55]],
        ];

        $trends = ['up', 'stable', 'down'];
        $quarterPeriods = [$p24q1, $p24q2, $p24q3, $p24q4];
        $indicators = [];

        foreach ($c as $code => $countryId) {
            if (! isset($countryProfiles[$code])) continue;
            $profile = $countryProfiles[$code];
            [$min, $max] = $profile['range'];

            foreach ($quarterPeriods as $pid) {
                $outcomeIdx = 0;
                foreach ($outcomeIndicators as $outcomeKey => $indRows) {
                    $status = $profile['statuses'][$outcomeIdx % 4];
                    foreach ($indRows as [$code2, $outCode, $name]) {
                        $indicators[] = [
                            'country_id'          => $countryId,
                            'reporting_period_id' => $pid,
                            'code'                => $code2,
                            'outcome_code'        => $outCode,
                            'name'                => $name,
                            'status'              => $status,
                            'value'               => rand($min, $max),
                            'trend'               => $trends[array_rand($trends)],
                            'notes'               => null,
                            'is_public'           => in_array($status, ['achieved', 'on-track']),
                            'created_at'          => $now,
                            'updated_at'          => $now,
                        ];
                    }
                    $outcomeIdx++;
                }
            }
        }

        foreach (array_chunk($indicators, 500) as $chunk) {
            DB::table('indicators')->insert($chunk);
        }

        // ── 6. Evidence — all 16 countries ────────────────────────────────────
        DB::table('evidences')->delete();

        $evidenceRows = [
            // [user_id, country_code, period_id, title, type, status, tags, linked, files]
            [$u1, 'MW', $p24q2, 'Malawi Youth Outreach Case Study',            'Story',    'submitted', ['youth','outreach'],         ['O4.I1','O4.I2'], []],
            [$u4, 'MW', $p24q2, 'Malawi Parliament SRHR Committee Minutes',    'Document', 'submitted', ['parliament','oversight'],    ['O2.I1','O2.I2'], [['name'=>'mw-committee-2024.pdf','size'=>204800]]],
            [$u4, 'TZ', $p23q2, 'Tanzania Maternal Health Facility Photos',    'Photo',    'submitted', ['maternal','facility'],       ['O3.I2','O4.I2'], [['name'=>'facility-01.jpg','size'=>512000],['name'=>'facility-02.jpg','size'=>487000]]],
            [$u4, 'TZ', $p24q1, 'Tanzania Budget Utilisation Report 2024',     'Document', 'submitted', ['budget','disbursement'],     ['O3.I1','O3.I3'], [['name'=>'tz-budget-q1-2024.pdf','size'=>389000]]],
            [$u3, 'ZM', $p23q4, 'Zambia GBV Survivor Stories Collection',      'Story',    'submitted', ['gbv','survivors'],           ['O5.I1','O5.I2'], []],
            [$u3, 'ZM', $p24q1, 'Zambia Parliament SRHR Caucus Research',      'Research', 'submitted', ['research','parliament'],     ['O2.I1','O2.I3'], [['name'=>'zm-caucus-2024.pdf','size'=>720000]]],
            [$u7, 'ZA', $p23q2, 'South Africa GBV Policy Analysis',            'Research', 'submitted', ['gbv','policy'],              ['O5.I1','O5.I3'], [['name'=>'sa-gbv-policy-2023.pdf','size'=>1048576]]],
            [$u2, 'ZA', $p24q3, 'South Africa SRHR Strategy Document 2025',    'Document', 'submitted', ['strategy','legal'],          ['O2.I1','O2.I2'], [['name'=>'sa-srhr-strategy-2025.pdf','size'=>856000]]],
            [$u4, 'MZ', $p23q3, 'Mozambique Youth Policy Consultation Report', 'Document', 'submitted', ['youth','consultation'],      ['O4.I1','O4.I2'], [['name'=>'moz-youth-consultation-2023.pdf','size'=>556000]]],
            [$u9, 'MZ', $p24q4, 'Mozambique Maternal Health Story',            'Story',    'submitted', ['maternal','community'],      ['O4.I2','O5.I2'], []],
            [$u1, 'ZW', $p24q4, 'Zimbabwe SRHR Legislative Review 2024',       'Document', 'submitted', ['legislation','parliament'],  ['O2.I1','O2.I2'], [['name'=>'zw-legislative-review-2024.pdf','size'=>612000]]],
            [$u4, 'ZW', $p24q3, 'Zimbabwe SRHR Awareness Campaign Photos 2024','Photo',    'draft',     ['awareness','campaign'],      ['O4.I3'],          [['name'=>'zw-campaign-01.jpg','size'=>394000]]],
            [$u6, 'BW', $p24q3, 'Botswana SRHR Community Outreach Photos',     'Photo',    'submitted', ['outreach','community'],      ['O4.I1'],          [['name'=>'bw-outreach-01.jpg','size'=>445000]]],
            [$u4, 'NA', $p24q2, 'Namibia Youth Reproductive Health Guidelines','Document', 'submitted', ['youth','guidelines'],        ['O4.I1','O4.I3'], [['name'=>'na-youth-guidelines-2024.pdf','size'=>502000]]],
            [$u9, 'AO', $p24q3, 'Angola Rural SRHR Access Story',              'Story',    'submitted', ['rural','access'],            ['O4.I2'],          []],
            [$u9, 'AO', $p24q3, 'Angola SRHR Indicator Data Report Q3 2024',   'Document', 'draft',     ['indicators','data'],         ['O3.I1','O3.I2'], [['name'=>'ao-indicators-q3-2024.pdf','size'=>389000]]],
            [$u8, 'SZ', $p24q4, 'Eswatini SRHR Awareness Campaign Video',      'Video',    'submitted', ['awareness','video'],         ['O4.I3'],          [['name'=>'sz-campaign.mp4','size'=>25600000]]],
            [$u8, 'SZ', $p24q2, 'Eswatini GBV Survivor Story',                 'Story',    'submitted', ['gbv','survivors'],           ['O5.I1','O5.I2'], []],
            [$u6, 'LS', $p23q1, 'Lesotho Parliament SRHR Debate Transcript',   'Document', 'submitted', ['parliament','legislation'],  ['O2.I1','O2.I2'], [['name'=>'ls-hansard-2023.pdf','size'=>298000]]],
            [$u6, 'LS', $p24q3, 'Lesotho Contraceptive Access Baseline Study', 'Research', 'submitted', ['contraception','baseline'],  ['O4.I2','O4.I3'], [['name'=>'ls-contraceptive-study-2024.pdf','size'=>734000]]],
            [$u1, 'CD', $p24q4, 'DRC SRHR Legislative and Budget Review 2024', 'Document', 'submitted', ['legislation','budget'],      ['O2.I1','O3.I1'], [['name'=>'cd-review-2024.pdf','size'=>921000]]],
            [$u1, 'MG', $p24q4, 'Madagascar Family Planning Success Story',    'Story',    'submitted', ['family-planning','success'], ['O4.I2'],          []],
            [$u2, 'MU', $p24q4, 'Mauritius SRHR Services Quality Assessment',  'Research', 'submitted', ['quality','assessment'],      ['O4.I1','O4.I2'], [['name'=>'mu-quality-assessment-2024.pdf','size'=>612000]]],
            [$u2, 'SC', $p24q4, 'Seychelles National SRHR Strategy 2024–2028', 'Document', 'submitted', ['strategy','national'],       ['O2.I1','O2.I3'], [['name'=>'sc-srhr-strategy-2024.pdf','size'=>445000]]],
            [$u1, 'KM', $p24q4, 'Comoros SRHR Data Submission Package 2024',   'Document', 'submitted', ['data','submission'],         ['O3.I1','O4.I1'], [['name'=>'km-data-package-2024.pdf','size'=>367000]]],
            [$u1, null, $p23q4, 'SADC Regional SRHR Assessment Research',      'Research', 'submitted', ['regional','cross-country'],  ['O2.I1','O3.I1','O4.I1','O5.I1'], [['name'=>'sadc-regional-assessment-2023.pdf','size'=>1572864]]],
            [$u2, null, $p24q4, 'SADC Parliamentary SRHR Framework 2025',      'Document', 'submitted', ['regional','parliament'],     ['O2.I1','O2.I2'], [['name'=>'sadc-parliament-framework-2025.pdf','size'=>892000]]],
        ];

        $evidences = [];
        foreach ($evidenceRows as [$uid, $cc, $pid, $title, $type, $status, $tags, $linked, $files]) {
            $evidences[] = [
                'user_id'             => $uid,
                'country_id'          => $cc ? ($c[$cc] ?? null) : null,
                'reporting_period_id' => $pid,
                'title'               => $title,
                'description'         => "Supporting evidence for SRHR monitoring and evaluation" . ($cc ? " — {$cc}" : " — SADC Region") . ".",
                'evidence_type'       => $type,
                'status'              => $status,
                'tags'                => json_encode($tags),
                'linked_indicators'   => json_encode($linked),
                'files'               => json_encode($files),
                'created_at'          => $now,
                'updated_at'          => $now,
            ];
        }
        DB::table('evidences')->insert($evidences);

        // ── 7. Activity Logs ──────────────────────────────────────────────────
        DB::table('activity_logs')->delete();

        $logs = [
            [$u1, 'MW', 'Report published: Malawi SRHR Annual Report 2024',            'report',    null, 'public',      1,  0],
            [$u4, 'TZ', 'Indicator data uploaded for Tanzania Q3 2024',                'indicator', null, 'upload_file', 1,  2],
            [$u3, 'ZM', 'Report submitted: Zambia Youth SRHR Research 2024',           'report',    null, 'description', 1,  4],
            [$u6, 'ZM', 'Report reviewed: Zambia Survivor Support Centre Brief',       'report',    null, 'rate_review', 2,  1],
            [$u7, 'ZA', 'Evidence uploaded: South Africa SRHR Strategy Document 2025', 'evidence',  null, 'attach_file', 2,  3],
            [$u2, 'ZA', 'Report approved: South Africa GBV Prevention Brief Q3 2024', 'report',    null, 'check_circle',2,  5],
            [$u9, 'AO', 'Report created: Angola Q3 2024 Data Upload',                  'report',    null, 'add_circle',  3,  0],
            [$u8, 'SZ', 'Story published: Eswatini GBV Survivor Story',                'evidence',  null, 'auto_stories',3,  2],
            [$u4, 'MZ', 'Indicator data uploaded for Mozambique Q2 2024',              'indicator', null, 'upload_file', 4,  1],
            [$u1, 'ZW', 'Report published: Zimbabwe SRHR Annual Report 2024',          'report',    null, 'public',      4,  4],
            [$u6, 'LS', 'Report submitted: Lesotho Budget Monitoring Report 2024',     'report',    null, 'description', 5,  0],
            [$u7, 'ZA', 'Indicator flagged: O5.I1 below threshold',                   'indicator', null, 'flag',        5,  3],
            [$u1, 'CD', 'Report created: DRC Q3 2024 Progress Report',                 'report',    null, 'add_circle',  6,  1],
            [$u2, 'MU', 'Report approved: Mauritius Q2 2024 Brief',                    'report',    null, 'check_circle',6,  5],
            [$u3, 'ZM', 'Evidence uploaded: Zambia Parliament SRHR Caucus Research',  'evidence',  null, 'attach_file', 7,  0],
            [$u4, 'TZ', 'Report submitted: Tanzania Q3 2024 Data Snapshot',            'report',    null, 'description', 8,  2],
            [$u1, 'MW', 'Report approved: Malawi Q3 2024 Progress Brief',              'report',    null, 'check_circle',9,  0],
            [$u8, 'SZ', 'Indicator data uploaded for Eswatini Q2 2024',               'indicator', null, 'upload_file', 9,  4],
            [$u9, 'MZ', 'Report submitted: Mozambique Q2 2024 Monitoring',             'report',    null, 'description', 11, 1],
            [$u7, 'ZA', 'Report created: South Africa Q2 2024 Research Summary',       'report',    null, 'add_circle',  13, 3],
            [$u2, 'SC', 'Report published: Seychelles SRHR Annual Report 2024',        'report',    null, 'public',      13, 0],
            [$u6, 'ZM', 'Indicators reviewed for Zambia Q3 2024',                     'indicator', null, 'rate_review', 14, 2],
            [$u1, 'NA', 'Report published: Namibia SRHR Annual Report 2024',           'report',    null, 'public',      15, 0],
            [$u4, 'TZ', 'Evidence uploaded: Tanzania Budget Utilisation Report 2024',  'evidence',  null, 'attach_file', 17, 1],
            [$u9, 'AO', 'Indicator data uploaded for Angola Q3 2024',                 'indicator', null, 'upload_file', 19, 3],
            [$u3, 'ZM', 'Report created: Zambia SRHR Annual Report 2024',              'report',    null, 'add_circle',  21, 0],
            [$u1, 'BW', 'Report published: Botswana SRHR Annual Report 2024',          'report',    null, 'public',      24, 2],
            [$u7, 'ZA', 'Evidence uploaded: South Africa GBV Policy Analysis',        'evidence',  null, 'attach_file', 27, 0],
            [$u2, null, 'New user invited: carlos@who.int',                            'user',      null, 'person_add',  30, 1],
            [$u1, 'MW', 'Report created: Malawi GBV Legislative Review 2024',          'report',    null, 'add_circle',  34, 0],
            [$u1, null, 'Regional Synthesis 2024 published',                           'report',    null, 'public',      2,  0],
            [$u4, 'TZ', 'Report published: Tanzania SRHR Annual Report 2024',          'report',    null, 'public',      3,  1],
            [$u6, 'LS', 'Report published: Lesotho SRHR Annual Report 2024',           'report',    null, 'public',      5,  2],
            [$u2, 'MU', 'Report published: Mauritius SRHR Annual Report 2024',         'report',    null, 'public',      7,  0],
            [$u1, 'CD', 'Report published: DRC SRHR Annual Report 2024',               'report',    null, 'public',      10, 3],
        ];

        $activityLogs = [];
        foreach ($logs as [$uid, $cc, $action, $subType, $subId, $icon, $days, $hours]) {
            $activityLogs[] = [
                'user_id'      => $uid,
                'country_id'   => $cc ? ($c[$cc] ?? null) : null,
                'action'       => $action,
                'subject_type' => $subType,
                'subject_id'   => $subId,
                'icon'         => $icon,
                'metadata'     => json_encode(['detail' => $action]),
                'created_at'   => now()->subDays($days)->subHours($hours)->toDateTimeString(),
            ];
        }
        DB::table('activity_logs')->insert($activityLogs);
    }
}
