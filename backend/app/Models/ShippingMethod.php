<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingMethod extends Model
{
    protected $fillable = ['code', 'name', 'provider', 'is_active'];
    protected function casts(): array { return ['is_active' => 'boolean']; }

    public static function configuredCodes(): array
    {
        return array_values(array_filter(array_map(static fn (string $code): string => strtolower(trim($code)), explode(',', (string) config('services.rajaongkir.couriers', 'jne,jnt,sicepat,pos,tiki')))));
    }

    public static function ensureDefaults(): void
    {
        $names = [
            'jne' => 'JNE', 'sicepat' => 'SiCepat', 'ide' => 'ID Express', 'sap' => 'SAP Express',
            'jnt' => 'J&T Express', 'ninja' => 'Ninja Xpress', 'tiki' => 'TIKI', 'lion' => 'Lion Parcel',
            'anteraja' => 'AnterAja', 'pos' => 'POS Indonesia', 'ncs' => 'NCS', 'rex' => 'REX',
            'rpx' => 'RPX', 'sentral' => 'Sentral Cargo', 'star' => 'Star Cargo', 'wahana' => 'Wahana',
            'dse' => 'DSE',
        ];
        foreach (self::configuredCodes() as $code) {
            $name = $names[$code] ?? strtoupper($code);
            self::firstOrCreate(['code' => $code], ['name' => $name, 'provider' => 'RajaOngkir', 'is_active' => false]);
        }
    }
}
