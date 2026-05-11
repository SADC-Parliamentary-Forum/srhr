<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evidence extends Model
{
    protected $table = 'evidences';

    protected $fillable = [
        'user_id',
        'country_id',
        'reporting_period_id',
        'title',
        'description',
        'evidence_type',
        'tags',
        'linked_indicators',
        'status',
        'files',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'linked_indicators' => 'array',
            'files' => 'array',
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
