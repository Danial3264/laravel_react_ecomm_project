<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Custom;

class CustomController extends Controller
{
    // GET - Return all categories
    public function index()
    {
        $customcodes = Custom::all();
        return response()->json($customcodes, 200);
    }

    // POST - Add a new category
    public function store(Request $request)
       {
           // Validate input data
           $validatedData = $request->validate([
               'head_code' => 'nullable|string',
               'body_code' => 'nullable|string',
           ]);

           $customcode = Custom::create($validatedData);

           return response()->json([
               'message' => 'Custom Code created successfully!',
               'custom_code' => $customcode
           ], 201);
       }

    // PUT - Update a specific category
    public function update(Request $request, $id)
    {
        $customcode = Custom::find($id);

        if (!$customcode) {
            return response()->json(['message' => 'Custom code not found'], 404);
        }

        $validatedData = $request->validate([
            'head_code' => 'sometimes|string',
            'body_code' => 'sometimes|string',
        ]);

        $customcode->update($validatedData);

        return response()->json([
            'message' => 'custom code updated successfully!',
            'custom_code' => $customcode
        ], 200);
    }

    // DELETE - Delete a specific product
    public function destroy($id)
    {
        $customcode = Custom::find($id);

        if (!$customcode) {
            return response()->json(['message' => 'Custom code not found'], 404);
        }

        $customcode->delete();

        return response()->json(['message' => 'Custom code deleted successfully!'], 200);
    }
}
