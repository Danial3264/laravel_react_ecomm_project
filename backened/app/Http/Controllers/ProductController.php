<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // GET - Return all products
    public function index()
    {
        $products = Product::all();
        return response()->json($products, 200);
    }

    // POST - Add a new product
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'product_name' => 'required|string|max:255',
            'product_price' => 'required|numeric',
            'offer_price' => 'required|numeric',
            'product_description' => 'required|string',
            'size' => 'required|string',
            'category_id' => 'required|integer',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        // Image upload handling
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('public/images');
            $imagePath = Storage::url($path);
            $validatedData['product_image'] = $imagePath;
        }

        $product = Product::create($validatedData);

        return response()->json([
            'message' => 'Product created successfully!',
            'product' => $product
        ], 201);
    }

    public function getProductsByCategory($category_id)
    {
        // category_id দিয়ে পণ্য অনুসন্ধান করা
        $products = Product::where('category_id', $category_id)->get();

        // যদি পণ্য পাওয়া যায় তবে সেগুলো রিটার্ন করো, অন্যথায় একটি খালি array রিটার্ন করো
        if($products->isEmpty()){
            return response()->json(['message' => 'No products found in this category'], 404);
        }

        return response()->json($products, 200);
    }

    // PUT - Update a specific product
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $validatedData = $request->validate([
            'product_name' => 'sometimes|string|max:255',
            'product_price' => 'sometimes|numeric',
            'offer_price' => 'sometimes|numeric',
            'product_description' => 'sometimes|string',
            'size' => 'sometimes|string',
            'category_id' => 'sometimes|integer',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        // Handle the image upload if a new image is provided
        if ($request->hasFile('image')) {
            // Remove the old image if it exists
            if ($product->product_image) {
                $oldImagePath = str_replace('/storage', 'public', $product->product_image);
                Storage::delete($oldImagePath);  // Delete the old image
            }

            // Upload the new image
            $path = $request->file('image')->store('public/images');
            $imagePath = Storage::url($path);
            $validatedData['product_image'] = $imagePath;  // Save the new image path
        }



        $product->update($validatedData);

        return response()->json([
            'message' => 'Product updated successfully!',
            'product' => $product
        ], 200);
    }

    // DELETE - Delete a specific product
    public function destroy($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully!'], 200);
    }
}
