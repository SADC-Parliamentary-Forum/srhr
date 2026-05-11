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
});

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('portal')->group(function () {
        Route::get('dashboard', [PortalController::class, 'dashboard']);
        Route::get('reports', [PortalController::class, 'reports']);
        Route::get('reports/saved', [PortalController::class, 'savedReports']);
        Route::get('evidence/metadata', [PortalController::class, 'evidenceMetadata']);
        Route::post('evidence', [PortalController::class, 'storeEvidence']);
    });

    Route::prefix('admin')->group(function () {
        Route::get('users', [AdminController::class, 'users']);
        Route::post('access-requests/{accessRequest}/approve', [AdminController::class, 'approveAccessRequest']);
    });
});
