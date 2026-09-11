<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingMethod extends Model
{
    protected $fillable = ['code', 'name', 'provider', 'is_active'];
    protected function casts(): array { return ['is_active' => 'boolean']; }

    public static function ensureDefaults(): void
    {
        $couriers = [
            'jne' => 'JNE', 'sicepat' => 'SiCepat', 'ide' => 'ID Express', 'sap' => 'SAP Express',
            'jnt' => 'J&T Express', 'ninja' => 'Ninja Xpress', 'tiki' => 'TIKI', 'lion' => 'Lion Parcel',
            'anteraja' => 'AnterAja', 'pos' => 'POS Indonesia', 'ncs' => 'NCS', 'rex' => 'REX',
            'rpx' => 'RPX', 'sentral' => 'Sentral Cargo', 'star' => 'Star Cargo', 'wahana' => 'Wahana',
            'dse' => 'DSE',
        ];
        foreach ($couriers as $code => $name) {
            self::firstOrCreate(['code' => $code], ['name' => $name, 'provider' => 'RajaOngkir', 'is_active' => false]);
        }
    }
}
