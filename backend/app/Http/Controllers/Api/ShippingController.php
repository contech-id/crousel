<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShippingMethod;
use Illuminate\Http\Client\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ShippingController extends Controller
{
    private const COST_URL = 'https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost';

    public function cost(Request $request): JsonResponse
    {
        $data = $request->validate([
            'origin' => ['sometimes', 'integer', 'min:1'],
            'destination' => ['required', 'integer', 'min:1'],
            'weight' => ['required', 'integer', 'min:1'],
            'courier' => ['required', 'string', 'max:300', 'regex:/^[a-z0-9:]+$/i'],
            'price' => ['sometimes', 'string', 'in:lowest,highest'],
        ]);
        $origin = $data['origin'] ?? config('services.rajaongkir.origin_district_id');
        if (! is_numeric($origin) || (int) $origin < 1) {
            return response()->json(['message' => 'ID kecamatan asal toko belum dikonfigurasi.'], 422);
        }
        ShippingMethod::ensureDefaults();
        $activeCouriers = ShippingMethod::query()->where('is_active', true)->pluck('code')->map(fn ($code) => strtolower((string) $code))->all();
        $requestedCouriers = array_filter(explode(':', strtolower($data['courier'])));
        $couriers = array_values(array_intersect($requestedCouriers, $activeCouriers));
        if ($couriers === []) {
            return response()->json(['message' => 'Tidak ada metode pengiriman aktif untuk dihitung.'], 422);
        }

        try {
            /** @var Response $response */
            $response = Http::asForm()
                ->acceptJson()
                ->withHeaders(['key' => (string) config('services.rajaongkir.key')])
                ->timeout(20)
                ->post(self::COST_URL, [
                    'origin' => (int) $origin,
                    'destination' => $data['destination'],
                    'weight' => $data['weight'],
                    'courier' => implode(':', $couriers),
                    'price' => $data['price'] ?? 'lowest',
                ]);

            if ($response->failed()) {
                return response()->json(['message' => 'Gagal menghitung ongkos kirim RajaOngkir.'], 502);
            }

            $payload = $response->json();
            return response()->json([
                'data' => $payload['data'] ?? $payload['rajaongkir']['results'] ?? [],
            ]);
        } catch (\Throwable) {
            return response()->json(['message' => 'Layanan ongkos kirim sedang tidak tersedia.'], 503);
        }
    }

    public function available(): JsonResponse
    {
        ShippingMethod::ensureDefaults();
        return response()->json([
            'data' => ShippingMethod::query()->where('is_active', true)->orderBy('name')->get(['code', 'name']),
        ]);
    }
}
