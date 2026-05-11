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

    public function showReport(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $report = Report::query()
            ->with(['country', 'period', 'user'])
            ->when($user->country_id && !$user->hasRole('super_admin') && !$user->hasRole('secretariat'),
                fn ($q) => $q->where('country_id', $user->country_id))
            ->findOrFail($id);

        return response()->json($this->formatReport($report));
    }

    public function createReport(Request $request): JsonResponse
    {
        abort_unless($request->user()->can('create_report'), 403);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:Annual,Quarterly,Brief,Research'],
            'country_id' => ['nullable', 'exists:countries,id'],
            'reporting_period_id' => ['nullable', 'exists:reporting_periods,id'],
            'summary' => ['nullable', 'string'],
            'due_at' => ['nullable', 'date'],
        ]);

        $report = Report::create([
            'user_id' => $request->user()->id,
            'country_id' => $validated['country_id'] ?? $request->user()->country_id,
            'reporting_period_id' => $validated['reporting_period_id'] ?? null,
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . time(),
            'type' => $validated['type'],
            'status' => 'draft',
            'summary' => $validated['summary'] ?? null,
            'completion' => 0,
            'due_at' => $validated['due_at'] ?? null,
            'is_public' => false,
        ]);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'country_id' => $report->country_id,
            'action' => 'Report created',
            'subject_type' => 'report',
            'subject_id' => $report->id,
            'icon' => 'description',
            'metadata' => ['title' => $report->title],
            'created_at' => now(),
        ]);

        return response()->json($this->formatReport($report->load(['country', 'period', 'user'])), 201);
    }

    public function updateReport(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $report = Report::findOrFail($id);
        abort_unless($user->can('create_report') || $report->user_id === $user->id, 403);

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', 'in:Annual,Quarterly,Brief,Research'],
            'country_id' => ['nullable', 'exists:countries,id'],
            'reporting_period_id' => ['nullable', 'exists:reporting_periods,id'],
            'summary' => ['nullable', 'string'],
            'completion' => ['sometimes', 'integer', 'min:0', 'max:100'],
            'due_at' => ['nullable', 'date'],
        ]);

        $report->update($validated);

        return response()->json($this->formatReport($report->fresh(['country', 'period', 'user'])));
    }

    public function updateReportStatus(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $report = Report::findOrFail($id);

        $validated = $request->validate([
            'status' => ['required', 'in:draft,submitted,review,approved,published,archived'],
        ]);

        $newStatus = $validated['status'];

        $allowedTransitions = [
            'draft'     => ['submitted'],
            'submitted' => ['review', 'draft'],
            'review'    => ['approved', 'submitted'],
            'approved'  => ['published', 'review'],
            'published' => ['archived'],
        ];

        abort_unless(
            in_array($newStatus, $allowedTransitions[$report->status] ?? []) || $user->hasRole('super_admin'),
            422
        );

        $report->update([
            'status'       => $newStatus,
            'published_at' => $newStatus === 'published' ? now() : $report->published_at,
            'is_public'    => $newStatus === 'published',
        ]);

        ActivityLog::create([
            'user_id'      => $user->id,
            'country_id'   => $report->country_id,
            'action'       => 'Report status → ' . $newStatus,
            'subject_type' => 'report',
            'subject_id'   => $report->id,
            'icon'         => 'update',
            'metadata'     => ['title' => $report->title, 'status' => $newStatus],
            'created_at'   => now(),
        ]);

        return response()->json(['status' => $report->fresh()->status]);
    }

    public function deleteReport(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $report = Report::findOrFail($id);
        abort_unless($user->hasRole('super_admin') || $report->user_id === $user->id, 403);

        $report->delete();

        return response()->json(['message' => 'Report deleted.']);
    }

    public function getReportSharing(Request $request, int $id): JsonResponse
    {
        $report = Report::findOrFail($id);

        return response()->json([
            'is_public'    => $report->is_public,
            'download_url' => $report->download_url,
            'shared_with'  => [],
        ]);
    }

    public function updateReportSharing(Request $request, int $id): JsonResponse
    {
        $report = Report::findOrFail($id);
        abort_unless(
            $request->user()->can('publish_public_content') || $report->user_id === $request->user()->id,
            403
        );

        $validated = $request->validate([
            'is_public' => ['required', 'boolean'],
        ]);

        $report->update(['is_public' => $validated['is_public']]);

        return response()->json(['is_public' => $report->fresh()->is_public]);
    }

    public function indicators(Request $request): JsonResponse
    {
        $user = $request->user();

        $indicators = Indicator::query()
            ->with(['country', 'period'])
            ->when($user->country_id, fn ($q) => $q->where('country_id', $user->country_id))
            ->orderBy('code')
            ->get()
            ->map(fn ($i) => [
                'id'           => $i->id,
                'code'         => $i->code,
                'outcome_code' => $i->outcome_code,
                'name'         => $i->name,
                'value'        => $i->value,
                'trend'        => $i->trend,
                'status'       => $i->status,
                'country'      => $i->country?->name,
                'period'       => $i->period?->label,
                'notes'        => $i->notes,
            ]);

        return response()->json($indicators);
    }

    public function storeIndicator(Request $request): JsonResponse
    {
        abort_unless($request->user()->can('upload_indicators'), 403);

        $validated = $request->validate([
            'code'                => ['required', 'string', 'max:20'],
            'outcome_code'        => ['required', 'string', 'max:20'],
            'name'                => ['required', 'string', 'max:255'],
            'country_id'          => ['nullable', 'exists:countries,id'],
            'reporting_period_id' => ['nullable', 'exists:reporting_periods,id'],
            'value'               => ['nullable', 'integer'],
            'trend'               => ['nullable', 'in:up,down,stable'],
            'status'              => ['nullable', 'in:achieved,on-track,at-risk,off-track'],
            'notes'               => ['nullable', 'string'],
        ]);

        $indicator = Indicator::create([
            ...$validated,
            'country_id' => $validated['country_id'] ?? $request->user()->country_id,
            'is_public'  => false,
        ]);

        return response()->json(['id' => $indicator->id, 'message' => 'Indicator saved.'], 201);
    }

    public function evidence(Request $request): JsonResponse
    {
        $user = $request->user();

        $items = Evidence::query()
            ->with(['country', 'period', 'user'])
            ->when($user->country_id, fn ($q) => $q->where('country_id', $user->country_id))
            ->latest()
            ->get()
            ->map(function (Evidence $e) {
                $files = collect($e->files ?? [])->map(fn (array $file) => [
                    'name' => $file['name'] ?? 'File',
                    'size' => isset($file['size']) ? $this->formatBytes((int) $file['size']) : null,
                    'bytes' => isset($file['size']) ? (int) $file['size'] : null,
                    'url' => $file['url'] ?? null,
                ])->values()->all();

                $fileBytes = collect($e->files ?? [])->sum(fn (array $file) => (int) ($file['size'] ?? 0));

                return [
                    'id' => $e->id,
                    'title' => $e->title,
                    'description' => $e->description,
                    'evidence_type' => $e->evidence_type,
                    'status' => $e->status,
                    'country' => $e->country?->name,
                    'period' => $e->period?->label,
                    'tags' => $e->tags,
                    'linked_indicators' => $e->linked_indicators,
                    'files_count' => count($e->files ?? []),
                    'files' => $files,
                    'file_size' => $fileBytes > 0 ? $this->formatBytes($fileBytes) : null,
                    'owner' => $e->user?->name ?? 'System',
                    'created_at' => $e->created_at?->toIso8601String(),
                    'created_label' => $e->created_at?->format('M j, Y'),
                ];
            });

        return response()->json($items);
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes >= 1024 * 1024) {
            return number_format($bytes / (1024 * 1024), 1) . ' MB';
        }

        if ($bytes >= 1024) {
            return number_format($bytes / 1024, 1) . ' KB';
        }

        return $bytes . ' B';
    }

    private function formatReport(Report $report): array
    {
        return [
            'id'                   => $report->id,
            'title'                => $report->title,
            'slug'                 => $report->slug,
            'type'                 => $report->type,
            'status'               => $report->status,
            'summary'              => $report->summary,
            'completion'           => $report->completion,
            'country'              => $report->country?->name ?? 'Regional',
            'country_id'           => $report->country_id,
            'period'               => $report->period?->label ?? 'N/A',
            'reporting_period_id'  => $report->reporting_period_id,
            'due_at'               => $report->due_at?->format('Y-m-d'),
            'published_at'         => $report->published_at?->format('M j, Y'),
            'is_public'            => $report->is_public,
            'lastEdited'           => optional($report->updated_at)->format('M j, Y'),
            'owner'                => $report->user?->name ?? 'System',
            'owner_id'             => $report->user_id,
        ];
    }
}
