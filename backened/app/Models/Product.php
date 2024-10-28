<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_name', 
        'product_price', 
        'offer_price',
        'product_description',
        'size',
        'category_id',
        'product_image'
    ];
}
