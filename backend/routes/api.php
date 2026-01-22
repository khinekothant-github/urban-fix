<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\IssueController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

// Auth routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('me', [AuthController::class, 'me'])->middleware('auth:sanctum');

// Issue routes
Route::get('issues', [IssueController::class, 'index']);
Route::get('issues/{issue}', [IssueController::class, 'show']);
Route::post('issues', [IssueController::class, 'store'])->middleware('auth:sanctum');
Route::put('issues/{issue}', [IssueController::class, 'update'])->middleware('auth:sanctum');
Route::delete('issues/{issue}', [IssueController::class, 'destroy'])->middleware('auth:sanctum');

// Admin routes
Route::prefix('admin')->group(function () {
    Route::get('issues', [AdminController::class, 'getIssues']);
    Route::put('issues/{issue}/status', [AdminController::class, 'updateStatus']);
    Route::get('issues/{issue}/updates', [AdminController::class, 'getIssueUpdates']);
});