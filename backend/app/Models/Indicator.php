<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Indicator extends Model
{
    protected $fillable = [
        'country_id',
        'reporting_period_id',
        'code',
        'outcome_code',
        'name',
        'status',
        'value',
        'trend',
        'notes',
        'is_public',
    ];

    protected function casts(): array
    {
        return [
            'value' => 'integer',
            'is_public' => 'boolean',
        ];
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(ReportingPeriod::class, 'reporting_period_id');
    }
}
