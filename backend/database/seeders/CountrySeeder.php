<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        $countries = [
            ['name' => 'Angola',       'code' => 'AO', 'region' => 'Southern Africa', 'parliament_name' => 'National Assembly of Angola'],
            ['name' => 'Botswana',     'code' => 'BW', 'region' => 'Southern Africa', 'parliament_name' => 'Parliament of Botswana'],
            ['name' => 'Comoros',      'code' => 'KM', 'region' => 'Eastern Africa',  'parliament_name' => 'Assembly of the Union'],
            ['name' => 'DRC',          'code' => 'CD', 'region' => 'Central Africa',  'parliament_name' => 'National Assembly of DRC'],
            ['name' => 'Eswatini',     'code' => 'SZ', 'region' => 'Southern Africa', 'parliament_name' => 'Parliament of Eswatini'],
            ['name' => 'Lesotho',      'code' => 'LS', 'region' => 'Southern Africa', 'parliament_name' => 'Parliament of Lesotho'],
            ['name' => 'Madagascar',   'code' => 'MG', 'region' => 'Eastern Africa',  'parliament_name' => 'Parliament of Madagascar'],
            ['name' => 'Malawi',       'code' => 'MW', 'region' => 'Southern Africa', 'parliament_name' => 'National Assembly of Malawi'],
            ['name' => 'Mauritius',    'code' => 'MU', 'region' => 'Eastern Africa',  'parliament_name' => 'National Assembly of Mauritius'],
            ['name' => 'Mozambique',   'code' => 'MZ', 'region' => 'Southern Africa', 'parliament_name' => 'Assembly of the Republic'],
            ['name' => 'Namibia',      'code' => 'NA', 'region' => 'Southern Africa', 'parliament_name' => 'National Assembly of Namibia'],
            ['name' => 'Seychelles',   'code' => 'SC', 'region' => 'Eastern Africa',  'parliament_name' => 'National Assembly of Seychelles'],
            ['name' => 'South Africa', 'code' => 'ZA', 'region' => 'Southern Africa', 'parliament_name' => 'National Assembly of South Africa'],
            ['name' => 'Tanzania',     'code' => 'TZ', 'region' => 'Eastern Africa',  'parliament_name' => 'National Assembly of Tanzania'],
            ['name' => 'Zambia',       'code' => 'ZM', 'region' => 'Southern Africa', 'parliament_name' => 'National Assembly of Zambia'],
            ['name' => 'Zimbabwe',     'code' => 'ZW', 'region' => 'Southern Africa', 'parliament_name' => 'Parliament of Zimbabwe'],
        ];

        foreach ($countries as $country) {
            DB::table('countries')->updateOrInsert(
                ['code' => $country['code']],
                array_merge($country, [
                    'slug' => Str::slug($country['name']),
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }
}
