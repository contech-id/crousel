<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table): void {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('category')->index();
            $table->string('target', 20)->index();
            $table->string('model');
            $table->string('color');
            $table->json('availableColors');
            $table->json('images');
            $table->text('shortDescription');
            $table->text('description');
            $table->string('price', 50);
            $table->text('material');
            $table->json('features');
            $table->json('availableSizes');
            $table->string('sandalLength', 100);
            $table->string('footLengthRecommendation', 100);
            $table->string('width', 100)->nullable();
            $table->string('wedgeHeight', 100)->nullable();
            $table->string('packagingWeight', 100)->nullable();
            $table->string('availability', 20)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
