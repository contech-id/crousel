<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShippingMethod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\RajaOngkirService;
use RuntimeException;

class ShippingController extends Controller
{
    public function cost(Request $request, RajaOngkirService $rajaOngkir): JsonResponse
    {
        $data = $request->validate([
            'destination' => ['required', 'integer', 'min:1'],
            'weight' => ['required', 'integer', 'min:1'],
            'courier' => ['required', 'string', 'max:300', 'regex:/^[a-z0-9:]+$/i'],
            'price' => ['sometimes', 'string', 'in:lowest,highest'],
        ]);
        try {
            return response()->json(['data' => $rajaOngkir->calculate($data)]);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 502);
        } catch (\Throwable) {
            return response()->json(['message' => 'Layanan ongkos kirim sedang tidak tersedia.'], 503);
        }
    }

    public function available(): JsonResponse
    {
        ShippingMethod::ensureDefaults();
        return response()->json([
            'data' => ShippingMethod::query()->whereIn('code', ShippingMethod::configuredCodes())->where('is_active', true)->orderBy('name')->get(['code', 'name']),
        ]);
    }
}
