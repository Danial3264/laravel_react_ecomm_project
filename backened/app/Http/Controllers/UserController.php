<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        // সব ইউজারকে ডাটাবেস থেকে রিট্রিভ করা
        $users = User::all();

        // JSON ফরম্যাটে রেসপন্স করা
        return response()->json([
            'message' => 'Users retrieved successfully!',
            'users' => $users
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|string'
        ]);

        // ইউজার তৈরি করা
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role
        ]);

        return response()->json([
            'message' => 'User created successfully!',
            'user' => $user
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $users = User::find($id);

        if (!$users) {
            return response()->json(['message' => 'users not found'], 404);
        }

        $validatedData = $request->validate([
            'role' => 'sometimes|string',
        ]);

        $users->update($validatedData);

        return response()->json([
            'message' => 'user updated successfully!',
            'users' => $users
        ], 200);
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'user not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'user deleted successfully!'], 200);
    }

}
