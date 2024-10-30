<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Steadfast;

class SteadfastController extends Controller
{
    public function index()
    {
        $api = Steadfast::all();
        return response()->json($api, 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'sf_api' => 'required|string',
            'sf_secret_key' => 'required|string',
        ]);


        $api = Steadfast::create($validatedData);

        return response()->json([
            'message' => 'API created successfully!',
            'steadfast' => $api
        ], 201);
    }

    public function destroy($id)
    {
        $st_api = Steadfast::find($id);

        if (!$st_api) {
            return response()->json(['message' => 'Api not found'], 404);
        }
        $st_api->delete();

        return response()->json(['message' => 'Api deleted successfully!'], 200);
    }
}
