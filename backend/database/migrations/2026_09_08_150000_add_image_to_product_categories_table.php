<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('product_categories', 'image')) {
            Schema::table('product_categories', function (Blueprint $table): void {
                $table->string('image')->nullable()->after('example_products');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('product_categories', 'image')) {
            Schema::table('product_categories', function (Blueprint $table): void {
                $table->dropColumn('image');
            });
        }
    }
};
