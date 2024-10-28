<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_name');
            $table->string('product_image');
            $table->decimal('product_price', 8, 2);
            $table->decimal('offer_price', 8, 2);
            $table->text('product_description');
            $table->string('size');
            $table->unsignedBigInteger('category_id');
            $table->timestamps();

            // যদি আপনি ক্যাটেগরি টেবিলের সাথে সম্পর্ক করতে চান তাহলে foreign key যুক্ত করতে পারেন:
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};
