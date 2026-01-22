<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\IssueController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

// Auth routes
Route::post('api/register', [AuthController::class, 'register']);
Route::post('api/login', [AuthController::class, 'login']);
Route::post('api/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('api/me', [AuthController::class, 'me'])->middleware('auth:sanctum');

// Issue routes
Route::get('api/issues', [IssueController::class, 'index']);
Route::get('api/issues/{issue}', [IssueController::class, 'show']);
Route::post('api/issues', [IssueController::class, 'store'])->middleware('auth:sanctum');
Route::put('api/issues/{issue}', [IssueController::class, 'update'])->middleware('auth:sanctum');
Route::delete('api/issues/{issue}', [IssueController::class, 'destroy'])->middleware('auth:sanctum');

// Admin routes
Route::prefix('api/admin')->group(function () {
    Route::get('issues', [AdminController::class, 'getIssues']);
    Route::put('issues/{issue}/status', [AdminController::class, 'updateStatus']);
    Route::get('issues/{issue}/updates', [AdminController::class, 'getIssueUpdates']);
});

// Default route
Route::get('/', function () {
    return view('welcome');
});
