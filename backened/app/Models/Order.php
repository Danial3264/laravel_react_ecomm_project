<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable = ['orderNumber', 'customer_id', 'total_amount', 'shipping_cost', 'payment_method', 'payment_status', 'tnx_mobile_number'];

    // An order belongs to a customer
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // An order can have many items
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
