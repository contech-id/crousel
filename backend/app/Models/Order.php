<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number', 'user_id', 'customer_name', 'products', 'item_count', 'payment_method', 'total',
        'shipping_cost', 'shipping_courier', 'shipping_service', 'status', 'payment_status',
        'transaction_status', 'gross_amount', 'midtrans_transaction_id', 'snap_token', 'paid_at',
        'idempotency_key',
    ];
    protected function casts(): array
    {
        return [
            'products' => 'array', 'item_count' => 'integer', 'total' => 'integer', 'user_id' => 'integer',
            'shipping_cost' => 'integer', 'gross_amount' => 'integer', 'paid_at' => 'datetime',
        ];
    }
}
