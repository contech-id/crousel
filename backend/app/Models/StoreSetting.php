<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreSetting extends Model
{
    protected $fillable = ['store_name', 'store_email', 'whatsapp', 'province', 'regency', 'district', 'village', 'postal_code', 'address', 'location_landmark'];
}
