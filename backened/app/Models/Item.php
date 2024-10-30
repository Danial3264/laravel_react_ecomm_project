<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;
    protected $table = 'order_items';
    protected $fillable = ['order_id', 'product_id','product_name','product_price', 'size','quantity'];
}
