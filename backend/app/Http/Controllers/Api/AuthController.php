<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AdminNotification;
use App\Models\NotificationSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $request->merge(['whatsapp' => self::normalizeWhatsapp($request->input('whatsapp'))]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:100'],
            'whatsapp' => ['required', 'string', 'regex:/^62[0-9]{8,13}$/', 'unique:users,whatsapp'],
            'password' => ['required', 'string', 'min:8', 'max:72'],
        ]);

        $user = User::create($validated);
        if (NotificationSetting::firstOrCreate(['id' => 1])->new_customer) {
            AdminNotification::create(['type' => 'new_customer', 'title' => 'Pelanggan baru', 'message' => $user->name.' baru saja mendaftar.']);
        }
        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'message' => 'Registrasi berhasil.',
            'data' => ['user' => $user, 'token' => $token, 'token_type' => 'Bearer'],
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $request->merge(['whatsapp' => self::normalizeWhatsapp($request->input('whatsapp'))]);

        $validated = $request->validate([
            'whatsapp' => ['required', 'string', 'regex:/^62[0-9]{8,13}$/'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('whatsapp', $validated['whatsapp'])->first();
        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'whatsapp' => ['Nomor WhatsApp atau password salah.'],
            ]);
        }

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil.',
            'data' => ['user' => $user, 'token' => $token, 'token_type' => 'Bearer'],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logout berhasil.']);
    }

    public function profile(Request $request): JsonResponse
    {
        return response()->json(['data' => ['user' => $request->user()]]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        if ($request->exists('whatsapp')) {
            $request->merge(['whatsapp' => self::normalizeWhatsapp($request->input('whatsapp'))]);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'min:2', 'max:100'],
            'whatsapp' => ['sometimes', 'required', 'string', 'regex:/^62[0-9]{8,13}$/', 'unique:users,whatsapp,'.$request->user()->id],
            'birth_date' => ['sometimes', 'nullable', 'date', 'before_or_equal:today'],
            'gender' => ['sometimes', 'nullable', 'string', 'in:male,female,other'],
            'province' => ['sometimes', 'nullable', 'string', 'max:100'],
            'regency' => ['sometimes', 'nullable', 'string', 'max:100'],
            'district' => ['sometimes', 'nullable', 'string', 'max:100'],
            'village' => ['sometimes', 'nullable', 'string', 'max:100'],
            'postal_code' => ['sometimes', 'nullable', 'string', 'max:10'],
            'address' => ['sometimes', 'nullable', 'string', 'max:500'],
        ]);

        $request->user()->update($validated);

        return response()->json([
            'message' => 'Profil berhasil diperbarui.',
            'data' => ['user' => $request->user()->fresh()],
        ]);
    }

    private static function normalizeWhatsapp(mixed $value): mixed
    {
        if (! is_string($value)) {
            return $value;
        }

        $phone = preg_replace('/[\s().-]+/', '', $value);
        if (str_starts_with($phone, '+')) {
            $phone = substr($phone, 1);
        }
        if (str_starts_with($phone, '08')) {
            $phone = '62'.substr($phone, 1);
        } elseif (str_starts_with($phone, '8')) {
            $phone = '62'.$phone;
        }

        return $phone;
    }
}
