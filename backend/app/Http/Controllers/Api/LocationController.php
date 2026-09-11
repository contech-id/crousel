<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Client\RequestException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class LocationController
{
    public function provinces(): JsonResponse { return $this->forward('/destination/province'); }
    public function cities(string $provinceId): JsonResponse { return $this->forward('/destination/city/'.rawurlencode($provinceId)); }
    public function districts(string $cityId): JsonResponse { return $this->forward('/destination/district/'.rawurlencode($cityId)); }
    public function subdistricts(string $districtId): JsonResponse { return $this->forward('/destination/sub-district/'.rawurlencode($districtId)); }

    private function forward(string $path): JsonResponse
    {
        try {
            $response = Http::acceptJson()->withHeaders(['key' => (string) config('services.rajaongkir.key')])->timeout(15)->get(rtrim((string) config('services.rajaongkir.base_url'), '/').$path);
            if ($response->failed()) return response()->json(['message' => 'Gagal memuat data lokasi Raja Ongkir.'], $response->status());
            $payload = $response->json();
            return response()->json(['data' => $payload['data'] ?? $payload['rajaongkir']['results'] ?? []]);
        } catch (\Throwable) {
            return response()->json(['message' => 'Layanan lokasi sedang tidak tersedia.'], 503);
        }
    }
}
