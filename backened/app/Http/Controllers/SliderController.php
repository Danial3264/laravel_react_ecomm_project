<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Slider;
use Illuminate\Support\Facades\Storage;

class SliderController extends Controller
{
    // GET - Return all sliders
    public function index()
    {
        $sliders = Slider::all();
        return response()->json($sliders, 200);
    }

    // POST - Add a new slider
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'slider_hook' => 'required|string|max:255',
            'slider_story' => 'required|string',
            'slider_buttonText' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        // Image upload handling
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('public/images');
            $imagePath = Storage::url($path);
            $validatedData['slider_image'] = $imagePath; // Save path to slider_image field
        }

        // Create and save the new slider
        $slider = Slider::create([
            'slider_hook' => $validatedData['slider_hook'],
            'slider_story' => $validatedData['slider_story'],
            'slider_buttonText' => $validatedData['slider_buttonText'],
            'slider_image' => $validatedData['slider_image']
        ]);

        return response()->json([
            'message' => 'Slider created successfully!',
            'slider' => $slider
        ], 201);
    }

    // DELETE - Delete a specific slider
    public function destroy($id)
    {
        $slider = Slider::find($id);

        if (!$slider) {
            return response()->json(['message' => 'Slider not found'], 404);
        }

        $slider->delete();

        return response()->json(['message' => 'Slider deleted successfully!'], 200);
    }
}
