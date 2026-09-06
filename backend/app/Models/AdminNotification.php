<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminNotification extends Model
{
    protected $table = 'notifications';
    protected $fillable = ['type', 'title', 'message', 'read_at'];
    protected function casts(): array { return ['read_at' => 'datetime']; }
}
