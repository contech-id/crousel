<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::query()->latest();
        if ($request->filled('status')) $query->where('status', $request->string('status'));
        return response()->json(['data' => $query->get()->map(fn (Order $order) => $this->present($order))]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:150'], 'products' => ['required', 'array', 'min:1'],
            'products.*' => ['required', 'string', 'max:200'], 'item_count' => ['required', 'integer', 'min:1'],
            'payment_method' => ['required', 'string', 'max:150'], 'total' => ['required', 'integer', 'min:0'],
        ]);
        $data['order_number'] = 'CRS-'.now()->format('ymd').'-'.str_pad((string) (Order::count() + 1), 4, '0', STR_PAD_LEFT);
        $order = Order::create($data);
        return response()->json(['message' => 'Pesanan berhasil dibuat.', 'data' => $this->present($order)], 201);
    }

    private function present(Order $order): array
    {
        return ['id' => $order->order_number, 'customer' => $order->customer_name, 'date' => $order->created_at->format('d/m/Y'), 'products' => implode(', ', $order->products), 'items' => $order->item_count, 'payment' => $order->payment_method, 'total' => $order->total, 'status' => $order->status];
    }
}
