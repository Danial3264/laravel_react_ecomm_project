<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('orderNumber')->unique();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->decimal('total_amount', 10, 2);
            $table->decimal('shipping_cost', 10, 2);
            $table->string('payment_method');
            $table->string('payment_status');
            $table->string('tnx_mobile_number');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};