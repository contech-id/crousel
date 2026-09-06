<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\AdminAuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/admin/auth/login', [AdminAuthController::class, 'login']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/category/{category}', [ProductController::class, 'byCategory']);
    Route::get('/products/{product}', [ProductController::class, 'show']);

    // Store settings are exposed as a cohesive module. Replace with admin auth middleware in production.
    Route::get('/settings', [SettingsController::class, 'index']);
    Route::put('/settings/profile', [SettingsController::class, 'profile']);
    Route::delete('/settings/profile', [SettingsController::class, 'destroyProfile']);
    Route::get('/settings/shipping', [SettingsController::class, 'shipping']);
    Route::patch('/settings/shipping/{shippingMethod}', [SettingsController::class, 'toggleShipping']);
    Route::get('/settings/payments', [SettingsController::class, 'payments']);
    Route::patch('/settings/payments/{paymentMethod}', [SettingsController::class, 'togglePayment']);
    Route::get('/settings/notifications', [SettingsController::class, 'notifications']);
    Route::put('/settings/notifications', [SettingsController::class, 'notifications']);
    Route::get('/notifications', [SettingsController::class, 'history']);
    Route::post('/notifications/events', [SettingsController::class, 'event']);
    Route::patch('/notifications/{notification}/read', [SettingsController::class, 'markRead']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::patch('/profile', [AuthController::class, 'updateProfile']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::patch('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::patch('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
    });

    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function (): void {
        Route::post('/auth/logout', [AdminAuthController::class, 'logout']);
        Route::get('/account', [AdminAuthController::class, 'account']);
        Route::put('/account', [AdminAuthController::class, 'updateAccount']);
        Route::put('/account/password', [AdminAuthController::class, 'updatePassword']);
    });
});
