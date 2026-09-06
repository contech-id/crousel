<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminNotification;
use App\Models\NotificationSetting;
use App\Models\PaymentMethod;
use App\Models\ShippingMethod;
use App\Models\StoreSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index(): JsonResponse
    {
        $this->ensureDefaults();
        return response()->json(['data' => $this->payload()]);
    }

    public function profile(Request $request): JsonResponse
    {
        $data = $request->validate([
            'store_name' => ['required', 'string', 'max:150'], 'store_email' => ['required', 'email', 'max:150'],
            'whatsapp' => ['required', 'string', 'max:20'], 'province' => ['required', 'string', 'max:100'],
            'regency' => ['required', 'string', 'max:100'], 'district' => ['required', 'string', 'max:100'],
            'village' => ['required', 'string', 'max:100'], 'postal_code' => ['required', 'string', 'max:10'],
            'address' => ['required', 'string', 'max:500'], 'location_landmark' => ['nullable', 'string', 'max:150'],
        ]);
        $setting = StoreSetting::firstOrCreate(['id' => 1]);
        $setting->update($data);
        return response()->json(['message' => 'Profil toko berhasil disimpan.', 'data' => ['profile' => $setting->fresh()]]);
    }

    public function destroyProfile(): JsonResponse
    {
        StoreSetting::whereKey(1)->delete();
        return response()->json(['message' => 'Profil toko berhasil dihapus.']);
    }

    public function shipping(): JsonResponse { $this->ensureDefaults(); return response()->json(['data' => ShippingMethod::orderBy('name')->get()]); }
    public function toggleShipping(Request $request, ShippingMethod $shippingMethod): JsonResponse
    {
        $data = $request->validate(['is_active' => ['required', 'boolean']]);
        $shippingMethod->update($data);
        return response()->json(['message' => 'Metode pengiriman diperbarui.', 'data' => ['shipping' => $shippingMethod->fresh()]]);
    }

    public function payments(): JsonResponse { $this->ensureDefaults(); return response()->json(['data' => PaymentMethod::orderBy('name')->get()]); }
    public function togglePayment(Request $request, PaymentMethod $paymentMethod): JsonResponse
    {
        $data = $request->validate(['is_active' => ['required', 'boolean']]);
        $paymentMethod->update($data);
        return response()->json(['message' => 'Metode pembayaran diperbarui.', 'data' => ['payment' => $paymentMethod->fresh()]]);
    }

    public function notifications(Request $request): JsonResponse
    {
        $setting = NotificationSetting::firstOrCreate(['id' => 1]);
        if ($request->isMethod('put') || $request->isMethod('patch')) {
            $setting->update($request->validate(['new_customer' => ['sometimes', 'boolean'], 'new_order' => ['sometimes', 'boolean']]));
        }
        return response()->json(['data' => ['settings' => $setting->fresh()]]);
    }

    public function history(): JsonResponse
    {
        $items = AdminNotification::query()->latest()->limit(50)->get();
        return response()->json(['data' => ['notifications' => $items, 'unread_count' => $items->whereNull('read_at')->count()]]);
    }

    public function event(Request $request): JsonResponse
    {
        $data = $request->validate(['type' => ['required', 'in:new_customer,new_order'], 'title' => ['required', 'string', 'max:150'], 'message' => ['required', 'string', 'max:500']]);
        $setting = NotificationSetting::firstOrCreate(['id' => 1]);
        $enabled = $data['type'] === 'new_customer' ? $setting->new_customer : $setting->new_order;
        if ($enabled) AdminNotification::create($data);
        return response()->json(['message' => $enabled ? 'Notifikasi dibuat.' : 'Notifikasi dinonaktifkan.', 'data' => ['created' => $enabled]]);
    }

    public function markRead(AdminNotification $notification): JsonResponse
    {
        $notification->update(['read_at' => now()]);
        return response()->json(['message' => 'Notifikasi ditandai telah dibaca.', 'data' => ['notification' => $notification->fresh()]]);
    }

    private function ensureDefaults(): void
    {
        StoreSetting::firstOrCreate(['id' => 1], ['store_name' => 'Crousel Official', 'store_email' => 'hello@crousel.id', 'whatsapp' => '6281234567890', 'province' => 'DKI Jakarta', 'regency' => 'Jakarta Selatan', 'district' => 'Kebayoran Baru', 'village' => 'Pulo', 'postal_code' => '12160', 'address' => 'Jl. Crousel No. 1', 'location_landmark' => 'Dekat taman kota']);
        NotificationSetting::firstOrCreate(['id' => 1]);
        if (ShippingMethod::count() === 0) ShippingMethod::insert([['code' => 'jne', 'name' => 'JNE', 'provider' => 'RajaOngkir', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], ['code' => 'jnt', 'name' => 'J&T Express', 'provider' => 'RajaOngkir', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], ['code' => 'sicepat', 'name' => 'SiCepat', 'provider' => 'RajaOngkir', 'is_active' => false, 'created_at' => now(), 'updated_at' => now()]]);
        if (PaymentMethod::count() === 0) PaymentMethod::insert([['code' => 'bca_va', 'name' => 'BCA Virtual Account', 'type' => 'virtual_account', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], ['code' => 'bsi_va', 'name' => 'BSI Virtual Account', 'type' => 'virtual_account', 'is_active' => false, 'created_at' => now(), 'updated_at' => now()], ['code' => 'seabank_va', 'name' => 'SeaBank Virtual Account', 'type' => 'virtual_account', 'is_active' => false, 'created_at' => now(), 'updated_at' => now()], ['code' => 'qris', 'name' => 'QRIS', 'type' => 'qris', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], ['code' => 'dana', 'name' => 'DANA', 'type' => 'e_wallet', 'is_active' => false, 'created_at' => now(), 'updated_at' => now()], ['code' => 'ovo', 'name' => 'OVO', 'type' => 'e_wallet', 'is_active' => false, 'created_at' => now(), 'updated_at' => now()], ['code' => 'gopay', 'name' => 'GoPay', 'type' => 'e_wallet', 'is_active' => false, 'created_at' => now(), 'updated_at' => now()]]);
    }

    private function payload(): array
    {
        return ['profile' => StoreSetting::find(1), 'shipping' => ShippingMethod::orderBy('name')->get(), 'payments' => PaymentMethod::orderBy('name')->get(), 'notifications' => NotificationSetting::find(1)];
    }
}
