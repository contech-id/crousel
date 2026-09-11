<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::query()->latest();
        if ($request->user() instanceof User) {
            $query->where('user_id', $request->user()->id);
        }
        if ($request->filled('status')) $query->where('status', $request->string('status'));
        return response()->json(['data' => $query->get()->map(fn (Order $order) => $this->present($order))]);
    }

    public function store(Request $request): JsonResponse
    {
        // Older clients sent a flat list of product names. Normalize that
        // payload so existing checkouts can still be accepted while new
        // orders retain size, color and weight per item.
        $request->merge([
            'products' => collect($request->input('products', []))->map(
                fn ($product) => is_string($product)
                    ? [
                        'name' => $product,
                        'size' => null,
                        'color' => null,
                        'weight' => 500,
                        'quantity' => 1,
                        'total_weight' => 500,
                    ]
                    : $product
            )->all(),
        ]);
        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:150'], 'products' => ['required', 'array', 'min:1'],
            'products.*' => ['required', 'array'],
            'products.*.name' => ['required', 'string', 'max:200'],
            'products.*.size' => ['nullable', 'string', 'max:50'],
            'products.*.color' => ['nullable', 'string', 'max:100'],
            'products.*.weight' => ['required', 'integer', 'min:1'],
            'products.*.quantity' => ['required', 'integer', 'min:1'],
            'products.*.total_weight' => ['required', 'integer', 'min:1'],
            'item_count' => ['required', 'integer', 'min:1'],
            'payment_method' => ['required', 'string', 'max:150'], 'total' => ['required', 'integer', 'min:0'],
        ]);
        $data['products'] = array_map(static function (array $product): array {
            $product['total_weight'] = (int) $product['weight'] * (int) $product['quantity'];
            return $product;
        }, $data['products']);
        $data['order_number'] = 'CRS-'.now()->format('ymd').'-'.str_pad((string) (Order::count() + 1), 4, '0', STR_PAD_LEFT);
        $order = Order::create($data);
        return response()->json(['message' => 'Pesanan berhasil dibuat.', 'data' => $this->present($order)], 201);
    }

    private function present(Order $order): array
    {
        $products = collect($order->products ?? [])->map(function ($product): array {
            if (is_string($product)) {
                return [
                    'name' => $product,
                    'size' => null,
                    'color' => null,
                    'weight' => 500,
                    'quantity' => 1,
                    'total_weight' => 500,
                ];
            }

            $weight = (int) ($product['weight'] ?? 500);
            $quantity = (int) ($product['quantity'] ?? 1);
            return [
                'name' => (string) ($product['name'] ?? ''),
                'size' => $product['size'] ?? null,
                'color' => $product['color'] ?? null,
                'weight' => $weight,
                'quantity' => $quantity,
                'total_weight' => (int) ($product['total_weight'] ?? ($weight * $quantity)),
            ];
        })->values()->all();

        return [
            'id' => $order->order_number,
            'customer' => $order->customer_name,
            'date' => $order->created_at->format('d/m/Y'),
            'products' => $products,
            'items' => $order->item_count,
            'payment' => $order->payment_method,
            'total' => $order->total,
            'status' => $order->status,
            'payment_status' => $order->payment_status ?? ($order->status === 'Selesai' ? 'paid' : 'pending'),
            'transaction_status' => $order->transaction_status,
            'gross_amount' => $order->gross_amount ?? $order->total,
            'shipping_cost' => $order->shipping_cost ?? 0,
            'payment_method' => $order->payment_method,
        ];
    }
}
