<?php

namespace App\Services;

use App\Models\ShippingMethod;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class RajaOngkirService
{
    /** @return array<int, array<string, mixed>> */
    public function calculate(array $data): array
    {
        $origin = config('services.rajaongkir.origin_district_id');
        if (! is_numeric($origin) || (int) $origin < 1) {
            throw new RuntimeException('ID kecamatan asal toko belum dikonfigurasi.');
        }

        ShippingMethod::ensureDefaults();
        $activeCouriers = ShippingMethod::query()
            ->whereIn('code', ShippingMethod::configuredCodes())
            ->where('is_active', true)
            ->pluck('code')
            ->map(fn ($code) => strtolower((string) $code))
            ->all();
        $requestedCouriers = array_filter(explode(':', strtolower((string) ($data['courier'] ?? ''))));
        $couriers = array_values(array_intersect($requestedCouriers, $activeCouriers));
        if ($couriers === []) throw new RuntimeException('Tidak ada metode pengiriman aktif untuk dihitung.');

        $response = Http::asForm()
            ->acceptJson()
            ->withHeaders(['key' => (string) config('services.rajaongkir.key')])
            ->timeout(20)
            ->post(rtrim((string) config('services.rajaongkir.base_url'), '/').'/calculate/district/domestic-cost', [
                'origin' => (int) $origin,
                'destination' => (int) $data['destination'],
                'weight' => (int) $data['weight'],
                'courier' => implode(':', $couriers),
                'price' => $data['price'] ?? 'lowest',
            ]);

        if ($response->failed()) throw new RuntimeException('Gagal menghitung ongkos kirim RajaOngkir.');
        $payload = $response->json();
        $rows = $payload['data'] ?? $payload['rajaongkir']['results'] ?? [];
        return is_array($rows) ? array_values($rows) : [];
    }
}
