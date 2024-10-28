<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Category;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
     // GET - Return all categories
     public function index()
     {
         $categories = Category::all();
         return response()->json($categories, 200);
     }
 
     // POST - Add a new category
     public function store(Request $request)
        {
            // Validate input data
            $validatedData = $request->validate([
                'category_name' => 'required|string|max:255',
                'category_shipping_cost' => 'required|numeric',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048'  // Image validation
            ]);

            // Image upload handling
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('public/images');
                $imagePath = Storage::url($path);
                $validatedData['category_image'] = $imagePath; // Save path to category_image field
            }


            // Create category with validated data
            $category = Category::create($validatedData);

            return response()->json([
                'message' => 'Category created successfully!',
                'category' => $category
            ], 201);
        }
 
     // PUT - Update a specific category
     public function update(Request $request, $id)
     {
         $category = Category::find($id);
 
         if (!$category) {
             return response()->json(['message' => 'category not found'], 404);
         }
 
         $validatedData = $request->validate([
             'category_name' => 'sometimes|string|max:255',
             'category_image' => 'sometimes|string',
             'category_shipping_cost' => 'sometimes|numeric'
         ]);
 
         $category->update($validatedData);
 
         return response()->json([
             'message' => 'Product updated successfully!',
             'category' => $category
         ], 200);
     }
 
     // DELETE - Delete a specific product
     public function destroy($id)
     {
         $category = Category::find($id);
 
         if (!$category) {
             return response()->json(['message' => 'category not found'], 404);
         }
 
         $category->delete();
 
         return response()->json(['message' => 'category deleted successfully!'], 200);
     }
}
