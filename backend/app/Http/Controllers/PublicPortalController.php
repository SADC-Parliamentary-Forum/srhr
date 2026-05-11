<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Country;
use App\Models\Indicator;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicPortalController extends Controller
{
    public function dashboard(): JsonResponse
    {
        $publicReports = Report::query()->where('is_public', true);
        $publicIndicators = Indicator::query()->where('is_public', true);
        $countries = Country::query()->where('is_active', true)->get();

        $countryStatuses = $countries->map(function (Country $country) {
            $status = $country->indicators()
                ->selectRaw("CASE
                    WHEN AVG(CASE WHEN status = 'achieved' THEN 3 WHEN status = 'on-track' THEN 2 ELSE 1 END) >= 2.4 THEN 'up-to-date'
                    ELSE 'pending'
                END as status")
                ->value('status') ?? 'pending';

            return [
                'abbr' => $country->code,
                'name' => $country->name,
                'slug' => $country->slug,
                'status' => $status,
            ];
        });

        $outcomes = $publicIndicators
            ->selectRaw('outcome_code, COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN status = 'achieved' THEN 1 ELSE 0 END) as achieved_count")
            ->selectRaw("SUM(CASE WHEN status = 'on-track' THEN 1 ELSE 0 END) as on_track_count")
            ->selectRaw("SUM(CASE WHEN status = 'at-risk' THEN 1 ELSE 0 END) as at_risk_count")
            ->groupBy('outcome_code')
            ->orderBy('outcome_code')
            ->get()
            ->map(function ($row) {
                $status = $row->at_risk_count > 0 ? 'at-risk' : ($row->on_track_count > 0 ? 'on-track' : 'achieved');

                return [
                    'code' => $row->outcome_code,
                    'name' => match ($row->outcome_code) {
                        'O2' => 'Legal Frameworks',
                        'O3' => 'Budget Allocation',
                        'O4' => 'Youth Access',
                        'O5' => 'Gender Violence',
                        default => 'Outcome '.$row->outcome_code,
                    },
                    'desc' => match ($row->outcome_code) {
                        'O2' => 'Domestication of SRHR models',
                        'O3' => 'Domestic funding increases',
                        'O4' => 'Adolescent friendly services',
                        'O5' => 'Reduction in GBV incidents',
                        default => 'Strategic outcome',
                    },
                    'status' => $status,
                ];
            })
            ->values();

        $achieved = (int) $publicIndicators->clone()->where('status', 'achieved')->count();
        $totalIndicators = max((int) $publicIndicators->clone()->count(), 1);

        $recentReports = $publicReports->clone()
            ->with('country')
            ->latest('published_at')
            ->take(6)
            ->get()
            ->map(fn (Report $report) => [
                'title' => $report->title,
                'country' => $report->country?->name ?? 'Regional',
                'type' => $report->type,
                'date' => optional($report->published_at)->format('M Y'),
                'size' => $report->file_size ?? 'PDF',
                'download_url' => $report->download_url,
            ]);

        return response()->json([
            'regional_progress' => (int) round(($achieved / $totalIndicators) * 100),
            'country_count' => $countryStatuses->where('status', 'up-to-date')->count(),
            'country_total' => $countryStatuses->count(),
            'public_report_count' => $publicReports->clone()->count(),
            'outcomes' => $outcomes,
            'country_statuses' => $countryStatuses->values(),
            'recent_reports' => $recentReports,
        ]);
    }

    public function countries(Request $request): JsonResponse
    {
        $search = trim((string) $request->query('search', ''));
        $statusFilter = (string) $request->query('status', '');

        $countries = Country::query()
            ->where('is_active', true)
            ->when($search !== '', fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->get()
            ->map(function (Country $country) {
                $indicators = $country->indicators()->get();
                $reports = $country->reports()->where('is_public', true)->get();
                $avg = (int) round($indicators->avg('value') ?? 0);
                $statusScore = $indicators->avg(fn ($item) => match ($item->status) {
                    'achieved' => 3,
                    'on-track' => 2,
                    default => 1,
                }) ?? 1;

                $status = $statusScore >= 2.4 ? 'on-track' : ($statusScore >= 1.7 ? 'in-progress' : 'needs-attention');
                $latestReport = $reports->sortByDesc('published_at')->first();

                return [
                    'name' => $country->name,
                    'slug' => $country->slug,
                    'status' => $status,
                    'period' => $latestReport?->period?->label ?? 'No reports yet',
                    'reports' => $reports->count(),
                    'indicators' => $avg,
                ];
            })
            ->filter(fn (array $country) => $statusFilter === '' || $country['status'] === $statusFilter)
            ->values();

        return response()->json($countries);
    }

    public function country(string $slug): JsonResponse
    {
        $country = Country::query()->where('slug', $slug)->firstOrFail();
        $reports = $country->reports()->where('is_public', true)->with('period')->latest('published_at')->get();
        $indicators = $country->indicators()->where('is_public', true)->orderBy('code')->get();
        $recentActivity = ActivityLog::query()
            ->where('country_id', $country->id)
            ->latest('created_at')
            ->take(5)
            ->get();

        $achieved = $indicators->where('status', 'achieved')->count();
        $onTrack = $indicators->where('status', 'on-track')->count();
        $atRisk = $indicators->where('status', 'at-risk')->count();
        $latestReport = $reports->first();
        $status = $atRisk > 2 ? 'needs-attention' : ($onTrack > 0 ? 'in-progress' : 'on-track');

        return response()->json([
            'name' => $country->name,
            'slug' => $country->slug,
            'status' => $status,
            'period' => $latestReport?->period?->label ?? 'No reports yet',
            'reports' => $reports->count(),
            'indicators' => max((int) round($indicators->avg('value') ?? 0), 0),
            'onTrack' => $onTrack,
            'atRisk' => $atRisk,
            'narrative' => "{$country->name} continues to advance SRHR reporting through parliamentary oversight, evidence-backed advocacy, and routine programme monitoring across the national portfolio.",
            'latestReport' => $latestReport?->title ?? 'No published report yet',
            'reportDate' => optional($latestReport?->published_at)->format('M Y'),
            'indicator_rows' => $indicators->map(fn (Indicator $indicator) => [
                'id' => $indicator->code,
                'outcome' => $indicator->outcome_code,
                'name' => $indicator->name,
                'status' => $indicator->status,
                'trend' => $indicator->trend ?? '+0%',
            ])->values(),
            'recent_activity' => $recentActivity->map(fn (ActivityLog $activity) => [
                'icon' => $activity->icon ?? 'update',
                'title' => $activity->action,
                'desc' => $activity->metadata['description'] ?? '',
                'time' => $activity->created_at?->diffForHumans(),
            ])->values(),
        ]);
    }

    public function reports(Request $request): JsonResponse
    {
        $search = trim((string) $request->query('search', ''));
        $country = trim((string) $request->query('country', ''));
        $year = trim((string) $request->query('year', ''));
        $types = collect(explode(',', (string) $request->query('types', '')))->filter()->values();

        $reports = Report::query()
            ->with('country')
            ->where('is_public', true)
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($inner) use ($search) {
                    $inner->where('title', 'like', "%{$search}%")
                        ->orWhere('summary', 'like', "%{$search}%");
                });
            })
            ->when($country !== '', fn ($query) => $query->whereHas('country', fn ($inner) => $inner->where('name', $country)))
            ->when($year !== '', fn ($query) => $query->whereYear('published_at', $year))
            ->when($types->isNotEmpty(), fn ($query) => $query->whereIn('type', $types))
            ->latest('published_at')
            ->get()
            ->map(fn (Report $report) => [
                'title' => $report->title,
                'description' => $report->summary,
                'type' => $report->type,
                'country' => $report->country?->name ?? 'Regional',
                'date' => optional($report->published_at)->format('M Y'),
                'size' => $report->file_size ?? 'PDF',
                'download_url' => $report->download_url,
            ])
            ->values();

        $countries = Report::query()->where('is_public', true)->with('country')->get()
            ->pluck('country.name')->filter()->unique()->values();

        return response()->json([
            'reports' => $reports,
            'countries' => $countries,
            'years' => Report::query()->where('is_public', true)->whereNotNull('published_at')->get()->map(fn (Report $report) => $report->published_at->format('Y'))->unique()->values(),
        ]);
    }

    public function report(int $id): JsonResponse
    {
        $report = Report::query()
            ->with(['country', 'period'])
            ->where('is_public', true)
            ->findOrFail($id);

        return response()->json([
            'id'           => $report->id,
            'title'        => $report->title,
            'type'         => $report->type,
            'summary'      => $report->summary,
            'country'      => $report->country?->name,
            'period'       => $report->period?->label,
            'published_at' => $report->published_at?->format('M j, Y'),
            'download_url' => $report->download_url,
        ]);
    }

    public function news(): JsonResponse
    {
        return response()->json(['data' => []]);
    }

    public function stories(): JsonResponse
    {
        return response()->json(['data' => []]);
    }

    public function resources(): JsonResponse
    {
        return response()->json(['data' => []]);
    }
}
