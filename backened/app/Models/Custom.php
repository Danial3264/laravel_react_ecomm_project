<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Custom extends Model
{
    use HasFactory;
    protected $table = 'custom_code';
    protected $fillable = [
        'head_code',
        'body_code'
    ];
}
