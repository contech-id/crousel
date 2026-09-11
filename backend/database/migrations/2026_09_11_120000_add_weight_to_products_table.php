<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (! Schema::hasColumn('products', 'weight')) {
            Schema::table('products', function (Blueprint $table): void {
                $table->unsignedInteger('weight')->default(500)->after('price');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('products', 'weight')) {
            Schema::table('products', function (Blueprint $table): void {
                $table->dropColumn('weight');
            });
        }
    }
};
