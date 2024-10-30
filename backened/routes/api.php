<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SizeController;
use App\Http\Controllers\LogoController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\SliderController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\SteadfastController;
use App\Http\Controllers\CustomController;
use Laravel\Sanctum\Sanctum;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);


Route::get('/logos', [LogoController::class, 'index']);         
Route::post('/logos', [LogoController::class, 'store']);        
Route::put('/logos/{id}', [LogoController::class, 'update']);   
Route::delete('/logos/{id}', [LogoController::class, 'destroy']);


Route::get('/sliders', [SliderController::class, 'index']);         
Route::post('/sliders', [SliderController::class, 'store']);        
Route::delete('/sliders/{id}', [SliderController::class, 'destroy']);




Route::get('/products', [ProductController::class, 'index']);         
Route::post('/products', [ProductController::class, 'store']);       
Route::put('/products/{id}', [ProductController::class, 'update']);   
Route::delete('/products/{id}', [ProductController::class, 'destroy']); 
Route::get('/products/category/{category_id}', [ProductController::class, 'getProductsByCategory']);



Route::get('/categories', [CategoryController::class, 'index']);         
Route::post('/categories', [CategoryController::class, 'store']);        
Route::put('/categories/{id}', [CategoryController::class, 'update']);   
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']); 


Route::get('/sizes', [SizeController::class, 'index']);         
Route::post('/sizes', [SizeController::class, 'store']);        
Route::put('/sizes/{id}', [SizeController::class, 'update']);   
Route::delete('/sizes/{id}', [SizeController::class, 'destroy']); 


Route::get('/orders', [OrderController::class, 'getAllOrders']);         
Route::post('/orders', [OrderController::class, 'createOrder']);    
Route::put('/orders/{id}', [OrderController::class, 'updateOrder']);
Route::delete('/orders/{id}', [OrderController::class, 'deleteOrder']);


Route::get('/items', [ItemController::class, 'index']);  
Route::delete('/items/{order_id}/{product_id}', [ItemController::class, 'destroy']);




Route::get('/sf', [SteadfastController::class, 'index']);         
Route::post('/sf', [SteadfastController::class, 'store']);        
Route::put('/sf/{id}', [SteadfastController::class, 'update']);   
Route::delete('/sf/{id}', [SteadfastController::class, 'destroy']); 


Route::get('/custom', [CustomController::class, 'index']);         
Route::post('/custom', [CustomController::class, 'store']);        
Route::put('/custom/{id}', [CustomController::class, 'update']);   
Route::delete('/custom/{id}', [CustomController::class, 'destroy']); 






Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF token set']);
});










