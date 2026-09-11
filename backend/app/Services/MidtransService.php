<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class MidtransService
{
    /**
     * Create a Snap transaction. The server key is only read from backend config
     * and is never included in the returned payload.
     *
     * @return array{token: string, redirect_url?: string}
     */
    public function createSnapTransaction(Order $order, array $customerDetails): array
    {
        $items = collect($order->products ?? [])->map(function (array $item): array {
            return [
                'id' => (string) ($item['product_id'] ?? $item['name']),
                'price' => (int) ($item['unit_price'] ?? 0),
                'quantity' => (int) ($item['quantity'] ?? 1),
                'name' => trim((string) ($item['name'] ?? 'Produk')),
            ];
        })->values()->all();

        if ((int) $order->shipping_cost > 0) {
            $items[] = [
                'id' => 'shipping',
                'price' => (int) $order->shipping_cost,
                'quantity' => 1,
                'name' => 'Ongkos kirim'.($order->shipping_service ? ' - '.$order->shipping_service : ''),
            ];
        }

        $payload = [
            'transaction_details' => [
                'order_id' => $order->order_number,
                'gross_amount' => (int) $order->gross_amount,
            ],
            'item_details' => $items,
            'customer_details' => $customerDetails,
        ];

        try {
            $response = Http::acceptJson()
                ->withBasicAuth((string) config('services.midtrans.server_key'), '')
                ->timeout(30)
                ->post((string) config('services.midtrans.api_url'), $payload);

            if ($response->failed() || ! is_string($response->json('token'))) {
                Log::error('Midtrans Snap transaction failed', [
                    'order_id' => $order->order_number,
                    'status' => $response->status(),
                    'response' => $response->json(),
                ]);
                throw new RuntimeException('Gagal membuat transaksi pembayaran.');
            }

            return [
                'token' => (string) $response->json('token'),
                'redirect_url' => $response->json('redirect_url'),
            ];
        } catch (RequestException $exception) {
            Log::error('Midtrans Snap request exception', ['order_id' => $order->order_number, 'error' => $exception->getMessage()]);
            throw new RuntimeException('Gagal membuat transaksi pembayaran.', 0, $exception);
        }
    }

    public function verifySignature(string $orderId, string $statusCode, string $grossAmount, string $signatureKey): bool
    {
        $expected = hash('sha512', $orderId.$statusCode.$grossAmount.(string) config('services.midtrans.server_key'));
        return hash_equals($expected, $signatureKey);
    }
}
