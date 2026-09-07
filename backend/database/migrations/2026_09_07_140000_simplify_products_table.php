<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            $table->dropColumn([
                'model',
                'material',
                'shortDescription',
                'sandalLength',
                'footLengthRecommendation',
                'width',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            $table->string('model')->after('target');
            $table->text('material')->after('price');
            $table->text('shortDescription')->after('images');
            $table->string('sandalLength', 100)->after('availableSizes');
            $table->string('footLengthRecommendation', 100)->after('sandalLength');
            $table->string('width', 100)->nullable()->after('footLengthRecommendation');
        });
    }
};
