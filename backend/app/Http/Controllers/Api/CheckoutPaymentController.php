<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\CartItem;
use App\Services\MidtransService;
use App\Services\RajaOngkirService;
use Illuminate\Database\DatabaseManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class CheckoutPaymentController extends Controller
{
    public function store(Request $request, RajaOngkirService $rajaOngkir, MidtransService $midtrans): JsonResponse
    {
        $data = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.size' => ['required', 'string', 'max:50'],
            'items.*.color' => ['required', 'string', 'max:100'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
            'shipping.courier' => ['required', 'string', 'max:30', 'regex:/^[a-z0-9]+$/i'],
            'shipping.service' => ['required', 'string', 'max:100'],
            'shipping.cost' => ['required', 'integer', 'min:0'],
            'idempotency_key' => ['required', 'string', 'max:100'],
        ]);

        $user = $request->user();
        if (! $user || ! $user->district_id || ! $user->address) {
            throw ValidationException::withMessages(['address' => 'Alamat pengiriman belum lengkap.']);
        }

        $products = Product::query()->whereIn('id', collect($data['items'])->pluck('product_id'))->get()->keyBy('id');
        $orderProducts = [];
        $subtotal = 0;
        $totalWeight = 0;
        $itemCount = 0;

        foreach ($data['items'] as $item) {
            /** @var Product|null $product */
            $product = $products->get((int) $item['product_id']);
            if (! $product) throw ValidationException::withMessages(['items' => 'Produk tidak ditemukan.']);
            if ($product->availability === 'Habis') throw ValidationException::withMessages(['items' => "Produk {$product->name} sedang habis."]);
            if (! in_array($item['size'], $product->availableSizes ?? [], true)) throw ValidationException::withMessages(['items' => "Ukuran {$item['size']} tidak tersedia untuk {$product->name}."]);
            if (! in_array($item['color'], $product->availableColors ?? [], true)) throw ValidationException::withMessages(['items' => "Warna {$item['color']} tidak tersedia untuk {$product->name}."]);

            $unitPrice = $this->priceToInteger((string) $product->price);
            $weight = max(1, (int) ($product->weight ?: 500));
            $quantity = (int) $item['quantity'];
            $subtotal += $unitPrice * $quantity;
            $totalWeight += $weight * $quantity;
            $itemCount += $quantity;
            $orderProducts[] = [
                'product_id' => $product->id,
                'name' => $product->name,
                'size' => $item['size'],
                'color' => $item['color'],
                'unit_price' => $unitPrice,
                'weight' => $weight,
                'quantity' => $quantity,
                'total_weight' => $weight * $quantity,
                'total_price' => $unitPrice * $quantity,
            ];
        }

        $shippingCost = (int) $data['shipping']['cost'];
        $courier = strtolower($data['shipping']['courier']);
        $service = $data['shipping']['service'];
        if ($courier === 'pickup') {
            if ($shippingCost !== 0) throw ValidationException::withMessages(['shipping' => 'Biaya ambil di toko harus Rp0.']);
        } else {
            try {
                $rates = $rajaOngkir->calculate([
                    'destination' => (int) $user->district_id,
                    'weight' => $totalWeight,
                    'courier' => $courier,
                    'price' => 'lowest',
                ]);
            } catch (RuntimeException $exception) {
                throw ValidationException::withMessages(['shipping' => $exception->getMessage()]);
            }
            $isValidRate = collect($rates)->contains(function ($rate) use ($courier, $service, $shippingCost): bool {
                return strtolower((string) ($rate['code'] ?? '')) === $courier
                    && (string) ($rate['service'] ?? '') === (string) $service
                    && (int) ($rate['cost'] ?? -1) === $shippingCost;
            });
            if (! $isValidRate) throw ValidationException::withMessages(['shipping' => 'Ongkos kirim tidak valid atau sudah berubah. Silakan hitung ulang.']);
        }

        $grossAmount = $subtotal + $shippingCost;
        try {
            $result = DB::transaction(function () use ($data, $user, $orderProducts, $itemCount, $subtotal, $shippingCost, $courier, $service, $grossAmount, $midtrans): array {
                $existing = Order::where('idempotency_key', $data['idempotency_key'])->where('user_id', $user->id)->first();
                if ($existing && $existing->snap_token) {
                    return ['order_id' => $existing->order_number, 'snap_token' => $existing->snap_token];
                }
                $order = Order::create([
                    'order_number' => $this->newOrderNumber(),
                    'user_id' => $user->id,
                    'customer_name' => $user->name,
                    'products' => $orderProducts,
                    'item_count' => $itemCount,
                    'payment_method' => null,
                    'total' => $grossAmount,
                    'shipping_cost' => $shippingCost,
                    'shipping_courier' => $courier,
                    'shipping_service' => $service,
                    'status' => 'Menunggu pembayaran',
                    'payment_status' => 'pending',
                    'transaction_status' => 'pending',
                    'gross_amount' => $grossAmount,
                    'idempotency_key' => $data['idempotency_key'],
                ]);
                $snap = $midtrans->createSnapTransaction($order, [
                    'first_name' => $user->name,
                    'phone' => $user->whatsapp,
                    'address' => $user->address,
                    'city' => $user->regency,
                    'postal_code' => $user->postal_code,
                ]);
                $order->update(['snap_token' => $snap['token']]);
                CartItem::where('user_id', $user->id)->delete();
                return ['order_id' => $order->order_number, 'snap_token' => $snap['token']];
            });
        } catch (RuntimeException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 502);
        } catch (\Throwable) {
            return response()->json(['success' => false, 'message' => 'Gagal membuat transaksi pembayaran.'], 502);
        }

        return response()->json(['success' => true, 'data' => $result], 201);
    }

    public function show(Request $request, string $orderId): JsonResponse
    {
        $order = Order::query()->where('order_number', $orderId)->where('user_id', $request->user()->id)->firstOrFail();
        return response()->json(['data' => $this->present($order)]);
    }

    private function priceToInteger(string $price): int
    {
        $value = (int) preg_replace('/[^0-9]/', '', $price);
        if ($value < 1) throw ValidationException::withMessages(['items' => 'Harga produk tidak valid.']);
        return $value;
    }

    private function newOrderNumber(): string
    {
        do {
            $number = 'ORD-'.now()->format('Ymd').'-'.strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));
        } while (Order::where('order_number', $number)->exists());
        return $number;
    }

    private function present(Order $order): array
    {
        return [
            'id' => $order->order_number,
            'customer' => $order->customer_name,
            'date' => $order->created_at->format('d/m/Y'),
            'products' => $order->products ?? [],
            'items' => $order->item_count,
            'payment' => $order->payment_method,
            'total' => $order->gross_amount ?: $order->total,
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'transaction_status' => $order->transaction_status,
            'shipping_cost' => $order->shipping_cost,
            'paid_at' => $order->paid_at,
        ];
    }
}
