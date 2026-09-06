<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationSetting extends Model
{
    protected $fillable = ['new_customer', 'new_order'];
    protected function casts(): array { return ['new_customer' => 'boolean', 'new_order' => 'boolean']; }
}
