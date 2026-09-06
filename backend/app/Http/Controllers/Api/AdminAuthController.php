<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate(['email' => ['required', 'email'], 'password' => ['required', 'string']]);
        $admin = Admin::where('email', $credentials['email'])->first();
        if (! $admin || ! $admin->is_active || ! Hash::check($credentials['password'], $admin->password)) {
            throw ValidationException::withMessages(['email' => ['Email atau password admin salah.']]);
        }
        $token = $admin->createToken('admin')->plainTextToken;
        return response()->json(['message' => 'Login admin berhasil.', 'data' => ['admin' => $this->present($admin), 'token' => $token, 'token_type' => 'Bearer']]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();
        return response()->json(['message' => 'Logout admin berhasil.']);
    }

    public function account(Request $request): JsonResponse
    {
        return response()->json(['data' => ['admin' => $this->present($request->user())]]);
    }

    public function updateAccount(Request $request): JsonResponse
    {
        /** @var Admin $admin */
        $admin = $request->user();
        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:100'], 'username' => ['required', 'string', 'min:3', 'max:50', Rule::unique('admins', 'username')->ignore($admin->id)],
            'phone' => ['nullable', 'string', 'max:20'], 'email' => ['required', 'email', 'max:150', Rule::unique('admins', 'email')->ignore($admin->id)],
        ]);
        $admin->update($data);
        return response()->json(['message' => 'Akun admin berhasil diperbarui.', 'data' => ['admin' => $this->present($admin->fresh())]]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        /** @var Admin $admin */
        $admin = $request->user();
        $data = $request->validate(['password' => ['nullable', 'string', 'min:8', 'max:72']]);
        if (blank($data['password'] ?? null)) return response()->json(['message' => 'Password tidak diubah.']);
        $admin->update(['password' => $data['password']]);
        return response()->json(['message' => 'Password admin berhasil diubah.']);
    }

    private function present(Admin $admin): array
    {
        return $admin->only(['id', 'name', 'username', 'phone', 'email', 'role', 'is_active', 'created_at', 'updated_at']);
    }
}
