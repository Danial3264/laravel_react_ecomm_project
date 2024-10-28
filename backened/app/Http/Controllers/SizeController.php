<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Size;

class SizeController extends Controller
{
     // GET - Return all sizes
     public function index()
     {
         $sizes = Size::all();
         return response()->json($sizes, 200);
     }
 
     // POST - Add a new size
     public function store(Request $request)
     {
         $validatedData = $request->validate([
             'size' => 'required|string',
         ]);
 
         $size = Size::create($validatedData);
 
         return response()->json([
             'message' => 'size created successfully!',
             'size' => $size
         ], 201);
     }
 
     // PUT - Update a specific size
     public function update(Request $request, $id)
     {
         $size = Size::find($id);
 
         if (!$size) {
             return response()->json(['message' => 'size not found'], 404);
         }
 
         $validatedData = $request->validate([
             'size' => 'sometimes|string'
         ]);
 
         $size->update($validatedData);
 
         return response()->json([
             'message' => 'Product updated successfully!',
             'size' => $size
         ], 200);
     }
 
     // DELETE - Delete a specific product
     public function destroy($id)
     {
         $size = Size::find($id);
 
         if (!$size) {
             return response()->json(['message' => 'size not found'], 404);
         }
 
         $size->delete();
 
         return response()->json(['message' => 'size deleted successfully!'], 200);
     }
}
