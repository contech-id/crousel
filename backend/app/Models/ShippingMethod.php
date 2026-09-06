<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingMethod extends Model
{
    protected $fillable = ['code', 'name', 'provider', 'is_active'];
    protected function casts(): array { return ['is_active' => 'boolean']; }
}
