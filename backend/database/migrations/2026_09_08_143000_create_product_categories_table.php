<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_categories', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 30)->unique();
            $table->text('example_products');
            $table->timestamps();
        });

        $now = now();
        DB::table('product_categories')->insert([
            ['name' => 'unisex', 'example_products' => 'Serxes, Santos, Chester, Maxter, Garthen.', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'kids', 'example_products' => 'Maxter Kids, Invoker Kids, Vicenza Kids, Sakura Kids.', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'women', 'example_products' => 'Lilya White, Sakura White, Lantana White.', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'men', 'example_products' => 'Serxes, Santos, Chester.', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'wedges', 'example_products' => 'Nerona, Hestia, Caspine, Flavia, Joane, Roxana.', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'slop', 'example_products' => 'Serxes, Santos, Chester, Maiden, Alexios, Althair, Claymore.', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'slides', 'example_products' => 'Maxter, Garthen, Vicenza, Invoker.', 'created_at' => $now, 'updated_at' => $now],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('product_categories');
    }
};
