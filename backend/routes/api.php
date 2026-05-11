<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\PortalController;
use App\Http\Controllers\PublicPortalController;
use App\Modules\Auth\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register-request', [AuthController::class, 'registerRequest']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

Route::prefix('public')->group(function () {
    Route::get('dashboard', [PublicPortalController::class, 'dashboard']);
    Route::get('countries', [PublicPortalController::class, 'countries']);
    Route::get('countries/{slug}', [PublicPortalController::class, 'country']);
    Route::get('reports', [PublicPortalController::class, 'reports']);
    Route::get('reports/{id}', [PublicPortalController::class, 'report']);
    Route::get('news', [PublicPortalController::class, 'news']);
    Route::get('stories', [PublicPortalController::class, 'stories']);
    Route::get('resources', [PublicPortalController::class, 'resources']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('portal')->group(function () {
        Route::get('dashboard', [PortalController::class, 'dashboard']);
        Route::get('reports/saved', [PortalController::class, 'savedReports']);
        Route::get('evidence/metadata', [PortalController::class, 'evidenceMetadata']);
        Route::post('evidence', [PortalController::class, 'storeEvidence']);
        Route::get('evidence', [PortalController::class, 'evidence']);

        Route::get('reports', [PortalController::class, 'reports']);
        Route::post('reports', [PortalController::class, 'createReport']);
        Route::get('reports/{id}', [PortalController::class, 'showReport']);
        Route::put('reports/{id}', [PortalController::class, 'updateReport']);
        Route::patch('reports/{id}/status', [PortalController::class, 'updateReportStatus']);
        Route::delete('reports/{id}', [PortalController::class, 'deleteReport']);
        Route::get('reports/{id}/sharing', [PortalController::class, 'getReportSharing']);
        Route::post('reports/{id}/sharing', [PortalController::class, 'updateReportSharing']);

        Route::get('indicators', [PortalController::class, 'indicators']);
        Route::post('indicators', [PortalController::class, 'storeIndicator']);
    });

    Route::prefix('admin')->group(function () {
        Route::get('users', [AdminController::class, 'users']);
        Route::put('users/{user}', [AdminController::class, 'updateUser']);
        Route::patch('users/{user}/status', [AdminController::class, 'toggleUserStatus']);
        Route::post('access-requests/{accessRequest}/approve', [AdminController::class, 'approveAccessRequest']);
        Route::get('audit-logs', [AdminController::class, 'auditLogs']);
        Route::get('configuration', [AdminController::class, 'getConfiguration']);
        Route::put('configuration', [AdminController::class, 'updateConfiguration']);
    });
});
