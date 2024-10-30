<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Steadfast extends Model
{
    use HasFactory;
    protected $table = 'steadfast';
    protected $fillable = [
        'sf_api', 
        'sf_secret_key'
    ];
}
