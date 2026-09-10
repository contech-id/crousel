<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['order_number', 'customer_name', 'products', 'item_count', 'payment_method', 'total', 'status'];
    protected function casts(): array { return ['products' => 'array', 'item_count' => 'integer', 'total' => 'integer']; }
}
