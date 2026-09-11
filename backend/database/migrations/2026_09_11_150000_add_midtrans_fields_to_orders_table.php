<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->unsignedBigInteger('user_id')->nullable()->after('id');
            $table->unsignedBigInteger('shipping_cost')->default(0)->after('total');
            $table->string('shipping_courier')->nullable()->after('shipping_cost');
            $table->string('shipping_service')->nullable()->after('shipping_courier');
            $table->string('payment_status')->default('pending')->after('status');
            $table->string('transaction_status')->nullable()->after('payment_status');
            $table->unsignedBigInteger('gross_amount')->default(0)->after('transaction_status');
            $table->string('midtrans_transaction_id')->nullable()->after('gross_amount');
            $table->text('snap_token')->nullable()->after('midtrans_transaction_id');
            $table->timestamp('paid_at')->nullable()->after('snap_token');
        });

        Schema::table('orders', function (Blueprint $table): void {
            $table->string('payment_method')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->string('payment_method')->nullable(false)->change();
            $table->dropColumn(['user_id', 'shipping_cost', 'shipping_courier', 'shipping_service', 'payment_status', 'transaction_status', 'gross_amount', 'midtrans_transaction_id', 'snap_token', 'paid_at']);
        });
    }
};
