<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'category',
        'target',
        'color',
        'availableColors',
        'images',
        'description',
        'price',
        'features',
        'availableSizes',
        'availability',
    ];

    protected function casts(): array
    {
        return [
            'availableColors' => 'array',
            'images' => 'array',
            'features' => 'array',
            'availableSizes' => 'array',
        ];
    }
}
