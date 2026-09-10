<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Client\RequestException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class LocationController
{
    private const BASE_URL = 'https://rajaongkir.komerce.id/api/v1/destination';

    public function provinces(): JsonResponse { return $this->forward('/province'); }
    public function cities(string $provinceId): JsonResponse { return $this->forward('/city/'.rawurlencode($provinceId)); }
    public function districts(string $cityId): JsonResponse { return $this->forward('/district/'.rawurlencode($cityId)); }
    public function subdistricts(string $districtId): JsonResponse { return $this->forward('/sub-district/'.rawurlencode($districtId)); }

    private function forward(string $path): JsonResponse
    {
        try {
            $response = Http::acceptJson()->withHeaders(['key' => (string) config('services.rajaongkir.key')])->timeout(15)->get(self::BASE_URL.$path);
            if ($response->failed()) return response()->json(['message' => 'Gagal memuat data lokasi Raja Ongkir.'], $response->status());
            $payload = $response->json();
            return response()->json(['data' => $payload['data'] ?? $payload['rajaongkir']['results'] ?? []]);
        } catch (\Throwable) {
            return response()->json(['message' => 'Layanan lokasi sedang tidak tersedia.'], 503);
        }
    }
}
