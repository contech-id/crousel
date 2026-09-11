<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\MidtransService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MidtransWebhookController extends Controller
{
    public function __invoke(Request $request, MidtransService $midtrans): JsonResponse
    {
        $data = $request->validate([
            'order_id' => ['required', 'string', 'max:100'],
            'status_code' => ['required', 'string'],
            'gross_amount' => ['required', 'string'],
            'signature_key' => ['required', 'string'],
            'transaction_status' => ['required', 'string'],
            'transaction_id' => ['nullable', 'string', 'max:150'],
            'payment_type' => ['nullable', 'string', 'max:100'],
            'settlement_time' => ['nullable', 'date'],
        ]);

        if (! $midtrans->verifySignature($data['order_id'], $data['status_code'], $data['gross_amount'], $data['signature_key'])) {
            return response()->json(['message' => 'Signature notification tidak valid.'], 403);
        }

        $order = Order::where('order_number', $data['order_id'])->first();
        if (! $order) return response()->json(['message' => 'Order tidak ditemukan.'], 404);
        if ((int) $order->gross_amount !== (int) round((float) $data['gross_amount'])) {
            return response()->json(['message' => 'Nominal transaksi tidak sesuai.'], 422);
        }

        $transactionStatus = strtolower($data['transaction_status']);
        $paymentStatus = match ($transactionStatus) {
            'settlement', 'capture' => 'paid',
            'pending' => 'pending',
            'deny', 'failure' => 'failed',
            'cancel' => 'cancelled',
            'expire' => 'expired',
            default => $order->payment_status ?: 'pending',
        };
        // Midtrans can retry notifications out of order. Never regress a
        // terminal/paid order back to pending or another lower state.
        $rank = ['pending' => 1, 'failed' => 2, 'cancelled' => 2, 'expired' => 2, 'paid' => 3];
        if (($rank[$order->payment_status ?? 'pending'] ?? 1) > ($rank[$paymentStatus] ?? 1)) {
            return response()->json(['message' => 'Notification sudah diproses.']);
        }
        $orderStatus = match ($paymentStatus) {
            'paid' => 'Diproses',
            'pending' => 'Menunggu pembayaran',
            default => 'Dibatalkan',
        };

        DB::transaction(function () use ($order, $data, $paymentStatus, $transactionStatus, $orderStatus): void {
            $order->update([
                'payment_method' => $data['payment_type'] ?? $order->payment_method,
                'payment_status' => $paymentStatus,
                'transaction_status' => $transactionStatus,
                'midtrans_transaction_id' => $data['transaction_id'] ?? $order->midtrans_transaction_id,
                'status' => $orderStatus,
                'paid_at' => $paymentStatus === 'paid' ? ($data['settlement_time'] ?? now()) : $order->paid_at,
            ]);
        });

        return response()->json(['message' => 'Notification berhasil diproses.']);
    }
}
