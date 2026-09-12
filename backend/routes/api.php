<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductCategoryController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\ShippingController;
use App\Http\Controllers\Api\CheckoutPaymentController;
use App\Http\Controllers\Api\MidtransWebhookController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\SocialMediaController;
use App\Http\Controllers\Api\ContactController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/admin/auth/login', [AdminAuthController::class, 'login']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/category/{category}', [ProductController::class, 'byCategory']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::get('/categories', [ProductCategoryController::class, 'index']);
    Route::get('/categories/{category}', [ProductCategoryController::class, 'show']);
    Route::get('/settings/customization', [SettingsController::class, 'customization']);
    Route::get('/social-media', [SocialMediaController::class, 'index']);
    Route::post('/contact', [ContactController::class, 'store']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::post('/webhooks/midtrans', MidtransWebhookController::class);
    Route::get('/locations/provinces', [LocationController::class, 'provinces']);
    Route::get('/locations/cities/{provinceId}', [LocationController::class, 'cities']);
    Route::get('/locations/districts/{cityId}', [LocationController::class, 'districts']);
    Route::get('/locations/subdistricts/{districtId}', [LocationController::class, 'subdistricts']);
    Route::post('/shipping/cost', [ShippingController::class, 'cost']);
    Route::get('/shipping/methods', [ShippingController::class, 'available']);

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
        Route::post('/profile', [AuthController::class, 'updateProfile']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::patch('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::patch('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/cart', [CartController::class, 'index']);
        Route::post('/cart', [CartController::class, 'store']);
        Route::delete('/cart', [CartController::class, 'clear']);
        Route::patch('/cart/{cartItem}', [CartController::class, 'update']);
        Route::delete('/cart/{cartItem}', [CartController::class, 'destroy']);
        Route::post('/checkout/payment', [CheckoutPaymentController::class, 'store']);
        Route::get('/orders/{orderId}', [CheckoutPaymentController::class, 'show']);
    });

    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function (): void {
        Route::post('/auth/logout', [AdminAuthController::class, 'logout']);
        Route::get('/account', [AdminAuthController::class, 'account']);
        Route::put('/account', [AdminAuthController::class, 'updateAccount']);
        Route::put('/account/password', [AdminAuthController::class, 'updatePassword']);
        Route::post('/categories', [ProductCategoryController::class, 'store']);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::patch('/categories/{category}', [ProductCategoryController::class, 'update']);
        Route::delete('/categories/{category}', [ProductCategoryController::class, 'destroy']);
        Route::put('/customization', [SettingsController::class, 'updateCustomization']);
        Route::post('/customization', [SettingsController::class, 'updateCustomization']);
        Route::post('/social-media', [SocialMediaController::class, 'store']);
        Route::patch('/social-media/{socialMedia}', [SocialMediaController::class, 'update']);
        Route::delete('/social-media/{socialMedia}', [SocialMediaController::class, 'destroy']);
    });
});
