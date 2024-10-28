<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Logo;
use Illuminate\Support\Facades\Storage;

class LogoController extends Controller
{
    // GET - Return all logos
    public function index()
    {
        $logos = Logo::all();
        return response()->json($logos, 200);
    }

    // POST - Add a new logo
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Store the file in the 'public/logos' directory
        $path = $request->file('image')->store('public/logos');
        $logoPath = Storage::url($path); // Get public URL for the stored file

        // Save the logo path in the database
        $logo = Logo::create(['logo' => $logoPath]);

        return response()->json([
            'message' => 'Logo created successfully!',
            'logo' => $logo
        ], 201);
    }

    // PUT - Update a specific logo
    public function update(Request $request, $id)
    {
        $logo = Logo::find($id);

        if (!$logo) {
            return response()->json(['message' => 'logo not found'], 404);
        }

        $validatedData = $request->validate([
            'logo' => 'sometimes|string',
        ]);

        $logo->update($validatedData);

        return response()->json([
            'message' => 'Product updated successfully!',
            'logo' => $logo
        ], 200);
    }

    // DELETE - Delete a specific product
    public function destroy($id)
    {
        $logo = Logo::find($id);

        if (!$logo) {
            return response()->json(['message' => 'logo not found'], 404);
        }

        $logo->delete();

        return response()->json(['message' => 'logo deleted successfully!'], 200);
    }
}
