<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (! Schema::hasColumn('orders', 'idempotency_key')) {
            Schema::table('orders', function (Blueprint $table): void {
                $table->string('idempotency_key', 100)->nullable()->unique()->after('paid_at');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('orders', 'idempotency_key')) {
            Schema::table('orders', function (Blueprint $table): void { $table->dropColumn('idempotency_key'); });
        }
    }
};
