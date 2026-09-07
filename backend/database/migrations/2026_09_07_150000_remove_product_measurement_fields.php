<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $columns = array_values(array_filter(
            ['wedgeHeight', 'packagingWeight'],
            static fn (string $column): bool => Schema::hasColumn('products', $column),
        ));

        if ($columns === []) {
            return;
        }

        Schema::table('products', function (Blueprint $table) use ($columns): void {
            $table->dropColumn($columns);
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            if (! Schema::hasColumn('products', 'wedgeHeight')) {
                $table->string('wedgeHeight', 100)->nullable();
            }

            if (! Schema::hasColumn('products', 'packagingWeight')) {
                $table->string('packagingWeight', 100)->nullable();
            }
        });
    }
};
