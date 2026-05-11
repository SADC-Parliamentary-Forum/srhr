<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Country;
use App\Models\Evidence;
use App\Models\Indicator;
use App\Models\Report;
use App\Models\ReportingPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PortalController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        $user = $request->user();
        $reportQuery = Report::query()->when($user->country_id, fn ($query) => $query->where('country_id', $user->country_id));
        $indicatorQuery = Indicator::query()->when($user->country_id, fn ($query) => $query->where('country_id', $user->country_id));
        $evidenceQuery = Evidence::query()->when($user->country_id, fn ($query) => $query->where('country_id', $user->country_id));

        $kpis = [
            ['label' => 'Reports Submitted', 'value' => (string) $reportQuery->clone()->whereIn('status', ['submitted', 'review', 'approved', 'published'])->count()],
            ['label' => 'Reports Pending', 'value' => (string) $reportQuery->clone()->whereIn('status', ['draft', 'review'])->count()],
            ['label' => 'Indicators Achieved', 'value' => (string) $indicatorQuery->clone()->where('status', 'achieved')->count()],
            ['label' => 'Indicators On Track', 'value' => (string) $indicatorQuery->clone()->where('status', 'on-track')->count()],
            ['label' => 'Indicators At Risk', 'value' => (string) $indicatorQuery->clone()->where('status', 'at-risk')->count()],
            ['label' => 'Evidence Uploaded', 'value' => (string) $evidenceQuery->clone()->count()],
        ];

        $deadlines = $reportQuery->clone()
            ->with('country')
            ->whereNotNull('due_at')
            ->orderBy('due_at')
            ->take(6)
            ->get()
            ->map(fn (Report $report) => [
                'report' => $report->title,
                'due' => $report->due_at?->format('M j, Y'),
                'status' => Str::headline($report->status),
            ]);

        $recentActivity = ActivityLog::query()
            ->when($user->country_id, fn ($query) => $query->where('country_id', $user->country_id))
            ->latest('created_at')
            ->take(8)
            ->get()
            ->map(fn (ActivityLog $activity) => [
                'icon' => $activity->icon ?? 'update',
                'action' => $activity->action,
                'user' => $activity->user?->name ?? ($activity->metadata['user'] ?? 'System'),
                'time' => $activity->created_at?->diffForHumans(),
            ]);

        $welcomeCountry = $user->country?->name ?? 'Regional';

        return response()->json([
            'user' => [
                'name' => $user->name,
                'country' => $welcomeCountry,
            ],
            'kpis' => $kpis,
            'deadlines' => $deadlines,
            'recent_activity' => $recentActivity,
        ]);
    }

    public function reports(Request $request): JsonResponse
    {
        $user = $request->user();
        $reports = Report::query()
            ->with(['country', 'period'])
            ->when($user->country_id, fn ($query) => $query->where('country_id', $user->country_id))
            ->latest('updated_at')
            ->get()
            ->map(fn (Report $report) => [
                'id' => $report->id,
                'title' => $report->title,
                'country' => $report->country?->name ?? 'Regional',
                'period' => $report->period?->label ?? 'N/A',
                'status' => $report->status,
                'type' => $report->type,
                'completion' => $report->completion,
                'summary' => $report->summary,
                'lastEdited' => optional($report->updated_at)->format('M j, Y'),
                'owner' => $report->user?->name ?? 'System',
            ]);

        return response()->json($reports);
    }

    public function savedReports(Request $request): JsonResponse
    {
        return $this->reports($request);
    }

    public function evidenceMetadata(): JsonResponse
    {
        return response()->json([
            'countries' => Country::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'slug']),
            'periods' => ReportingPeriod::query()->where('is_active', true)->orderByDesc('year')->orderByDesc('quarter')->get(['id', 'label']),
            'indicators' => Indicator::query()->select('code', 'name')->distinct()->orderBy('code')->get(),
            'evidence_types' => ['Story', 'Photo', 'Video', 'Document', 'Research'],
        ]);
    }

    public function storeEvidence(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'evidence_type' => ['required', 'string', 'max:100'],
            'country_id' => ['nullable', 'exists:countries,id'],
            'reporting_period_id' => ['nullable', 'exists:reporting_periods,id'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'linked_indicators' => ['nullable', 'array'],
            'linked_indicators.*' => ['string', 'max:50'],
            'status' => ['nullable', 'in:draft,submitted'],
            'files' => ['nullable', 'array'],
            'files.*' => ['file', 'max:51200'],
        ]);

        $storedFiles = collect($request->file('files', []))->map(function ($file) {
            $path = $file->store('evidence', 'public');

            return [
                'name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'path' => $path,
                'url' => Storage::disk('public')->url($path),
            ];
        })->values()->all();

        $evidence = Evidence::create([
            'user_id' => $request->user()->id,
            'country_id' => $validated['country_id'] ?? $request->user()->country_id,
            'reporting_period_id' => $validated['reporting_period_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'evidence_type' => $validated['evidence_type'],
            'tags' => $validated['tags'] ?? [],
            'linked_indicators' => $validated['linked_indicators'] ?? [],
            'status' => $validated['status'] ?? 'draft',
            'files' => $storedFiles,
        ]);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'country_id' => $evidence->country_id,
            'action' => "Evidence {$evidence->status}",
            'subject_type' => 'evidence',
            'subject_id' => $evidence->id,
            'icon' => 'attach_file',
            'metadata' => ['description' => $evidence->title],
            'created_at' => now(),
        ]);

        return response()->json([
            'id' => $evidence->id,
            'message' => $evidence->status === 'submitted' ? 'Evidence submitted successfully.' : 'Evidence draft saved successfully.',
        ], 201);
    }
}
